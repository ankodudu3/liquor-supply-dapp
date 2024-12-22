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
  // Validate username
  if (!payload.username || payload.username.trim().length === 0) {
    return Err({ InvalidPayload: "Username is required and cannot be empty" });
  }

  // Validate contactInfo (e.g., check if it's a valid email or phone number)
  if (!validateContactInfo(payload.contactInfo)) {
    return Err({ InvalidPayload: "Invalid contact information" });
  }

  // Validate role
  const validRoles = ["user", "admin", "staff"]; // Define allowed roles
  if (!validRoles.includes(payload.role)) {
    return Err({ InvalidPayload: `Role must be one of the following: ${validRoles.join(", ")}` });
  }

  // Ensure the user is unique by their Principal (caller)
  const callerId = ic.caller().toText();
  const existingUser = usersStorage.values().find(user => user.id.toText() === callerId);
  if (existingUser) {
    return Err({ UserAlreadyExists: `User with Principal ID ${callerId} already exists` });
  }

  // Create and store the new user
  const newUser: User = {
    id: ic.caller(),
    username: payload.username,
    role: payload.role,
    points: 0n,
    contactInfo: payload.contactInfo,
  };

  usersStorage.insert(callerId, newUser);
  return Ok(`User with username ${payload.username} registered successfully`);
}),

 addLiquorProduct: update([LiquorProductPayload], Result(text, Errors), (payload) => {
  // Validate user role for authorization
  const callerId = ic.caller().toText();
  const user = usersStorage.get(callerId);
  if (!user) {
    return Err({ Unauthorized: "User not registered" });
  }
  if (user.role !== "admin" && user.role !== "staff") {
    return Err({ Unauthorized: "You are not authorized to add liquor products" });
  }

  // Validate required fields
  if (!payload.name || payload.name.trim().length === 0) {
    return Err({ InvalidPayload: "Product name is required and cannot be empty" });
  }

  // Sanitize inputs (e.g., trim unnecessary whitespace)
  const sanitizedProductName = payload.name.trim();

  // Validate numeric fields are positive
  if (payload.alcoholContent < 0n || payload.costPrice < 0n || payload.retailPrice < 0n || payload.currentStock < 0n) {
    return Err({ InvalidPayload: "Numeric fields must be positive" });
  }

  // Generate a unique ID for the liquor product
  const uniqueId = generateId();

  // Create the new LiquorProduct record
  const product: LiquorProduct = {
    id: uniqueId.toText(),
    userId: callerId,
    name: sanitizedProductName,
    type: payload.type,
    brand: payload.brand,
    alcoholContent: payload.alcoholContent,
    batchNumber: payload.batchNumber,
    vintageYear: payload.vintageYear,
    bottleSize: payload.bottleSize,
    costPrice: payload.costPrice,
    retailPrice: payload.retailPrice,
    currentStock: payload.currentStock,
    expiryDate: payload.expiryDate,
  };

  // Store the product in the storage map
  liquorProductsStorage.insert(uniqueId.toText(), product);

  return Ok(`Product ${sanitizedProductName} added successfully with ID ${uniqueId.toText()}`);
}),

  
  listAllProducts: query([nat64, nat64], Result(Vec(LiquorProduct), Errors), (offset, limit) => {
  // Validate user role for authorization
  const callerId = ic.caller().toText();
  const user = usersStorage.get(callerId);
  if (!user) {
    return Err({ Unauthorized: "User not registered" });
  }
  if (user.role !== "admin" && user.role !== "staff") {
    return Err({ Unauthorized: "You are not authorized to view products" });
  }

  // Validate pagination parameters
  if (offset < 0n || limit <= 0n) {
    return Err({ InvalidPayload: "Offset must be non-negative, and limit must be positive" });
  }

  // Retrieve all products
  const allProducts = liquorProductsStorage.values();

  // Apply pagination
  const paginatedProducts = allProducts.slice(Number(offset), Number(offset + limit));

  return Ok(paginatedProducts);
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
  // Validate user role for authorization
  const callerId = ic.caller().toText();
  const user = usersStorage.get(callerId);
  if (!user) {
    return Err({ Unauthorized: "User not registered" });
  }
  if (user.role !== "admin" && user.role !== "staff") {
    return Err({ Unauthorized: "You are not authorized to adjust inventory" });
  }

  // Retrieve the product
  const product = liquorProductsStorage.get(payload.liquorProductId);
  if (!product) {
    return Err({ ProductDoesNotExist: `Product with ID ${payload.liquorProductId} does not exist` });
  }

  // Validate that the inventory adjustment will not result in negative stock
  const newStock = product.currentStock + payload.quantityChanged;
  if (newStock < 0n) {
    return Err({ InvalidPayload: `Adjustment would result in negative stock. Current stock is ${product.currentStock}` });
  }

  // Generate a unique ID for the inventory adjustment
  const adjustmentId = generateId().toText();

  // Apply the inventory adjustment
  product.currentStock = newStock;

  const adjustment: InventoryAdjustment = {
    id: adjustmentId,
    liquorProductId: payload.liquorProductId,
    quantityChanged: payload.quantityChanged,
    reason: payload.reason,
    adjustedBy: callerId,
    adjustmentDate: ic.time(),
  };

  // Update the storage
  liquorProductsStorage.insert(product.id, product);
  inventoryAdjustmentsStorage.insert(adjustmentId, adjustment);

  return Ok(`Inventory adjusted for product ${product.name}. New stock: ${product.currentStock}`);
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
