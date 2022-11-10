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

export const createIncomingPayment = createAsyncThunk(
    `${namespace}/createIncomingPayment`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/si/create-incoming-payment`;
        const resp = await axios.post(endpointUrl, params.incomingPayment, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const getSalesInvoiceById = createAsyncThunk(
    `${namespace}/getSalesInvoiceById`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/si/get-si?invId=${params.invoiceId}`;
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
        createIncomingPaymentLoading: false,
        createIncomingPaymentResp: null,
        createIncomingPaymentErr: null,
        selectedSalesInvoice: null,
        getSalesInvoiceByIdResp: null,
        getSalesInvoiceByIdErr: null,
        getSalesInvoiceByIdLoading: false,
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
        },
        resetCreateIncomingPaymentLoading: (state) => {
            state.createIncomingPaymentLoading = false;
        },
        resetCreateIncomingPaymentResp: (state) => {
            state.createIncomingPaymentResp = null;
        },
        resetCreateIncomingPaymentError: (state) => {
            state.createIncomingPaymentErr = null;
        },
        setSelectedSalesInvoice: (state, action) => {
            state.selectedSalesInvoice = action.payload;
        },
        resetGetSalesInvoiceByIdResp: (state, action) => {
            state.getSalesInvoiceByIdResp = null;
        },
        resetGetSalesInvoiceByIdErr: (state, action) => {
            state.getSalesInvoiceByIdErr = null;
        },
        resetGetSalesInvoiceByIdLoading: (state,action) => {
            state.getSalesInvoiceByIdLoading = false;
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
        .addCase(createIncomingPayment.pending, (state, action) => {
            state.createIncomingPaymentLoading = true;
            state.createIncomingPaymentResp = null;
            state.createIncomingPaymentErr = null;
        })
        .addCase(createIncomingPayment.fulfilled, (state, action) => {
            state.createIncomingPaymentLoading = false;
            state.createIncomingPaymentResp = action.payload;
            state.createIncomingPaymentErr = null;
        })
        .addCase(createIncomingPayment.rejected, (state, action) => {
            state.createIncomingPaymentLoading = false;
            state.createIncomingPaymentResp = null;
            state.createIncomingPaymentErr = action.error;
        })
        .addCase(getSalesInvoiceById.pending, (state, action) => {
            state.getSalesInvoiceByIdLoading = true;
            state.getSalesInvoiceByIdResp = null;
            state.getSalesInvoiceByIdErr = null;
        })
        .addCase(getSalesInvoiceById.fulfilled, (state, action) => {
            state.getSalesInvoiceByIdLoading = false;
            state.getSalesInvoiceByIdResp = action.payload;
            state.getSalesInvoiceByIdErr = null;
        })
        .addCase(getSalesInvoiceById.rejected, (state, action) => {
            state.getSalesInvoiceByIdLoading = false;
            state.getSalesInvoiceByIdResp = null;
            state.getSalesInvoiceByIdErr = action.error;
        })
    }
});

export const {
    resetCreateSalesInvError, resetCreateSalesInvLoading, resetCreateSalesInvResp,
    resetSearchSalesInvLoading, resetSearchSalesInvResp, resetSearchSalesinvError,
    resetCreateIncomingPaymentLoading, resetCreateIncomingPaymentResp, resetCreateIncomingPaymentError,
    setSelectedSalesInvoice,
    resetGetSalesInvoiceByIdErr, resetGetSalesInvoiceByIdLoading, resetGetSalesInvoiceByIdResp
} = salesInvoiceSlice.actions;

export default salesInvoiceSlice.reducer;