import {
  Canister,
  Err,
  Ok,
  Principal,
  Record,
  Result,
  StableBTreeMap,
  Variant,
  Vec,
  ic,
  nat64,
  query,
  text,
  update,
  Opt,
  Null,
  None,
  Some,
  bool
} from "azle/experimental";

// Record Types
const User = Record({
  id: Principal,
  username: text,
  role: text,
  points: nat64,
  contactInfo: text,
});

type User = typeof User.tsType;

const LiquorProduct = Record({
  id: text,
  userId: text,
  name: text,
  type: text,
  brand: text,
  alcoholContent: nat64,
  batchNumber: text,
  vintageYear: Opt(text),
  bottleSize: text,
  costPrice: nat64,
  retailPrice: nat64,
  currentStock: nat64,
  expiryDate: Opt(text),
});

type LiquorProduct = typeof LiquorProduct.tsType;

const SupplyChainEvent = Record({
  id: text,
  liquorProductId: text,
  eventType: text,
  location: text,
  quantity: nat64,
  date: nat64,
  participantId: text,
});

type SupplyChainEvent = typeof SupplyChainEvent.tsType;

const SaleRecord = Record({
  id: text,
  liquorProductId: text,
  quantity: nat64,
  totalPrice: nat64,
  saleDate: nat64,
  salesStaffId: text,
  customerAge: nat64,
});

type SaleRecord = typeof SaleRecord.tsType;

const InventoryAdjustment = Record({
  id: text,
  liquorProductId: text,
  quantityChanged: nat64,
  reason: text,
  adjustedBy: text,
  adjustmentDate: nat64,
});

type InventoryAdjustment = typeof InventoryAdjustment.tsType;

// Payload Types
const UserPayload = Record({
  username: text,
  role: text,
  contactInfo: text,
});

const LiquorProductPayload = Record({
  name: text,
  userId: text,
  type: text,
  brand: text,
  alcoholContent: nat64,
  batchNumber: text,
  vintageYear: Opt(text),
  bottleSize: text,
  costPrice: nat64,
  retailPrice: nat64,
  currentStock: nat64,
  expiryDate: Opt(text),
});

const SupplyChainEventPayload = Record({
  liquorProductId: text,
  eventType: text,
  location: text,
  quantity: nat64,
  participantId: text,
});

const SaleRecordPayload = Record({
  liquorProductId: text,
  quantity: nat64,
  salesStaffId: text,
  customerAge: nat64,
});

const InventoryAdjustmentPayload = Record({
  liquorProductId: text,
  quantityChanged: nat64,
  reason: text,
  adjustedBy: text,
});

// Storage
const usersStorage = StableBTreeMap<text, User>(0);
const liquorProductsStorage = StableBTreeMap<text, LiquorProduct>(1);
const supplyChainEventsStorage = StableBTreeMap<text, SupplyChainEvent>(2);
const saleRecordsStorage = StableBTreeMap<text, SaleRecord>(3);
const inventoryAdjustmentsStorage = StableBTreeMap<text, InventoryAdjustment>(4);

// Errors
const Errors = Variant({
  UserAlreadyExists: text,
  UserDoesNotExist: text,
  ProductAlreadyExists: text,
  ProductDoesNotExist: text,
  InsufficientStock: text,
  InvalidPayload: text,
  Unauthorized: text,
  AgeRestriction: text,
});

type Errors = typeof Errors.tsType;

// Canister Methods
export default Canister({
  registerUser: update([UserPayload], Result(text, Errors), (payload) => {
    if (!payload.username) {
      return Err({ InvalidPayload: "Username is required" });
    }
    const existingUser = usersStorage.get(payload.username);
    if (existingUser) {
      return Err({ UserAlreadyExists: `User with username ${payload.username} already exists` });
    }

    const createUser: User = {
      id: ic.caller(),
      username: payload.username,
      role: payload.role,
      points: 0n,
      contactInfo: payload.contactInfo,
    };

    usersStorage.insert(payload.username, createUser);
    return Ok(`User with username ${payload.username} created successfully`);
  }),

  addLiquorProduct: update([LiquorProductPayload], Result(text, Errors), (payload) => {
    if (!payload.name) {
      return Err({ InvalidPayload: "Product name is required" });
    }
    const existingProduct = liquorProductsStorage.get(payload.name);
    if (existingProduct) {
      return Err({ ProductAlreadyExists: `Product with name ${payload.name} already exists` });
    }

    const product: LiquorProduct = {
      id: ic.caller().toText(),
      ...payload,
    };

    liquorProductsStorage.insert(payload.name, product);
    return Ok(`Product ${payload.name} added successfully`);
  }),

  listAllProducts: query([], Vec(LiquorProduct), () => {
    return liquorProductsStorage.values();
  }),

  sellLiquorProduct: update([SaleRecordPayload], Result(text, Errors), (payload) => {
    const product = liquorProductsStorage.get(payload.liquorProductId);
    if (!product) {
      return Err({ ProductDoesNotExist: `Product with ID ${payload.liquorProductId} does not exist` });
    }

    if (product.currentStock < payload.quantity) {
      return Err({ InsufficientStock: `Insufficient stock to sell ${payload.quantity} units` });
    }

    if (payload.customerAge < 21n) {
      return Err({ AgeRestriction: `Customer must be at least 21 years old to purchase` });
    }

    const sale: SaleRecord = {
      id: ic.caller().toText(),
      ...payload,
      totalPrice: product.retailPrice * payload.quantity,
      saleDate: ic.time(),
    };

    product.currentStock -= payload.quantity;
    liquorProductsStorage.insert(product.id, product);
    saleRecordsStorage.insert(sale.id, sale);
    return Ok(`Sold ${payload.quantity} units of ${product.name}`);
  }),

  listAllSales: query([], Vec(SaleRecord), () => {
    return saleRecordsStorage.values();
  }),

  adjustInventory: update([InventoryAdjustmentPayload], Result(text, Errors), (payload) => {
    const product = liquorProductsStorage.get(payload.liquorProductId);
    if (!product) {
      return Err({ ProductDoesNotExist: `Product with ID ${payload.liquorProductId} does not exist` });
    }

    product.currentStock += payload.quantityChanged;

    const adjustment: InventoryAdjustment = {
      id: ic.caller().toText(),
      ...payload,
      adjustmentDate: ic.time(),
    };

    liquorProductsStorage.insert(product.id, product);
    inventoryAdjustmentsStorage.insert(adjustment.id, adjustment);
    return Ok(`Inventory adjusted for product ${product.name}`);
  }),

  listAllInventoryAdjustments: query([], Vec(InventoryAdjustment), () => {
    return inventoryAdjustmentsStorage.values();
  }),

  logSupplyChainEvent: update([SupplyChainEventPayload], Result(text, Errors), (payload) => {
    const event: SupplyChainEvent = {
      id: ic.caller().toText(),
      ...payload,
      date: ic.time(),
    };

    supplyChainEventsStorage.insert(event.id, event);
    return Ok(`Supply chain event of type ${payload.eventType} recorded`);
  }),

  listSupplyChainEvents: query([], Vec(SupplyChainEvent), () => {
    return supplyChainEventsStorage.values();
  }),
});

// Helper Function
function generateId(): Principal {
  const randomBytes = new Array(29)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256));
  return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}
