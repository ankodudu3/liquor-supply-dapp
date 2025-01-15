/**
 * @file Liquor Supply Management System Canister
 * @description A comprehensive liquor supply management system implemented as an Internet Computer canister
 * using the Azle framework. This system handles user registration, role management, and queries
 * with proper error handling and data validation.
 */

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
  update,
  text,
  Null,
  Opt,
} from "azle/experimental";
import { v4 as uuidv4 } from "uuid";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User Role Variant
 * Represents different roles of the user in the system
 */
const UserRole = Variant({
  Admin: Null,
  Manager: Null,
  Staff: Null,
  Customer: Null,
});

type UserRole = typeof UserRole.tsType;

/**
 * User Record Type
 * Defines the structure of a user in the system
 */
const User = Record({
  id: text, // Unique identifier for the user
  owner: Principal, // Principal ID of the user (from IC)
  username: text, // Unique username
  role: UserRole, // User's role in the system
  points: nat64, // Reward/reputation points
  contactInfo: text, // User's contact information
  createdAt: text, // Timestamp of user creation
  lastUpdated: text, // Timestamp of last update
});

type User = typeof User.tsType;

/**
 * Liquor Type Variant
 * Represents different types of liquor products
 */
const LiquorType = Variant({
  Whiskey: Null,
  Vodka: Null,
  Rum: Null,
  Gin: Null,
  Tequila: Null,
  Brandy: Null,
  Liqueur: Null,
  Other: Null,
});

type LiquorType = typeof LiquorType.tsType;

/**
 * Liquor Brand Enum
 * Represents different liquor brands
 */
const LiquorBrand = Variant({
  Chrome: Null,
  Best: Null,
  County: Null,
  JohnnieWalker: Null,
  JackDaniels: Null,
  Smirnoff: Null,
  Bacardi: Null,
  Tanqueray: Null,
  Patron: Null,
  Hennessy: Null,
  Other: Null,
});

type LiquorBrand = typeof LiquorBrand.tsType;

/**
 * Liquor Product Record Type
 * Defines the structure of a liquor product in the system
 */
const LiquorProduct = Record({
  id: text, // Unique identifier for the product
  name: text, // Name of the product
  liquorType: LiquorType, // Type of liquor product
  brand: LiquorBrand, // Brand of the product
  alcoholContent: nat64, // Alcohol content percentage
  batchNumber: text, // Batch number of the product
  vintageYear: Opt(text), // Vintage year (optional)
  bottleSize: text, // Size of the bottle (e.g., 750ml)
  costPrice: nat64, // Cost price of the product
  retailPrice: nat64, // Retail price of the product
  currentStock: nat64, // Current stock quantity
  expiryDate: Opt(text), // Expiry date of the product (optional)
});

type LiquorProduct = typeof LiquorProduct.tsType;

/**
 * Supply Chain Event Enum
 * Represents different types of supply chain events
 */
const SupplyChainEventType = Variant({
  Received: Null,
  Sold: Null,
  Adjusted: Null,
  Damaged: Null,
  Expired: Null,
});

type SupplyChainEventType = typeof SupplyChainEventType.tsType;

/**
 * Supply Chain Event Record Type
 * Defines the structure of a supply chain event in the system
 */
const SupplyChainEvent = Record({
  id: text, // Unique identifier for the event
  liquorProductId: text, // ID of the liquor product
  eventType: SupplyChainEventType, // Type of the event
  location: text, // Location of the event
  quantity: nat64, // Quantity of the product
  date: nat64, // Date of the event
  participantId: text, // ID of the participant
});

type SupplyChainEvent = typeof SupplyChainEvent.tsType;

/**
 * Sale Record Record Type
 * Defines the structure of a sale record in the system
 */

const SaleRecord = Record({
  id: text, // Unique identifier for the sale record
  liquorProductId: text, // ID of the liquor product
  salesStaffId: text, // ID of the sales staff
  quantity: nat64, // Quantity of the product sold
  costPrice: nat64, // Cost price of the product
  totalPrice: nat64, // Total price of the sale
  buyerId: text, // ID of the buyer
  customerAge: nat64, // Age of the buyer
  saleDate: text, // Date of the sale
});

type SaleRecord = typeof SaleRecord.tsType;

/**
 * Inventory Adjustment Record Type
 * Defines the structure of an inventory adjustment in the system
 */

const InventoryAdjustment = Record({
  id: text, // Unique identifier for the adjustment
  liquorProductId: text, // ID of the liquor product
  staffId: text, // ID of the staff member
  quantityChanged: nat64, // Quantity of the product adjusted
  reason: text, // Reason for the adjustment
  adjustmentDate: text, // Date of the adjustment
});

type InventoryAdjustment = typeof InventoryAdjustment.tsType;

/**
 * User Registration Payload
 * Data structure for user registration requests
 */
const UserPayload = Record({
  username: text,
  role: UserRole,
  contactInfo: text,
});

type UserPayload = typeof UserPayload.tsType;

/**
 * Get All Users Payload
 * Data structure for retrieving all users with pagination
 */
const GetAllUsersPayload = Record({
  page: nat64,
  pageSize: nat64,
});

type GetAllUsersPayload = typeof GetAllUsersPayload.tsType;

/**
 * Liquor Product Payload
 * Data structure for liquor product creation and updates
 */
const LiquorProductPayload = Record({
  name: text,
  liquorType: LiquorType,
  brand: LiquorBrand,
  alcoholContent: nat64,
  batchNumber: text,
  vintageYear: Opt(text),
  bottleSize: text,
  costPrice: nat64,
  retailPrice: nat64,
  currentStock: nat64,
  expiryDate: Opt(text),
});

type LiquorProductPayload = typeof LiquorProductPayload.tsType;

/**
 * Supply Chain Event Payload
 * Data structure for supply chain event creation
 */
const SupplyChainEventPayload = Record({
  liquorProductId: text,
  eventType: SupplyChainEventType,
  location: text,
  quantity: nat64,
  participantId: text,
});

type SupplyChainEventPayload = typeof SupplyChainEventPayload.tsType;

/**
 * Sale Record Payload
 * Data structure for sale record creation
 */
const SaleRecordPayload = Record({
  liquorProductId: text,
  salesStaffId: text,
  quantity: nat64,
  buyerId: text,
  customerAge: nat64,
});

type SaleRecordPayload = typeof SaleRecordPayload.tsType;

/**
 * Inventory Adjustment Payload
 * Data structure for inventory adjustment creation
 */
const InventoryAdjustmentPayload = Record({
  liquorProductId: text,
  staffId: text,
  quantityChanged: nat64,
  reason: text,
  adjustedBy: text,
});

/**
 * System Error Types
 * Comprehensive list of possible errors that can occur in the system
 */
const Errors = Variant({
  UserAlreadyExists: text,
  UserDoesNotExist: text,
  ProductAlreadyExists: text,
  ProductDoesNotExist: text,
  InsufficientStock: text,
  InvalidPayload: text,
  Unauthorized: text,
  AgeRestriction: text,
  SystemError: text,
});

type Errors = typeof Errors.tsType;

// ============================================================================
// Storage
// ============================================================================

/**
 * Stable storage for users
 * Uses StableBTreeMap for persistent storage of user data
 */
const usersStorage = StableBTreeMap<text, User>(0);

/**
 * Stable storage for liquor products
 * Uses StableBTreeMap for persistent storage of liquor product data
 */
const liquorProductsStorage = StableBTreeMap<text, LiquorProduct>(1);

/**
 * Stable storage for supply chain events
 * Uses StableBTreeMap for persistent storage of supply chain event data
 */

const supplyChainEventsStorage = StableBTreeMap<text, SupplyChainEvent>(2);

/**
 * Stable storage for sale records
 * Uses StableBTreeMap for persistent storage of sale record data
 */
const saleRecordsStorage = StableBTreeMap<text, SaleRecord>(3);

/**
 * Stable storage for inventory adjustments
 * Uses StableBTreeMap for persistent storage of inventory adjustment data
 */

const inventoryAdjustmentsStorage = StableBTreeMap<text, InventoryAdjustment>(
  4
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a unique ID for a new user
 * @returns A unique user ID
 */
function generateId(): string {
  return uuidv4();
}

/**
 * Validates a username string
 * @param username - The username to validate
 * @returns boolean indicating if the username is valid
 */
function isValidUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 20 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
}

/**
 * Validates contact information
 * @param contactInfo - The contact information to validate
 * @returns boolean indicating if the contact info is valid
 */
function isValidContactInfo(contactInfo: string): boolean {
  return contactInfo.length > 0 && contactInfo.length <= 100;
}

/**
 * Age verification for liquor sales
 * @param age - The age of the customer
 * @returns boolean indicating if the customer is of legal age
 */
function isLegalAge(age: bigint): boolean {
  return age >= 18n;
}

// ============================================================================
// Canister Definition
// ============================================================================

export default Canister({
  /**
   * Registers a new user in the system
   * @param payload - User registration information
   * @returns Result containing either the created user or an error
   */
  registerUser: update([UserPayload], Result(User, Errors), (payload) => {
    try {
      // Input validation
      if (!payload.username) {
        return Err({ InvalidPayload: "Username is required" });
      }

      if (!isValidUsername(payload.username)) {
        return Err({
          InvalidPayload:
            "Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens",
        });
      }

      if (!isValidContactInfo(payload.contactInfo)) {
        return Err({
          InvalidPayload: "Invalid contact information",
        });
      }

      // Check for existing user
      const existingUser = Array.from(usersStorage.values()).find(
        (user) => user.username.toLowerCase() === payload.username.toLowerCase()
      );

      if (existingUser) {
        return Err({
          UserAlreadyExists: `User with username ${payload.username} already exists`,
        });
      }

      // Create new user
      const userId = generateId();
      const currentTime = new Date().toISOString();

      const newUser: User = {
        id: userId,
        owner: ic.caller(),
        ...payload,
        points: 0n,
        createdAt: currentTime,
        lastUpdated: currentTime,
      };

      usersStorage.insert(userId, newUser);
      return Ok(newUser);
    } catch (error) {
      return Err({
        SystemError: `Error creating user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Retrieves a specific user by their ID
   * @param userId - The ID of the user to retrieve
   * @returns Result containing either the user or an error
   */
  getUser: query([text], Result(User, Errors), (userId) => {
    try {
      const user = usersStorage.get(userId);
      if (!user) {
        return Err({
          UserDoesNotExist: `User with ID ${userId} does not exist`,
        });
      }
      return Ok(user);
    } catch (error) {
      return Err({
        SystemError: `Error retrieving user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Retrieves all users with pagination
   * @param page - Page number (0-based)
   * @param pageSize - Number of items per page
   * @returns Result containing either an array of users or an error
   */
  getAllUsers: query(
    [GetAllUsersPayload], // [page, pageSize]
    Result(Vec(User), Errors),
    (payload) => {
      try {
        // Validate pagination parameters
        if (payload.pageSize === 0n) {
          return Err({ InvalidPayload: "Page size must be greater than 0" });
        }

        const users = usersStorage.values();

        if (users.length === 0) {
          return Err({ UserDoesNotExist: "No users found in the system" });
        }

        // Calculate pagination
        const startIndex = Number(payload.page * payload.pageSize);
        const endIndex = Number((payload.page + 1n) * payload.pageSize);

        // Validate start index
        if (startIndex >= users.length) {
          return Err({ InvalidPayload: "Page number exceeds available data" });
        }

        // Return paginated results
        const paginatedUsers = users.slice(startIndex, endIndex);
        return Ok(paginatedUsers);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving users: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Updates a user's information
   * @param userId - The ID of the user to update
   * @param payload - The updated user information
   * @returns Result containing either the updated user or an error
   */
  updateUser: update(
    [text, UserPayload],
    Result(User, Errors),
    (userId, payload) => {
      try {
        const existingUser = usersStorage.get(userId);

        if (!existingUser) {
          return Err({
            UserDoesNotExist: `User with ID ${userId} does not exist`,
          });
        }

        // Validate new username if it's different
        if (payload.username !== existingUser.username) {
          if (!isValidUsername(payload.username)) {
            return Err({
              InvalidPayload: "Invalid username format",
            });
          }

          // Check if new username is taken
          const usernameExists = Array.from(usersStorage.values()).some(
            (user) =>
              user.id !== userId &&
              user.username.toLowerCase() === payload.username.toLowerCase()
          );

          if (usernameExists) {
            return Err({ UserAlreadyExists: "Username is already taken" });
          }
        }

        // Update user
        const updatedUser: User = {
          ...existingUser,
          ...payload,
          lastUpdated: new Date().toISOString(),
        };

        usersStorage.insert(userId, updatedUser);
        return Ok(updatedUser);
      } catch (error) {
        return Err({
          SystemError: `Error updating user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Deletes a user from the system
   * @param userId - The ID of the user to delete
   * @returns Result containing either a success message or an error
   */
  deleteUser: update([text], Result(text, Errors), (userId) => {
    try {
      const existingUser = usersStorage.get(userId);

      if (!existingUser) {
        return Err({
          UserDoesNotExist: `User with ID ${userId} does not exist`,
        });
      }

      usersStorage.remove(userId);
      return Ok(`User with ID ${userId} deleted successfully`);
    } catch (error) {
      return Err({
        SystemError: `Error deleting user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Adds a new liquor product to the system
   * @param payload - Liquor product information
   * @returns Result containing either the created product or an error
   */
  addLiquorProduct: update(
    [LiquorProductPayload],
    Result(LiquorProduct, Errors),
    (payload) => {
      try {
        // Input validation
        if (!payload.name) {
          return Err({ InvalidPayload: "Product name is required" });
        }

        // Generate a unique id
        const productId = generateId();

        // Increase the current stock by the quantity added
        payload.currentStock += 1n;

        const product: LiquorProduct = {
          id: productId,
          ...payload,
        };

        liquorProductsStorage.insert(productId, product);
        return Ok(product);
      } catch (error) {
        return Err({
          SystemError: `Error adding liquor product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves a specific liquor product by its ID
   * @param productId - The ID of the product to retrieve
   * @returns Result containing either the product or an error
   */
  getLiquorProduct: query(
    [text],
    Result(LiquorProduct, Errors),
    (productId) => {
      try {
        const product = liquorProductsStorage.get(productId);
        if (!product) {
          return Err({
            ProductDoesNotExist: `Product with ID ${productId} does not exist`,
          });
        }
        return Ok(product);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves all liquor products of a specific type
   * @param liquorType - The type of liquor products to retrieve
   * @returns Result containing either an array of products or an error
   */
  getLiquorProductsByType: query(
    [LiquorType],
    Result(Vec(LiquorProduct), Errors),
    (liquorType) => {
      try {
        const products = Array.from(liquorProductsStorage.values()).filter(
          (product) => {
            // Compare the variant types by checking their specific variant case
            const productType = Object.keys(product.liquorType)[0];
            const requestedType = Object.keys(liquorType)[0];
            return productType === requestedType;
          }
        );

        if (products.length === 0) {
          return Err({
            ProductDoesNotExist: `No products found for type ${
              Object.keys(liquorType)[0]
            }`,
          });
        }

        return Ok(products);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving products: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves all liquor products in the system
   * @returns Result containing either an array of products or an error
   */
  listAllProducts: query([], Result(Vec(LiquorProduct), Errors), () => {
    try {
      const products = liquorProductsStorage.values();
      if (products.length === 0) {
        return Err({ ProductDoesNotExist: "No products found in the system" });
      }
      return Ok(products);
    } catch (error) {
      return Err({
        SystemError: `Error retrieving products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Updates a liquor product in the system
   * @param productId - The ID of the product to update
   * @param payload - The updated product information
   * @returns Result containing either the updated product or an error
   */
  updateLiquorProduct: update(
    [text, LiquorProductPayload],
    Result(LiquorProduct, Errors),
    (productId, payload) => {
      try {
        const existingProduct = liquorProductsStorage.get(productId);

        if (!existingProduct) {
          return Err({
            ProductDoesNotExist: `Product with ID ${productId} does not exist`,
          });
        }

        // Update product
        const updatedProduct: LiquorProduct = {
          ...existingProduct,
          ...payload,
        };

        liquorProductsStorage.insert(productId, updatedProduct);
        return Ok(updatedProduct);
      } catch (error) {
        return Err({
          SystemError: `Error updating product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Deletes a liquor product from the system
   * @param productId - The ID of the product to delete
   * @returns Result containing either a success message or an error
   */
  deleteLiquorProduct: update([text], Result(text, Errors), (productId) => {
    try {
      const existingProduct = liquorProductsStorage.get(productId);

      if (!existingProduct) {
        return Err({
          ProductDoesNotExist: `Product with ID ${productId} does not exist`,
        });
      }

      liquorProductsStorage.remove(productId);
      return Ok(`Product with ID ${productId} deleted successfully`);
    } catch (error) {
      return Err({
        SystemError: `Error deleting product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Sells a liquor product to a customer
   * @param payload - Sale record information
   * @returns Result containing either a success message or an error
   */
  sellLiquorProduct: update(
    [SaleRecordPayload],
    Result(SaleRecord, Errors),
    (payload) => {
      try {
        const product = liquorProductsStorage.get(payload.liquorProductId);

        if (!product) {
          return Err({
            ProductDoesNotExist: `Product with ID ${payload.liquorProductId} does not exist`,
          });
        }

        if (payload.quantity > product.currentStock) {
          return Err({
            InsufficientStock: `Insufficient stock for product ${product.name}`,
          });
        }

        // Age verification
        if (!isLegalAge(payload.customerAge)) {
          return Err({
            AgeRestriction:
              "Customer must be 18 years or older to purchase alcohol",
          });
        }

        // Calculate total price
        const totalPrice = payload.quantity * product.costPrice;

        // Create sale record
        const saleRecord: SaleRecord = {
          id: generateId(),
          liquorProductId: payload.liquorProductId,
          salesStaffId: payload.salesStaffId,
          quantity: payload.quantity,
          costPrice: product.costPrice,
          totalPrice: totalPrice,
          buyerId: payload.buyerId,
          customerAge: payload.customerAge,
          saleDate: new Date().toISOString(),
        };

        // Update product stock
        const updatedStock = product.currentStock - payload.quantity;
        const updatedProduct: LiquorProduct = {
          ...product,
          currentStock: updatedStock,
        };

        // Save the changes
        liquorProductsStorage.insert(payload.liquorProductId, updatedProduct);
        saleRecordsStorage.insert(saleRecord.id, saleRecord);

        return Ok(saleRecord); // Return the sale record instead of a text message
      } catch (error) {
        return Err({
          SystemError: `Error selling product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves all sale records in the system
   * @returns Result containing either an array of sale records or an error
   */
  listAllSales: query([], Result(Vec(SaleRecord), Errors), () => {
    try {
      const sales = saleRecordsStorage.values();
      if (sales.length === 0) {
        return Err({ ProductDoesNotExist: "No sales found in the system" });
      }
      return Ok(sales);
    } catch (error) {
      return Err({
        SystemError: `Error retrieving sales: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }),

  /**
   * Adjusts the inventory of a liquor product
   * @param payload - Inventory adjustment information
   * @returns Result containing either a success message or an error
   */
  adjustInventory: update(
    [InventoryAdjustmentPayload],
    Result(InventoryAdjustment, Errors),
    (payload) => {
      try {
        const product = liquorProductsStorage.get(payload.liquorProductId);
        if (!product) {
          return Err({
            ProductDoesNotExist: `Product with ID ${payload.liquorProductId} does not exist`,
          });
        }

        // Update product stock
        product.currentStock += payload.quantityChanged;

        // Generate ID for the adjustment
        const adjustmentId = generateId();

        // Create inventory adjustment record
        const adjustment: InventoryAdjustment = {
          id: adjustmentId, // Ensure ID is generated here
          ...payload,
          adjustmentDate: new Date().toISOString(),
        };

        liquorProductsStorage.insert(payload.liquorProductId, product);
        inventoryAdjustmentsStorage.insert(adjustment.id, adjustment);
        return Ok(adjustment); // Return the full adjustment record
      } catch (error) {
        return Err({
          SystemError: `Error adjusting inventory: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves all inventory adjustments in the system
   * @returns Result containing either an array of inventory adjustments or an error
   */
  listAllInventoryAdjustments: query(
    [],
    Result(Vec(InventoryAdjustment), Errors),
    () => {
      try {
        const adjustments = inventoryAdjustmentsStorage.values();
        if (adjustments.length === 0) {
          return Err({
            ProductDoesNotExist: "No inventory adjustments found in the system",
          });
        }
        return Ok(adjustments);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving inventory adjustments: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Logs a supply chain event in the system
   * @param payload - Supply chain event information
   * @returns Result containing either a success message or an error
   */

  logSupplyChainEvent: update(
    [SupplyChainEventPayload],
    Result(text, Errors),
    (payload) => {
      try {

        // Supply Chain Event ID
        const supplyChainEventId = generateId();


        const event: SupplyChainEvent = {
          id: supplyChainEventId,
          ...payload,
          date: ic.time(),
        };

        supplyChainEventsStorage.insert(event.id, event);
        return Ok(`Supply chain event of  ${payload.location} recorded`);
      } catch (error) {
        return Err({
          SystemError: `Error logging supply chain event: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves all supply chain events in the system
   * @returns Result containing either an array of supply chain events or an error
   */
  listSupplyChainEvents: query(
    [],
    Result(Vec(SupplyChainEvent), Errors),
    () => {
      try {
        const events = supplyChainEventsStorage.values();
        if (events.length === 0) {
          return Err({
            ProductDoesNotExist: "No supply chain events found in the system",
          });
        }
        return Ok(events);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving supply chain events: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),

  /**
   * Retrieves a specific supply chain event by its ID
   * @param eventId - The ID of the event to retrieve
   * @returns Result containing either the event or an error
   */
  getSupplyChainEvent: query(
    [text],
    Result(SupplyChainEvent, Errors),
    (eventId) => {
      try {
        const event = supplyChainEventsStorage.get(eventId);
        if (!event) {
          return Err({
            ProductDoesNotExist: `Supply chain event with ID ${eventId} does not exist`,
          });
        }
        return Ok(event);
      } catch (error) {
        return Err({
          SystemError: `Error retrieving supply chain event: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }
  ),
});
