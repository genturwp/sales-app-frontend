import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'sales-invoice';

export const createSalesInvoice = createAsyncThunk(
    `${namespace}/createSalesInvoice`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/si/create-si`;
        const resp = await axios.post(endpointUrl, params.salesInvoice, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchSalesInvoice = createAsyncThunk(
    `${namespace}/searchSalesInvoice`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/si/search?searchStr=${params.searchStr}&invoiceStatus=${params.invoiceStatus}&page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
);

const salesInvoiceSlice = createSlice({
    name: namespace,
    initialState: {
        createSalesInvLoading: false,
        createSalesInvResp: null,
        createSalesInvError: null,
        searchSalesInvLoading: false,
        searchSalesInvResp: null,
        searchSalesInvError: null,
    },
    reducers: {
        resetCreateSalesInvLoading: (state) => {
            state.createSalesInvLoading = false;
        },
        resetCreateSalesInvResp: (state) => {
            state.createSalesInvResp = null;
        },
        resetCreateSalesInvError: (state) => {
            state.createSalesInvError = null;
        },
        resetSearchSalesInvLoading: (state) => {
            state.searchSalesInvLoading = false;
        },
        resetSearchSalesInvResp: (state) => {
            state.searchSalesInvResp = null;
        },
        resetSearchSalesinvError: (state) => {
            state.searchSalesInvError = null;
        }
    },
    extraReducers: (builders) => {
        builders
        .addCase(createSalesInvoice.pending, (state, action) => {
            state.createSalesInvLoading = true;
            state.createSalesInvResp = null;
            state.createSalesInvError = null;
        })
        .addCase(createSalesInvoice.fulfilled, (state, action) => {
            state.createSalesInvLoading = false;
            state.createSalesInvResp= action.payload;
            state.createSalesInvError = null;
        })
        .addCase(createSalesInvoice.rejected, (state, action) => {
            state.createSalesInvLoading = false;
            state.createSalesInvResp = null;
            state.createSalesInvError = action.error;
        })
        .addCase(searchSalesInvoice.pending, (state, action) => {
            state.searchSalesInvLoading = true;
            state.searchSalesInvResp = null;
            state.searchSalesInvError = null;
        })
        .addCase(searchSalesInvoice.fulfilled, (state, action) => {
            state.searchSalesInvLoading = false;
            state.searchSalesInvResp = action.payload;
            state.searchSalesInvError = null;
        })
        .addCase(searchSalesInvoice.rejected, (state, action) => {
            state.searchSalesInvLoading = false;
            state.searchSalesInvResp = null;
            state.searchSalesInvError = action.error;
        })
    }
});

export const {
    resetCreateSalesInvError, resetCreateSalesInvLoading, resetCreateSalesInvResp,
    resetSearchSalesInvLoading, resetSearchSalesInvResp, resetSearchSalesinvError
} = salesInvoiceSlice.actions;

export default salesInvoiceSlice.reducer;