import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'customer';

export const createCustomer = createAsyncThunk(
    `${namespace}/createCustomer`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/customer-management/create`;
        const resp = await axios.post(endpointUrl, params.customer, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const updateCustomer = createAsyncThunk(
    `${namespace}/updateCustomer`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/customer-management/update`;
        const resp = await axios.post(endpointUrl, params.createInvMovement, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchCustomer = createAsyncThunk(
    `${namespace}/searchCustomer`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/customer-management/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

const customerSlice = createSlice({
    name: namespace,
    initialState: {
        createCustomerLoading: false,
        createCustomerError: null,
        createCustomerResp: null,
        updateCustomerLoading: false,
        updateCustomerError: null,
        updateCustomerResp: null,
        searchCustomerLoading: false,
        searchCustomerError: null,
        searchCustomerResp: null
    },
    reducers: {
        resetCreateCustomerLoading: (state) => {
            state.createCustomerLoading = false;
        },
        resetCreateCustomerError: (state) => {
            state.createCustomerError = null;
        },
        resetCreateCustomerResp: (state) => {
            state.createCustomerResp = null;
        },
        resetUpdateCustomerLoading: (state) => {
            state.updateCustomerLoading = false;
        },
        resetUpdateCustomerError: (state) => {
            state.updateCustomerError = null;
        },
        resetUpdateCustomerResp: (state) => {
            state.updateCustomerResp = null;
        },
        resetSearchCustomerLoading: (state) => {
            state.searchCustomerLoading = false;
        },
        resetSearchCustomerError: (state) => {
            state.searchCustomerError = null;
        },
        resetSearchCustomerResp: (state) => {
            state.searchCustomerResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCustomer.pending, (state, action) => {
                state.createCustomerLoading = true;
                state.createCustomerError = null;
                state.createCustomerResp = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.createCustomerLoading = false;
                state.createCustomerError = null;
                state.createCustomerResp = action.payload;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.createCustomerLoading = false;
                state.createCustomerError = action.error;
                state.createCustomerResp = null;
            })
            .addCase(updateCustomer.pending, (state, action) => {
                state.updateCustomerLoading = true;
                state.updateCustomerError = null;
                state.updateCustomerResp = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.updateCustomerLoading = false;
                state.updateCustomerResp = action.payload;
                state.updateCustomerError = null;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.updateCustomerLoading = false;
                state.updateCustomerResp = null;
                state.updateCustomerError = action.error;
            })
            .addCase(searchCustomer.pending, (state, action) => {
                state.searchCustomerLoading = false;
                state.searchCustomerResp = null;
                state.searchCustomerError = null;
            })
            .addCase(searchCustomer.fulfilled, (state, action) => {
                state.searchCustomerLoading = false;
                state.searchCustomerResp = action.payload;
                state.searchCustomerError = null;
            })
            .addCase(searchCustomer.rejected, (state, action) => {
                state.searchCustomerLoading = false;
                state.searchCustomerResp = null;
                state.searchCustomerError = action.error;
            })
    }
});

export const {
    resetCreateCustomerError, resetCreateCustomerLoading, resetCreateCustomerResp, resetSearchCustomerError, 
    resetSearchCustomerLoading, resetSearchCustomerResp, resetUpdateCustomerError, resetUpdateCustomerLoading, resetUpdateCustomerResp
} = customerSlice.actions;

export default customerSlice.reducer;