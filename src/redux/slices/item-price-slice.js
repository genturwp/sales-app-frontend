import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'item-price';

export const createItemPrice = createAsyncThunk(
    `${namespace}/createItemPrice`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/price-management/create`;
        const resp = await axios.post(endpointUrl, params.itemPrice, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const findPriceWithFilter = createAsyncThunk(
    `${namespace}/findPriceWithFilter`,
    async (params, thunkAPI) => {

        const endpointUrl = `${CONST.API_ENDPOINT}/price-management/find-price-with-filter?page=${params.page}&size=${params.size}`;
        if (params.itemId) {
            endpointUrl = endpointUrl + `&itemId=${params.itemId}`;
        }
        if (params.lowPrice) {
            endpointUrl = endpointUrl + `&lowPrice=${params.lowPrice}`;
        }
        if (params.highPrice) {
            endpointUrl = endpointUrl + `&highPrice=${params.highPrice}`;
        }
        
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const enableOrDisablePrice = createAsyncThunk(
    `${namespace}/enableOrDisablePrice`,
    async(params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/price-management/enable-or-disable`
        const reqParams = new URLSearchParams();
        reqParams.append('priceId', params.priceId);
        const resp = await axios.post(endpointUrl, reqParams, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/x-www-form-urlencoded'}});
        return resp.data.payload;
    }
)

export const updatePrice = createAsyncThunk(
    `${namespace}/updatePrice`,
    async(params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/price-management/update-price`
        const reqParams = new URLSearchParams();
        reqParams.append('priceId', params.priceId);
        reqParams.append('price', params.price);
        const resp = await axios.post(endpointUrl, reqParams, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/x-www-form-urlencoded'}});
        return resp.data.payload;
    }
)

const itemPriceSlice = createSlice({
    name: namespace,
    initialState: {
        createItemPriceLoading: false,
        createItemPriceResp: null,
        createItemPriceError: null,
        findPriceWithFilterLoading: false,
        findPriceWithFilterResp: null,
        findPriceWithFilterError: null,
        enableOrDisablePriceLoading: false,
        enableOrDisablePriceResp: null,
        enableOrDisablePriceError: null,
        updatePriceLoading: false,
        updatePriceResp: null,
        updatePriceError: null,
    },
    reducers: {
        resetCreateItemPriceResp: (state) => {
            state.createItemPriceResp = null;
        },
        resetCreateItemPriceError: (state) => {
            state.createItemPriceError = null;
        },
        resetFindPriceWithFilterResp: (state) => {
            state.findPriceWithFilterResp = null;
        },
        resetFindPriceWithFilterError: (state) => {
            state.findPriceWithFilterError = null;
        },
        resetEnableOrDisablePriceResp: (state) => {
            state.enableOrDisablePriceResp = null;
        },
        resetEnableOrDisablePriceError: (state) => {
            state.enableOrDisablePriceError = null;
        },
        resetUpdatePriceResp: (state) => {
            state.updatePriceResp = null;
        },
        resetUpdatePriceError: (state) => {
            state.updatePriceError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createItemPrice.pending, (state) => {
                state.createItemPriceLoading = true;
                state.createItemPriceResp = null;
                state.createItemPriceError = null;
            })
            .addCase(createItemPrice.fulfilled, (state, action) => {
                state.createItemPriceLoading = false;
                state.createItemPriceResp = action.payload;
                state.createItemPriceError = null;
            })
            .addCase(createItemPrice.rejected, (state, action) => {
                state.createItemPriceLoading = false;
                state.createItemPriceResp = null;
                state.createItemPriceError = action.error;
            })
            .addCase(findPriceWithFilter.pending, (state) => {
                state.findPriceWithFilterLoading = true;
                state.findPriceWithFilterResp = null;
                state.findPriceWithFilterError = null;
            })
            .addCase(findPriceWithFilter.fulfilled, (state, action) => {
                state.findPriceWithFilterLoading = false;
                state.findPriceWithFilterResp = action.payload;
                state.findPriceWithFilterError = null;
            })
            .addCase(findPriceWithFilter.rejected, (state, action) => {
                state.findPriceWithFilterLoading = false;
                state.findPriceWithFilterResp = null;
                state.findPriceWithFilterError = action.error;
            })
            .addCase(enableOrDisablePrice.pending, (state) => {
                state.enableOrDisablePriceLoading = true;
                state.enableOrDisablePriceResp = null;
                state.enableOrDisablePriceError = null;
            })
            .addCase(enableOrDisablePrice.fulfilled, (state, action) => {
                state.enableOrDisablePriceLoading = false;
                state.enableOrDisablePriceResp = action.payload;
                state.enableOrDisablePriceError = null;
            })
            .addCase(enableOrDisablePrice.rejected, (state, action) => {
                state.enableOrDisablePriceLoading = false;
                state.enableOrDisablePriceResp = null;
                state.enableOrDisablePriceError = action.error;
            })
            .addCase(updatePrice.pending, (state) => {
                state.updatePriceLoading = true;
                state.updatePriceResp = null;
                state.updatePriceError = null;
            })
            .addCase(updatePrice.fulfilled, (state, action) => {
                state.updatePriceLoading = false;
                state.updatePriceResp = action.payload;
                state.updatePriceError = null;
            })
            .addCase(updatePrice.rejected, (state, action) => {
                state.updatePriceLoading = false;
                state.updatePriceResp = null;
                state.updatePriceError = action.error;
            })
    }
})

export const { resetCreateItemPriceError,
    resetCreateItemPriceResp,
    resetEnableOrDisablePriceError,
    resetEnableOrDisablePriceResp,
    resetFindPriceWithFilterError,
    resetFindPriceWithFilterResp,
    resetUpdatePriceError,
    resetUpdatePriceResp } = itemPriceSlice.actions;

export default itemPriceSlice.reducer;