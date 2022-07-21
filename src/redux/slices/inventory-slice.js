import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'inventory';

export const createInventory = createAsyncThunk(
    `${namespace}/createInventory`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory/create`;
        const resp = await axios.post(endpointUrl, params.createInventoryReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchInventory = createAsyncThunk(
    `${namespace}/searchInventory`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const findInventoryByMasterItem = createAsyncThunk(
    `${namespace}/findInventoryByMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory/master-item/${params.itemId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const findInventoryByWarehouseId = createAsyncThunk(
    `${namespace}/findInventoryByWarehouseId`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory/warehouse/${params.warehouseId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

const inventorySlice = createSlice({
    name: namespace,
    initialState: {
        createInventoryLoading: false,
        createInventoryError: null,
        createInventoryResp: null,
        searchInventoryLoading: false,
        searchInventoryError: null,
        searchInventoryResp:[],
        getInventoriesLoading: false,
        getInventoriesError: null,
        getInventoriesResp: [],
        getInvByWarehouseIdLoading: false,
        getInvByWarehouseIdResp: [],
        getInvByWarehouseIdError: null
    },
    reducers: {
        resetCreateInventoryError: (state) => {
            state.createInventoryError = null;
        },
        resetSearchInventoryError: (state) => {
            state.searchInventoryError = null;
        },
        resetCreateInventoryResp: (state) => {
            state.createInventoryResp = null;
        },
        resetSearchInventoryResp: (state) => {
            state.searchInventoryResp = [];
        },
        resetGetInventoriesError: (state) => {
            state.getInventoriesError = null;
        },
        resetGetInventoriesResp: (state) => {
            state.getInventoriesResp = [];
        },
        resetGetInvByWarehouseIdResp: (state) => {
            state.getInvByWarehouseIdResp = [];
        },
        resetGetInvByWarehouseIdError: (state) => {
            state.getInvByWarehouseIdError = null;
        },
        setGetInvByWarehouseId: (state, action) => {
            state.getInvByWarehouseIdResp = [...state.getInvByWarehouseIdResp, action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInventory.pending, (state) => {
                state.createInventoryLoading = true;
                state.createInventoryError = null;
                state.createInventoryResp = null;
            })
            .addCase(createInventory.fulfilled, (state, action) => {
                state.createInventoryLoading = false;
                state.createInventoryResp = action.payload;
                state.createInventoryError = null;
            })
            .addCase(createInventory.rejected, (state, action) => {
                state.createInventoryLoading = false;
                state.createInventoryResp = null;
                state.createInventoryError = action.error;
            })
            .addCase(searchInventory.pending, (state) => {
                state.searchInventoryLoading = true;
                state.searchInventoryResp = null;
                state.searchInventoryError = null;
            })
            .addCase(searchInventory.fulfilled, (state, action) => {
                state.searchInventoryLoading = false;
                state.searchInventoryResp = action.payload;
                state.searchInventoryError = null;
            })
            .addCase(searchInventory.rejected, (state, action) => {
                state.searchInventoryLoading = false;
                state.searchInventoryResp = [];
                state.searchInventoryError = action.error;
            })
            .addCase(findInventoryByMasterItem.pending, (state) => {
                state.getInventoriesLoading = true;
                state.getInventoriesError = null;
                state.getInventoriesResp = [];
            })
            .addCase(findInventoryByMasterItem.fulfilled, (state, action) => {
                state.getInventoriesLoading = false;
                state.getInventoriesError = null;
                state.getInventoriesResp = action.payload;
            })
            .addCase(findInventoryByMasterItem.rejected, (state, action) => {
                state.getInventoriesLoading = false;
                state.getInventoriesError = action.error;
                state.getInventoriesResp = [];
            })
            .addCase(findInventoryByWarehouseId.pending, (state) => {
                state.getInvByWarehouseIdLoading = true;
                state.getInvByWarehouseIdResp = [];
                state.getInvByWarehouseIdError = null;
            })
            .addCase(findInventoryByWarehouseId.fulfilled, (state, action) => {
                state.getInvByWarehouseIdLoading = false;
                state.getInvByWarehouseIdResp = action.payload;
                state.getInvByWarehouseIdError = null;
            })
            .addCase(findInventoryByWarehouseId.rejected, (state, action) => {
                state.getInvByWarehouseIdLoading = false;
                state.getInvByWarehouseIdResp = [];
                state.getInvByWarehouseIdError = action.error;
            })
    }
});

export const {resetCreateInventoryError, resetCreateInventoryResp, 
    resetSearchInventoryError, resetSearchInventoryResp, 
    resetGetInventoriesError, resetGetInventoriesResp,
    resetGetInvByWarehouseIdError, resetGetInvByWarehouseIdResp} = inventorySlice.actions;
export default inventorySlice.reducer;