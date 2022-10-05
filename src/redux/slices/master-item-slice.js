import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'master-item';

export const createMasterItem = createAsyncThunk(
    `${namespace}/createMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/create`;
        const data = {
            ...params.data, itemWeight: parseFloat(params.data.itemWeight), 
            dimension: {
                height: parseFloat(params.data.dimension.height),
                length: parseFloat(params.data.dimension.length),
                width: parseFloat(params.data.dimension.width)
            }
        }
        const resp = await axios.post(endpointUrl, JSON.stringify(data), { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchMasterItem = createAsyncThunk(
    `${namespace}/searchMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const searchMasterItemInv = createAsyncThunk(
    `${namespace}/searchMasterItemInv`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/search-inv?page=${params.page}&size=${params.size}&searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const updateMasterItem = createAsyncThunk(
    `${namespace}/updateMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/update`;
        const userReq = {
            id: params.id,
            itemName: params.itemName,
            itemCode: params.itemCode,
            itemDescription: params.itemDescription,
            itemCategoryId: params.itemCategoryId,
            stockType: params.stockType,
            itemWeight: params.itemWeight,
            itemUnitId: params.itemUnitId,
            dimension: params.dimension
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const masterItemSlice = createSlice({
    name: namespace,
    initialState: {
        createMasterItemLoading: false,
        createMasterItemResp: null,
        createMasterItemError: null,
        searchMasterItemLoading: false,
        searchMasterItemResp: [],
        searchMasterItemError: null,
        searchMasterItemInvLoading: false,
        searchMasterItemInvResp: null,
        searchMasterItemInvError: null,
        updateMasterItemLoading: false,
        updateMasterItemResp: null,
        updateMasterItemError: null,
    },
    reducers: {
        resetCreateMasterItemError: (state) => {
            state.createMasterItemError = null;
        },
        resetSearchMasterItemError: (state) => {
            state.searchMasterItemError = null;
        },
        resetSearchMasterItemInvError: (state) => {
            state.searchMasterItemInvError = null;
        },
        resetUpdateMasterItemError: (state) => {
            state.updateMasterItemError = null;
        },
        resetCreateMasteritemResp: (state) => {
            state.createMasterItemResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createMasterItem.pending, (state) => {
                state.createMasterItemLoading = true;
                state.createMasterItemResp = null;
                state.createMasterItemError = null;
            })
            .addCase(createMasterItem.fulfilled, (state, action) => {
                state.createMasterItemLoading = false;
                state.createMasterItemResp = action.payload;
                state.createMasterItemError = null;
            })
            .addCase(createMasterItem.rejected, (state, action) => {
                state.createMasterItemLoading = false;
                state.createMasterItemResp = null;
                state.createMasterItemError = action.error;
            })
            .addCase(searchMasterItem.pending, (state) => {
                state.searchMasterItemLoading = true;
                state.searchMasterItemResp = [];
                state.searchMasterItemError = null;
            })
            .addCase(searchMasterItem.fulfilled, (state, action) => {
                state.searchMasterItemLoading = false;
                state.searchMasterItemResp = action.payload;
                state.searchMasterItemError = null;
            })
            .addCase(searchMasterItem.rejected, (state, action) => {
                state.searchMasterItemLoading = false;
                state.searchMasterItemResp = [];
                state.searchMasterItemError = action.error;
            })
            .addCase(searchMasterItemInv.pending, (state) => {
                state.searchMasterItemInvLoading = true;
                state.searchMasterItemInvResp = null;
                state.searchMasterItemInvError = null;
            })
            .addCase(searchMasterItemInv.fulfilled, (state, action) => {
                state.searchMasterItemInvLoading = false;
                state.searchMasterItemInvResp = action.payload;
                state.searchMasterItemInvError = null;
            })
            .addCase(searchMasterItemInv.rejected, (state, action) => {
                state.searchMasterItemInvLoading = false;
                state.searchMasterItemInvResp = null;
                state.searchMasterItemInvError = action.error;
            })
            .addCase(updateMasterItem.pending, (state) => {
                state.updateMasterItemLoading = true;
                state.updateMasterItemResp = null;
                state.updateMasterItemError = null;
            })
            .addCase(updateMasterItem.fulfilled, (state, action) => {
                state.updateMasterItemLoading = false;
                state.updateMasterItemResp = action.payload;
                state.updateMasterItemError = null;
            })
            .addCase(updateMasterItem.rejected, (state, action) => {
                state.updateMasterItemLoading = false;
                state.updateMasterItemResp = null;
                state.updateMasterItemError = action.error;
            })

    }
})

export const {resetCreateMasterItemError, resetSearchMasterItemError, resetSearchMasterItemInvError, resetUpdateMasterItemError, resetCreateMasteritemResp} = masterItemSlice.actions;

export default masterItemSlice.reducer;