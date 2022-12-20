import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'warehouse';

export const createWarehouse = createAsyncThunk(
    `${namespace}/createWarehouse`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/warehouse/create`;
        const resp = await axios.post(endpointUrl, params.data, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchWarehouse = createAsyncThunk(
    `${namespace}/searchWarehouse`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/warehouse/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const updateWarehouse = createAsyncThunk(
    `${namespace}/updateWarehouse`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/warehouse/update`;
        const userReq = {
            id: params.id,
            warehouseName: params.warehouseName,
            warehouseAddress: params.warehouseAddress,
            warehouseType: params.warehouseType
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const warehouseSlice = createSlice({
    name: namespace,
    initialState: {
        createWarehouseLoading: false,
        createWarehouseResp: null,
        createWarehouseError: null,
        searchWarehouseLoading: false,
        searchWarehouseResp: [],
        searchWarehouseError: null,
        updateWarehouseLoading: false,
        updateWarehouseResp: null,
        updateWarehouseError: null,
    },
    reducers: {
        resetCreateWarehouseError: (state) => {
            state.createItemCategoryError = null;
        },
        resetSearchWarehouseError: (state) => {
            state.searchItemCategoryError = null;
        },
        resetSearchWarehouseResp: (state) => {
            state.searchWarehouseResp = [];
        },
        resetUpdateWarehouseError: (state) => {
            state.updateItemCategoryError = null;
        },
        resetCreateWarehouseResp: (state) => {
            state.createWarehouseResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWarehouse.pending, (state) => {
                state.createWarehouseLoading = true;
                state.createWarehouseResp = null;
                state.createWarehouseError = null;
            })
            .addCase(createWarehouse.fulfilled, (state, action) => {
                state.createWarehouseLoading = false;
                state.createWarehouseResp = action.payload;
                state.createWarehouseError = null;
            })
            .addCase(createWarehouse.rejected, (state, action) => {
                state.createWarehouseLoading = false;
                state.createWarehouseResp = null;
                state.createWarehouseError = action.error;
            })
            .addCase(searchWarehouse.pending, (state) => {
                state.searchWarehouseLoading = true;
                state.searchWarehouseResp = [];
                state.searchWarehouseError = null;
            })
            .addCase(searchWarehouse.fulfilled, (state, action) => {
                state.searchWarehouseLoading = false;
                state.searchWarehouseResp = action.payload;
                state.searchWarehouseError = null;
            })
            .addCase(searchWarehouse.rejected, (state, action) => {
                state.searchWarehouseLoading = false;
                state.searchWarehouseResp = [];
                state.searchWarehouseError = action.error;
            })
            .addCase(updateWarehouse.pending, (state) => {
                state.updateWarehouseLoading = true;
                state.updateWarehouseResp = null;
                state.updateWarehouseError = null;
            })
            .addCase(updateWarehouse.fulfilled, (state, action) => {
                state.updateWarehouseLoading = false;
                state.updateWarehouseResp = action.payload;
                state.updateWarehouseError = null;
            })
            .addCase(updateWarehouse.rejected, (state, action) => {
                state.updateWarehouseLoading = false;
                state.updateWarehouseResp = null;
                state.updateWarehouseError = action.error;
            })

    }
})

export const {resetCreateWarehouseError, resetSearchWarehouseError, resetUpdateWarehouseError, resetCreateWarehouseResp, resetSearchWarehouseResp} = warehouseSlice.actions;

export default warehouseSlice.reducer;