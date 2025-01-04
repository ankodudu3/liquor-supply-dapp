import { Principal } from "azle/experimental";

// Helper Function
export function generateId(): Principal {
    const randomBytes = new Array(29)
      .fill(0)
      .map(() => Math.floor(Math.random() * 256));
    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
  }
  