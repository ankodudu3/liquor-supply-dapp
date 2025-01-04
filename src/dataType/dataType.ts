import { 
    text, 
    Record,
    nat64,
    Principal,
    Opt,
    Variant

 } from "azle/experimental"


// Record Types
export const User = Record({
    id: Principal,
    username: text,
    role: text,
    points: nat64,
    contactInfo: text,
  });
  
  export type User = typeof User.tsType;
  
  export const LiquorProduct = Record({
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
  
  export type LiquorProduct = typeof LiquorProduct.tsType;
  
  export const SupplyChainEvent = Record({
    id: text,
    liquorProductId: text,
    eventType: text,
    location: text,
    quantity: nat64,
    date: nat64,
    participantId: text,
  });
  
 export type SupplyChainEvent = typeof SupplyChainEvent.tsType;
  
  export const SaleRecord = Record({
    id: text,
    liquorProductId: text,
    quantity: nat64,
    totalPrice: nat64,
    saleDate: nat64,
    salesStaffId: text,
    customerAge: nat64,
  });
  
  export type SaleRecord = typeof SaleRecord.tsType;
  
 export const InventoryAdjustment = Record({
    id: text,
    liquorProductId: text,
    quantityChanged: nat64,
    reason: text,
    adjustedBy: text,
    adjustmentDate: nat64,
  });
  
 export type InventoryAdjustment = typeof InventoryAdjustment.tsType;
  
  // Payload Types
  export const UserPayload = Record({
    username: text,
    role: text,
    contactInfo: text,
  });
  
  export type UserPayload = typeof UserPayload.tsType
  export const LiquorProductPayload = Record({
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

  export type LiquorProductPayload = typeof LiquorProductPayload.tsType

  export const SupplyChainEventPayload = Record({
    liquorProductId: text,
    eventType: text,
    location: text,
    quantity: nat64,
    participantId: text,
  });
  export type SupplyChainEventPayload = typeof SupplyChainEventPayload.tsType 
  export const SaleRecordPayload = Record({
    liquorProductId: text,
    quantity: nat64,
    salesStaffId: text,
    customerAge: nat64,
  });
  export type SaleRecordPayload  = typeof SaleRecordPayload.tsType
  
  export const InventoryAdjustmentPayload = Record({
    liquorProductId: text,
    quantityChanged: nat64,
    reason: text,
    adjustedBy: text,
  });

  export type InventoryAdjustmentPayload = typeof  InventoryAdjustmentPayload.tsType

  // Errors
export const Errors = Variant({
    UserAlreadyExists: text,
    UserDoesNotExist: text,
    ProductAlreadyExists: text,
    ProductDoesNotExist: text,
    InsufficientStock: text,
    InvalidPayload: text,
    Unauthorized: text,
    AgeRestriction: text,
    Error: text
  });
  
  export type Errors = typeof Errors.tsType;