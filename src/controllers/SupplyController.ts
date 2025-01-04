import { Err, ic, Ok } from "azle/experimental"
import { SupplyChainEvent, SupplyChainEventPayload } from "../dataType/dataType";
import { supplyChainEventsStorage } from "../storage/storage";



class SupplyController {
  static logSupplyChainEvent=(payload:SupplyChainEventPayload)=>{
    try{
        const event: SupplyChainEvent = {
            id: JSON.stringify(ic.caller()),
            ...payload,
            date: ic.time(),
          };
      
          supplyChainEventsStorage.insert(event.id, event);
          return Ok(`Supply chain event of type ${payload.eventType} recorded`);
    }catch(error: any){
        return Err({Error: `Error Occured ${error.message}`})
    }
  }
}

export default SupplyController