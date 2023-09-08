import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'supplier';

export const searchSupplier = createAsyncThunk(
    `${namespace}/searchSupplier`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/supplier/search-supplier?supplierName=${params.supplierName}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const findSupplierWithPaging = createAsyncThunk(
    `${namespace}/findSupplierWithPaging`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/supplier/find-with-paging?page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const createSupplier = createAsyncThunk(
    `${namespace}/createSupplier`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/supplier/create`;
        const resp = await axios.post(endpointUrl, params.supplier, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
)


const supplierSlice = createSlice({
    name: namespace,
    initialState: {
        searchSupplierLoading: false,
        searchSupplierResp: null,
        searchSupplierError: null,
        findSupplierWithPagingLoading: false,
        findSupplierWithPagingResp: null,
        findSupplierWithPagingError: null,
        createSupplierLoading: false,
        createSupplierResp: null,
        createSupplierError: null,
    },
    reducers: {
        resetSearchSupplierLoading: (state) => {
            state.searchSupplierLoading = false;
        },
        resetSearchSupplierResp: (state) => {
            state.searchSupplierResp = null;
        },
        resetSearchSupplierError: (state) => {
            state.searchSupplierError = null;
        },
        resetFindSupplierWithPagingLoading: (state) => {
            state.findSupplierWithPagingLoading = false;
        },
        resetFindSupplierWithPagingResp: (state) => {
            state.findSupplierWithPagingResp = null;
        },
        resetFindSupplierWithPagingError: (state) => {
            state.findSupplierWithPagingError = null;
        },
        resetCreateSupplierLoading: (state) => {
            state.createSupplierLoading = false;
        },
        resetCreateSupplierResp: (state) => {
            state.createSupplierResp = null;
        },
        resetCreateSupplierError: (state) => {
            state.createSupplierError = null;
        },
        
    },
    extraReducers: (builders) => {
        builders
            .addCase(searchSupplier.pending, (state, action) => {
                state.searchSupplierLoading = true;
                state.searchSupplierResp = null;
                state.searchSupplierError = null;
            })
            .addCase(searchSupplier.fulfilled, (state, action) => {
                state.searchSupplierLoading = false;
                state.searchSupplierResp = action.payload;
                state.searchSupplierError = null;
            })
            .addCase(searchSupplier.rejected, (state, action) => {
                state.searchSupplierLoading = false;
                state.searchSupplierResp = null;
                state.searchSupplierError = action.error;
            })
            .addCase(findSupplierWithPaging.pending, (state, action) => {
                state.findSupplierWithPagingLoading = true;
                state.findSupplierWithPagingResp = null;
                state.findSupplierWithPagingError = null;
            })
            .addCase(findSupplierWithPaging.fulfilled, (state, action) => {
                state.findSupplierWithPagingLoading = false;
                state.findSupplierWithPagingResp = action.payload;
                state.findSupplierWithPagingError = null;
            })
            .addCase(findSupplierWithPaging.rejected, (state, action) => {
                state.findSupplierWithPagingLoading = false;
                state.findSupplierWithPagingResp = null;
                state.findSupplierWithPagingError = action.error;
            })
            .addCase(createSupplier.pending, (state, action) => {
                state.createSupplierLoading = true;
                state.createSupplierResp = null;
                state.createSupplierError = null;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.createSupplierLoading = false;
                state.createSupplierResp = action.payload;
                state.createSupplierError = null;
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.createSupplierLoading = false;
                state.createSupplierResp = null;
                state.createSupplierError = action.error;
            })
    }
});

export const {
    resetSearchSupplierLoading, resetSearchSupplierResp, resetSearchSupplierError,
    resetFindSupplierWithPagingError, resetFindSupplierWithPagingLoading, resetFindSupplierWithPagingResp,
    resetCreateSupplierError, resetCreateSupplierLoading, resetCreateSupplierResp
} = supplierSlice.actions;

export default supplierSlice.reducer;