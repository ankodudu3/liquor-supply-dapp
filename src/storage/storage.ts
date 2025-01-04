import { StableBTreeMap, text } from "azle/experimental";
import { InventoryAdjustment, LiquorProduct, SaleRecord, SupplyChainEvent, User } from "../dataType/dataType";



// Storage
const usersStorage = StableBTreeMap<text, User>(0);
const liquorProductsStorage = StableBTreeMap<text, LiquorProduct>(1);
const supplyChainEventsStorage = StableBTreeMap<text, SupplyChainEvent>(2);
const saleRecordsStorage = StableBTreeMap<text, SaleRecord>(3);
const inventoryAdjustmentsStorage = StableBTreeMap<text, InventoryAdjustment>(4);

export  {
    usersStorage,
    liquorProductsStorage,
    supplyChainEventsStorage,
    saleRecordsStorage,
    inventoryAdjustmentsStorage
}