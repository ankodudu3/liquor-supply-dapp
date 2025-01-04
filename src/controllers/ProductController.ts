import { Err, ic, Ok } from "azle/experimental"
import { LiquorProduct, LiquorProductPayload, SaleRecord, SaleRecordPayload } from "../dataType/dataType"
import { liquorProductsStorage, saleRecordsStorage } from "../storage/storage";



class ProductController {
  static addLiquorProduct=(payload:LiquorProductPayload)=>{
    try{
        if (!payload.name) {
            return Err({ InvalidPayload: "Product name is required" });
          }
          const existingProduct = liquorProductsStorage.get(payload.name);
          if (existingProduct) {
            return Err({ ProductAlreadyExists: `Product with name ${payload.name} already exists` });
          }
      
          const product: LiquorProduct = {
            id: JSON.stringify(ic.caller()),
            ...payload,
          };
      
          liquorProductsStorage.insert(payload.name, product);
          return Ok(`Product ${payload.name} added successfully`);

    }catch(error: any) {
        return Err({ Error: `Error occured ${error.message}`})
    }
  }

  static sellLiquorProduct=(payload: SaleRecordPayload)=>{
    try{
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
          id: JSON.stringify(ic.caller()),
          ...payload,
          totalPrice: product.retailPrice * payload.quantity,
          saleDate: ic.time(),
        };
    
        product.currentStock -= payload.quantity;
        liquorProductsStorage.insert(product.id, product);
        saleRecordsStorage.insert(sale.id, sale);
        return Ok(`Sold ${payload.quantity} units of ${product.name}`);
    }catch(error:any) {
        return Err({Error: `Error occured ${error.message}`})
    }
  }
  
}

export default ProductController