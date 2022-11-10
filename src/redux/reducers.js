import { combineReducers } from "@reduxjs/toolkit";

import userManagementSlice from "./slices/user-management-slice";
import masterItemSlice from "./slices/master-item-slice";
import itemCategorySlice from "./slices/item-category-slice";
import itemUnitSlice from "./slices/item-unit-slice";
import warehouseSlice from "./slices/warehouse-slice";
import inventorySlice from "./slices/inventory-slice";
import inventoryMovementSlice from "./slices/inventory-movement-slice";
import stockTakeSlice from "./slices/stock-opname-slice";
import itemPriceSlice from "./slices/item-price-slice";
import customerSlice from './slices/customer-slice';
import salesOrderSlice from "./slices/sales-order-slice";
import deliveryOrderSlice from "./slices/delivery-order-slice";
import salesInvoiceSlice from "./slices/sales-invoice-slice";
import bankReferenceSlice from "./slices/bank-reference-slice";

const rootReducer = combineReducers({
    userManagement: userManagementSlice,
    masterItem: masterItemSlice,
    itemCategory: itemCategorySlice,
    itemUnit: itemUnitSlice,
    warehouse: warehouseSlice,
    inventory: inventorySlice,
    inventoryMovement: inventoryMovementSlice,
    stockOpname: stockTakeSlice,
    itemPrice: itemPriceSlice,
    customer: customerSlice,
    salesOrder: salesOrderSlice,
    deliveryOrder: deliveryOrderSlice,
    salesInvoice: salesInvoiceSlice,
    bankReference: bankReferenceSlice
});

export default rootReducer;