import { Err, ic, Ok } from "azle/experimental"
import { User, UserPayload } from "../dataType/dataType";
import { usersStorage } from "../storage/storage";



class UserController {
    static registerUser=(payload:UserPayload)=>{
        try{
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
        }catch(error: any) {
            return Err({Error: `Error occured ${error.message}`})
        }
    }
}

export default UserController