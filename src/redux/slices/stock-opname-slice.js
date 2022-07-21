import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'stock-opname';

export const createStockTake = createAsyncThunk(
    `${namespace}/createStockTake`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/stock-take/create`;
        const resp = await axios.post(endpointUrl, params.stockTake, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const findAllStockTakeWithPaging = createAsyncThunk(
    `${namespace}/findAllStockTakeWithPaging`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/stock-take/find-all?page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const findStockTakeByWarehouse = createAsyncThunk(
    `${namespace}/findStockTakeByWarehouse`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/stock-take/find-by-warehouse?page=${params.page}&size=${params.size}&warehouseId=${params.warehouseId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const findStockTakeWithFilter = createAsyncThunk(
    `${namespace}/findStockTakeWithFilter`,
    async (params, thunkAPI) => {

        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/stock-take/find-with-filter?page=${params.page}&size=${params.size}`;
        if (params.warehouseId) {
            endpointUrl = endpointUrl + `&warehouseId=${params.warehouseId}`;
        }
        if (params.stockTakeDateTime) {
            endpointUrl = endpointUrl + `&stockTakeDateTime=${params.stockTakeDateTime}`;
        }
        console.log(endpointUrl);
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

const stockTakeSlice = createSlice({
    name: namespace,
    initialState: {
        createStockTakeLoading: false,
        createStockTakeResp: null,
        createStockTakeError: null,
        findAllStockTakeWithPagingLoading: false,
        findAllStockTakeWithPagingData: null,
        findAllStockTakeWithPagingError: null,
        findStockTakeByWarehouseLoading: false,
        findStockTakeByWarehouseData: null,
        findStockTakeByWarehouseError: null,
        findStockTakeWithFilterLoading: false,
        findStockTakeWithFilterResp: null,
        findStockTakeWithFilterError: null,
    },
    reducers: {
        resetFindStockTakeWithFilterResp: (state) => {
            state.findStockTakeWithFilterResp = null;
        },
        resetFindStockTakeWithFilterError: (state) => {
            state.findStockTakeWithFilterError = null;
        },
        resetCreateStockTakeResp: (state) => {
            state.createStockTakeResp = null;
        },
        resetCreateStockTakeError: (state) => {
            state.createStockTakeError = null;
        },
        resetFindAllStockTakeWithPagingData: (state) => {
            state.findAllStockTakeWithPagingData = null;
        },
        resetFindAllStockTakeWithPagingError: (state) => {
            state.findAllStockTakeWithPagingError = null;
        },
        resetFindStockTakeByWarehouseData: (state) => {
            state.findStockTakeByWarehouseData = null;
        },
        resetFindStockTakeByWarehouseError: (state) => {
            state.findStockTakeByWarehouseError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createStockTake.pending, (state) => {
                state.createStockTakeLoading = true;
                state.createStockTakeResp = null;
                state.createStockTakeError = null;
            })
            .addCase(createStockTake.fulfilled, (state, action) => {
                state.createStockTakeLoading = false;
                state.createStockTakeResp = action.payload;
                state.createStockTakeError = null;
            })
            .addCase(createStockTake.rejected, (state, action) => {
                state.createStockTakeLoading = false;
                state.createStockTakeResp = null;
                state.createStockTakeError = action.error;
            })
            .addCase(findAllStockTakeWithPaging.pending, (state) => {
                state.findAllStockTakeWithPagingLoading = true;
                state.findAllStockTakeWithPagingData = null;
                state.findAllStockTakeWithPagingError = null;
            })
            .addCase(findAllStockTakeWithPaging.fulfilled, (state, action) => {
                state.findAllStockTakeWithPagingLoading = false;
                state.findAllStockTakeWithPagingData = action.payload;
                state.findAllStockTakeWithPagingError = null;
            })
            .addCase(findAllStockTakeWithPaging.rejected, (state, action) => {
                state.findAllStockTakeWithPagingLoading = false;
                state.findAllStockTakeWithPagingData = null;
                state.findAllStockTakeWithPagingError = action.error;
            })
            .addCase(findStockTakeByWarehouse.pending, (state) => {
                state.findStockTakeByWarehouseLoading = true;
                state.findStockTakeByWarehouseData = null;
                state.findStockTakeByWarehouseError = null;
            })
            .addCase(findStockTakeByWarehouse.fulfilled, (state, action) => {
                state.findStockTakeByWarehouseLoading = false;
                state.findStockTakeByWarehouseData = action.payload;
                state.findStockTakeByWarehouseError = null;
            })
            .addCase(findStockTakeByWarehouse.rejected, (state, action) => {
                state.findStockTakeByWarehouseLoading = false;
                state.findStockTakeByWarehouseData = null;
                state.findStockTakeByWarehouseError = action.error;
            })
            .addCase(findStockTakeWithFilter.pending, (state) => {
                state.findStockTakeWithFilterLoading = true;
                state.findStockTakeWithFilterResp = null;
                state.findStockTakeWithFilterError = null;
            })
            .addCase(findStockTakeWithFilter.fulfilled, (state, action) => {
                state.findStockTakeWithFilterLoading = false;
                state.findStockTakeWithFilterResp = action.payload;
                state.findStockTakeWithFilterError = null;
            })
            .addCase(findStockTakeWithFilter.rejected, (state, action) => {
                state.findStockTakeWithFilterLoading = false;
                state.findStockTakeWithFilterResp = null;
                state.findStockTakeWithFilterError = action.error;
            })
    }
})

export const { resetCreateStockTakeError,
    resetCreateStockTakeResp,
    resetFindAllStockTakeWithPagingData,
    resetFindAllStockTakeWithPagingError,
    resetFindStockTakeByWarehouseData,
    resetFindStockTakeByWarehouseError,
    resetFindStockTakeWithFilterError,
    resetFindStockTakeWithFilterResp } = stockTakeSlice.actions;

export default stockTakeSlice.reducer;