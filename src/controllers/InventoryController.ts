import { Err, ic, Ok } from "azle/experimental"
import { InventoryAdjustment, InventoryAdjustmentPayload } from "../dataType/dataType"
import { inventoryAdjustmentsStorage, liquorProductsStorage } from "../storage/storage";



class InventoryController {
    static adjustInventory=(payload:InventoryAdjustmentPayload)=>{
        try{
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
        }catch(error: any) {
            return Err({Error: `Error occured ${error.message}`})
        }
    }

}


export default InventoryController