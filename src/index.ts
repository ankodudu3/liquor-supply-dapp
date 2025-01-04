import {
  Canister,
  Result,
  Vec,
  query,
  text,
  update
} from "azle/experimental";
import { Errors, InventoryAdjustment, InventoryAdjustmentPayload, LiquorProduct, LiquorProductPayload, SaleRecord, SaleRecordPayload, SupplyChainEvent, SupplyChainEventPayload, User, UserPayload } from "./dataType/dataType";
import { inventoryAdjustmentsStorage, liquorProductsStorage, saleRecordsStorage, supplyChainEventsStorage, usersStorage } from "./storage/storage";
import UserController from "./controllers/UserController";
import ProductController from "./controllers/ProductController";
import InventoryController from "./controllers/InventoryController";
import SupplyController from "./controllers/SupplyController";






// Canister Methods
export default Canister({
  registerUser: update([UserPayload], Result(text, Errors), (payload) => {
    return UserController.registerUser(payload)
  }),

  addLiquorProduct: update([LiquorProductPayload], Result(text, Errors), (payload) => {
     return ProductController.addLiquorProduct(payload)
  }),

  listAllProducts: query([], Vec(LiquorProduct), () => {
    return liquorProductsStorage.values();
  }),

  sellLiquorProduct: update([SaleRecordPayload], Result(text, Errors), (payload) => {
    return ProductController.sellLiquorProduct(payload)
  }),

  listAllSales: query([], Vec(SaleRecord), () => {
    return saleRecordsStorage.values();
  }),

  adjustInventory: update([InventoryAdjustmentPayload], Result(text, Errors), (payload) => {
    return InventoryController.adjustInventory(payload)
  }),

  listAllInventoryAdjustments: query([], Vec(InventoryAdjustment), () => {
    return inventoryAdjustmentsStorage.values();
  }),

  logSupplyChainEvent: update([SupplyChainEventPayload], Result(text, Errors), (payload) => {
    return SupplyController.logSupplyChainEvent(payload)
  }),

  listSupplyChainEvents: query([], Vec(SupplyChainEvent), () => {
    return supplyChainEventsStorage.values();
  }),
});

