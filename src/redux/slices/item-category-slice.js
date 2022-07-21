import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'item-category';

export const createItemCategory = createAsyncThunk(
    `${namespace}/createItemCategory`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-category/create`;
        const userReq = {
            itemCategoryName: params.itemCategoryName,
            itemCategoryDescription: params.itemCategoryDescription,
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchItemCategory = createAsyncThunk(
    `${namespace}/searchItemCategory`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-category/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const updateItemCategory = createAsyncThunk(
    `${namespace}/updateItemCategory`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/item-category/update`;
        const userReq = {
            id: params.id,
            itemCategoryName: params.itemCategoryName,
            itemCategoryDescription: params.itemCategoryDescription,
        }
        const resp = await axios.post(endpointUrl, userReq, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const itemCategorySlice = createSlice({
    name: namespace,
    initialState: {
        createItemCategoryLoading: false,
        createItemCategoryResp: null,
        createItemCategoryError: null,
        searchItemCategoryLoading: false,
        searchItemCategoryResp: [],
        searchItemCategoryError: null,
        updateItemCategoryLoading: false,
        updateItemCategoryResp: null,
        updateItemCategoryError: null,
    },
    reducers: {
        resetCreateItemCategoryError: (state) => {
            state.createItemCategoryError = null;
        },
        resetSearchItemCategoryError: (state) => {
            state.searchItemCategoryError = null;
        },
        resetUpdateItemCategoryError: (state) => {
            state.updateItemCategoryError = null;
        },
        resetCreateItemCategoryResp: (state) => {
            state.createItemCategoryResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createItemCategory.pending, (state) => {
                state.createItemCategoryLoading = true;
                state.createItemCategoryResp = null;
                state.createItemCategoryError = null;
            })
            .addCase(createItemCategory.fulfilled, (state, action) => {
                state.createItemCategoryLoading = false;
                state.createItemCategoryResp = action.payload;
                state.createItemCategoryError = null;
            })
            .addCase(createItemCategory.rejected, (state, action) => {
                state.createItemCategoryLoading = false;
                state.createItemCategoryResp = null;
                state.createItemCategoryError = action.error;
            })
            .addCase(searchItemCategory.pending, (state) => {
                state.searchItemCategoryLoading = true;
                state.searchItemCategoryResp = [];
                state.searchItemCategoryError = null;
            })
            .addCase(searchItemCategory.fulfilled, (state, action) => {
                state.searchItemCategoryLoading = false;
                state.searchItemCategoryResp = action.payload;
                state.searchItemCategoryError = null;
            })
            .addCase(searchItemCategory.rejected, (state, action) => {
                state.searchItemCategoryLoading = false;
                state.searchItemCategoryResp = [];
                state.searchItemCategoryError = action.error;
            })
            .addCase(updateItemCategory.pending, (state) => {
                state.updateItemCategoryLoading = true;
                state.updateItemCategoryResp = null;
                state.updateItemCategoryError = null;
            })
            .addCase(updateItemCategory.fulfilled, (state, action) => {
                state.updateItemCategoryLoading = false;
                state.updateItemCategoryResp = action.payload;
                state.updateItemCategoryError = null;
            })
            .addCase(updateItemCategory.rejected, (state, action) => {
                state.updateItemCategoryLoading = false;
                state.updateItemCategoryResp = null;
                state.updateItemCategoryError = action.error;
            })

    }
})

export const {resetCreateItemCategoryError, resetSearchItemCategoryError, resetUpdateItemCategoryError, resetCreateItemCategoryResp} = itemCategorySlice.actions;

export default itemCategorySlice.reducer;