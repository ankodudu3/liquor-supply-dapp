import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addLiquorProduct' : ActorMethod<
    [
      {
        'retailPrice' : bigint,
        'alcoholContent' : bigint,
        'liquorType' : { 'Gin' : null } |
          { 'Rum' : null } |
          { 'Brandy' : null } |
          { 'Tequila' : null } |
          { 'Whiskey' : null } |
          { 'Liqueur' : null } |
          { 'Other' : null } |
          { 'Vodka' : null },
        'vintageYear' : [] | [string],
        'expiryDate' : [] | [string],
        'name' : string,
        'bottleSize' : string,
        'batchNumber' : string,
        'brand' : { 'County' : null } |
          { 'JackDaniels' : null } |
          { 'JohnnieWalker' : null } |
          { 'Hennessy' : null } |
          { 'Patron' : null } |
          { 'Smirnoff' : null } |
          { 'Best' : null } |
          { 'Tanqueray' : null } |
          { 'Bacardi' : null } |
          { 'Other' : null } |
          { 'Chrome' : null },
        'currentStock' : bigint,
        'costPrice' : bigint,
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'retailPrice' : bigint,
          'alcoholContent' : bigint,
          'liquorType' : { 'Gin' : null } |
            { 'Rum' : null } |
            { 'Brandy' : null } |
            { 'Tequila' : null } |
            { 'Whiskey' : null } |
            { 'Liqueur' : null } |
            { 'Other' : null } |
            { 'Vodka' : null },
          'vintageYear' : [] | [string],
          'expiryDate' : [] | [string],
          'name' : string,
          'bottleSize' : string,
          'batchNumber' : string,
          'brand' : { 'County' : null } |
            { 'JackDaniels' : null } |
            { 'JohnnieWalker' : null } |
            { 'Hennessy' : null } |
            { 'Patron' : null } |
            { 'Smirnoff' : null } |
            { 'Best' : null } |
            { 'Tanqueray' : null } |
            { 'Bacardi' : null } |
            { 'Other' : null } |
            { 'Chrome' : null },
          'currentStock' : bigint,
          'costPrice' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'adjustInventory' : ActorMethod<
    [
      {
        'liquorProductId' : string,
        'staffId' : string,
        'quantityChanged' : bigint,
        'adjustedBy' : string,
        'reason' : string,
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'liquorProductId' : string,
          'staffId' : string,
          'adjustmentDate' : string,
          'quantityChanged' : bigint,
          'reason' : string,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'deleteLiquorProduct' : ActorMethod<
    [string],
    { 'Ok' : string } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'deleteUser' : ActorMethod<
    [string],
    { 'Ok' : string } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'getAllUsers' : ActorMethod<
    [{ 'page' : bigint, 'pageSize' : bigint }],
    {
        'Ok' : Array<
          {
            'id' : string,
            'contactInfo' : string,
            'username' : string,
            'owner' : Principal,
            'createdAt' : string,
            'role' : { 'Customer' : null } |
              { 'Staff' : null } |
              { 'Admin' : null } |
              { 'Manager' : null },
            'lastUpdated' : string,
            'points' : bigint,
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'getLiquorProduct' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'retailPrice' : bigint,
          'alcoholContent' : bigint,
          'liquorType' : { 'Gin' : null } |
            { 'Rum' : null } |
            { 'Brandy' : null } |
            { 'Tequila' : null } |
            { 'Whiskey' : null } |
            { 'Liqueur' : null } |
            { 'Other' : null } |
            { 'Vodka' : null },
          'vintageYear' : [] | [string],
          'expiryDate' : [] | [string],
          'name' : string,
          'bottleSize' : string,
          'batchNumber' : string,
          'brand' : { 'County' : null } |
            { 'JackDaniels' : null } |
            { 'JohnnieWalker' : null } |
            { 'Hennessy' : null } |
            { 'Patron' : null } |
            { 'Smirnoff' : null } |
            { 'Best' : null } |
            { 'Tanqueray' : null } |
            { 'Bacardi' : null } |
            { 'Other' : null } |
            { 'Chrome' : null },
          'currentStock' : bigint,
          'costPrice' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'getLiquorProductsByType' : ActorMethod<
    [
      { 'Gin' : null } |
        { 'Rum' : null } |
        { 'Brandy' : null } |
        { 'Tequila' : null } |
        { 'Whiskey' : null } |
        { 'Liqueur' : null } |
        { 'Other' : null } |
        { 'Vodka' : null },
    ],
    {
        'Ok' : Array<
          {
            'id' : string,
            'retailPrice' : bigint,
            'alcoholContent' : bigint,
            'liquorType' : { 'Gin' : null } |
              { 'Rum' : null } |
              { 'Brandy' : null } |
              { 'Tequila' : null } |
              { 'Whiskey' : null } |
              { 'Liqueur' : null } |
              { 'Other' : null } |
              { 'Vodka' : null },
            'vintageYear' : [] | [string],
            'expiryDate' : [] | [string],
            'name' : string,
            'bottleSize' : string,
            'batchNumber' : string,
            'brand' : { 'County' : null } |
              { 'JackDaniels' : null } |
              { 'JohnnieWalker' : null } |
              { 'Hennessy' : null } |
              { 'Patron' : null } |
              { 'Smirnoff' : null } |
              { 'Best' : null } |
              { 'Tanqueray' : null } |
              { 'Bacardi' : null } |
              { 'Other' : null } |
              { 'Chrome' : null },
            'currentStock' : bigint,
            'costPrice' : bigint,
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'getSupplyChainEvent' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'liquorProductId' : string,
          'date' : bigint,
          'participantId' : string,
          'quantity' : bigint,
          'location' : string,
          'eventType' : { 'Sold' : null } |
            { 'Received' : null } |
            { 'Adjusted' : null } |
            { 'Damaged' : null } |
            { 'Expired' : null },
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'getUser' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'contactInfo' : string,
          'username' : string,
          'owner' : Principal,
          'createdAt' : string,
          'role' : { 'Customer' : null } |
            { 'Staff' : null } |
            { 'Admin' : null } |
            { 'Manager' : null },
          'lastUpdated' : string,
          'points' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'listAllInventoryAdjustments' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'liquorProductId' : string,
            'staffId' : string,
            'adjustmentDate' : string,
            'quantityChanged' : bigint,
            'reason' : string,
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'listAllProducts' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'retailPrice' : bigint,
            'alcoholContent' : bigint,
            'liquorType' : { 'Gin' : null } |
              { 'Rum' : null } |
              { 'Brandy' : null } |
              { 'Tequila' : null } |
              { 'Whiskey' : null } |
              { 'Liqueur' : null } |
              { 'Other' : null } |
              { 'Vodka' : null },
            'vintageYear' : [] | [string],
            'expiryDate' : [] | [string],
            'name' : string,
            'bottleSize' : string,
            'batchNumber' : string,
            'brand' : { 'County' : null } |
              { 'JackDaniels' : null } |
              { 'JohnnieWalker' : null } |
              { 'Hennessy' : null } |
              { 'Patron' : null } |
              { 'Smirnoff' : null } |
              { 'Best' : null } |
              { 'Tanqueray' : null } |
              { 'Bacardi' : null } |
              { 'Other' : null } |
              { 'Chrome' : null },
            'currentStock' : bigint,
            'costPrice' : bigint,
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'listAllSales' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'liquorProductId' : string,
            'salesStaffId' : string,
            'customerAge' : bigint,
            'buyerId' : string,
            'quantity' : bigint,
            'costPrice' : bigint,
            'totalPrice' : bigint,
            'saleDate' : string,
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'listSupplyChainEvents' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'liquorProductId' : string,
            'date' : bigint,
            'participantId' : string,
            'quantity' : bigint,
            'location' : string,
            'eventType' : { 'Sold' : null } |
              { 'Received' : null } |
              { 'Adjusted' : null } |
              { 'Damaged' : null } |
              { 'Expired' : null },
          }
        >
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'logSupplyChainEvent' : ActorMethod<
    [
      {
        'liquorProductId' : string,
        'participantId' : string,
        'quantity' : bigint,
        'location' : string,
        'eventType' : { 'Sold' : null } |
          { 'Received' : null } |
          { 'Adjusted' : null } |
          { 'Damaged' : null } |
          { 'Expired' : null },
      },
    ],
    { 'Ok' : string } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'registerUser' : ActorMethod<
    [
      {
        'contactInfo' : string,
        'username' : string,
        'role' : { 'Customer' : null } |
          { 'Staff' : null } |
          { 'Admin' : null } |
          { 'Manager' : null },
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'contactInfo' : string,
          'username' : string,
          'owner' : Principal,
          'createdAt' : string,
          'role' : { 'Customer' : null } |
            { 'Staff' : null } |
            { 'Admin' : null } |
            { 'Manager' : null },
          'lastUpdated' : string,
          'points' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'sellLiquorProduct' : ActorMethod<
    [
      {
        'liquorProductId' : string,
        'salesStaffId' : string,
        'customerAge' : bigint,
        'buyerId' : string,
        'quantity' : bigint,
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'liquorProductId' : string,
          'salesStaffId' : string,
          'customerAge' : bigint,
          'buyerId' : string,
          'quantity' : bigint,
          'costPrice' : bigint,
          'totalPrice' : bigint,
          'saleDate' : string,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'updateLiquorProduct' : ActorMethod<
    [
      string,
      {
        'retailPrice' : bigint,
        'alcoholContent' : bigint,
        'liquorType' : { 'Gin' : null } |
          { 'Rum' : null } |
          { 'Brandy' : null } |
          { 'Tequila' : null } |
          { 'Whiskey' : null } |
          { 'Liqueur' : null } |
          { 'Other' : null } |
          { 'Vodka' : null },
        'vintageYear' : [] | [string],
        'expiryDate' : [] | [string],
        'name' : string,
        'bottleSize' : string,
        'batchNumber' : string,
        'brand' : { 'County' : null } |
          { 'JackDaniels' : null } |
          { 'JohnnieWalker' : null } |
          { 'Hennessy' : null } |
          { 'Patron' : null } |
          { 'Smirnoff' : null } |
          { 'Best' : null } |
          { 'Tanqueray' : null } |
          { 'Bacardi' : null } |
          { 'Other' : null } |
          { 'Chrome' : null },
        'currentStock' : bigint,
        'costPrice' : bigint,
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'retailPrice' : bigint,
          'alcoholContent' : bigint,
          'liquorType' : { 'Gin' : null } |
            { 'Rum' : null } |
            { 'Brandy' : null } |
            { 'Tequila' : null } |
            { 'Whiskey' : null } |
            { 'Liqueur' : null } |
            { 'Other' : null } |
            { 'Vodka' : null },
          'vintageYear' : [] | [string],
          'expiryDate' : [] | [string],
          'name' : string,
          'bottleSize' : string,
          'batchNumber' : string,
          'brand' : { 'County' : null } |
            { 'JackDaniels' : null } |
            { 'JohnnieWalker' : null } |
            { 'Hennessy' : null } |
            { 'Patron' : null } |
            { 'Smirnoff' : null } |
            { 'Best' : null } |
            { 'Tanqueray' : null } |
            { 'Bacardi' : null } |
            { 'Other' : null } |
            { 'Chrome' : null },
          'currentStock' : bigint,
          'costPrice' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
  'updateUser' : ActorMethod<
    [
      string,
      {
        'contactInfo' : string,
        'username' : string,
        'role' : { 'Customer' : null } |
          { 'Staff' : null } |
          { 'Admin' : null } |
          { 'Manager' : null },
      },
    ],
    {
        'Ok' : {
          'id' : string,
          'contactInfo' : string,
          'username' : string,
          'owner' : Principal,
          'createdAt' : string,
          'role' : { 'Customer' : null } |
            { 'Staff' : null } |
            { 'Admin' : null } |
            { 'Manager' : null },
          'lastUpdated' : string,
          'points' : bigint,
        }
      } |
      {
        'Err' : { 'UserAlreadyExists' : string } |
          { 'AgeRestriction' : string } |
          { 'ProductDoesNotExist' : string } |
          { 'InvalidPayload' : string } |
          { 'SystemError' : string } |
          { 'InsufficientStock' : string } |
          { 'Unauthorized' : string } |
          { 'UserDoesNotExist' : string } |
          { 'ProductAlreadyExists' : string }
      }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
