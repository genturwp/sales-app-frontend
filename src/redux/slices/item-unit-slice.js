import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'item-unit';

export const createItemUnit = createAsyncThunk(
    `${namespace}/createItemUnit`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-unit/create`;
        const userReq = {
            unitName: params.unitName,
            unitDescription: params.unitDescription,
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchItemUnit = createAsyncThunk(
    `${namespace}/searchItemUnit`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-unit/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const updateItemUnit = createAsyncThunk(
    `${namespace}/updateItemUnit`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-unit/update`;
        const userReq = {
            id: params.id,
            unitName: params.unitName,
            unitDescription: params.unitDescription,
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const itemUnitSlice = createSlice({
    name: namespace,
    initialState: {
        createItemUnitLoading: false,
        createItemUnitResp: null,
        createItemUnitError: null,
        searchItemUnitLoading: false,
        searchItemUnitResp: [],
        searchItemUnitError: null,
        updateItemUnitLoading: false,
        updateItemUnitResp: null,
        updateItemUnitError: null,
    },
    reducers: {
        resetCreateItemUnitError: (state) => {
            state.createItemUnitError = null;
        },
        resetSearchItemUnitError: (state) => {
            state.searchItemUnitError = null;
        },
        resetUpdateItemUnitError: (state) => {
            state.updateItemUnitError = null;
        },
        resetCreateItemUnitResp: (state) => {
            state.createItemUnitResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createItemUnit.pending, (state) => {
                state.createItemUnitLoading = true;
                state.createItemUnitResp = null;
                state.createItemUnitError = null;
            })
            .addCase(createItemUnit.fulfilled, (state, action) => {
                state.createItemUnitLoading = false;
                state.createItemUnitResp = action.payload;
                state.createItemUnitError = null;
            })
            .addCase(createItemUnit.rejected, (state, action) => {
                state.createItemUnitLoading = false;
                state.createItemUnitResp = null;
                state.createItemUnitError = action.error;
            })
            .addCase(searchItemUnit.pending, (state) => {
                state.searchItemUnitLoading = true;
                state.searchItemUnitResp = [];
                state.searchItemUnitError = null;
            })
            .addCase(searchItemUnit.fulfilled, (state, action) => {
                state.searchItemUnitLoading = false;
                state.searchItemUnitResp = action.payload;
                state.searchItemUnitError = null;
            })
            .addCase(searchItemUnit.rejected, (state, action) => {
                state.searchItemUnitLoading = false;
                state.searchItemUnitResp = [];
                state.searchItemUnitError = action.error;
            })
            .addCase(updateItemUnit.pending, (state) => {
                state.updateItemUnitLoading = true;
                state.updateItemUnitResp = null;
                state.updateItemUnitError = null;
            })
            .addCase(updateItemUnit.fulfilled, (state, action) => {
                state.updateItemUnitLoading = false;
                state.updateItemUnitResp = action.payload;
                state.updateItemUnitError = null;
            })
            .addCase(updateItemUnit.rejected, (state, action) => {
                state.updateItemUnitLoading = false;
                state.updateItemUnitResp = null;
                state.updateItemUnitError = action.error;
            })

    }
})

export const {resetCreateItemUnitError, resetSearchItemUnitError, resetUpdateItemUnitError, resetCreateItemUnitResp} = itemUnitSlice.actions;

export default itemUnitSlice.reducer;