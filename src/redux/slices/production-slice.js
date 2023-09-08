import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'production';

export const fetchProductionWithPaging = createAsyncThunk(
    `${namespace}/fetchProduction`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/production/find-with-paging?page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const createProduction = createAsyncThunk(
    `${namespace}/createProduction`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/production/create`;
        const resp = await axios.post(endpointUrl, params.production, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
)

const production = createSlice({
    name: namespace,
    initialState: {
        fetchProductionWithPagingLoading: false,
        fetchProductionWithPagingResp: null,
        fetchProductionWithPagingError: null,
        createProductionLoading: false,
        createProductionResp: null,
        createProductionError: null,
    },
    reducers: {
        resetFetchGoodReceiveWithPagingLoading: (state) => {
            state.fetchProductionWithPagingLoading = false;
        },
        resetFetchGoodReceiveWithPagingResp: (state) => {
            state.fetchProductionWithPagingResp = null;
        },
        resetFetchGoodReceiveWithPagingError: (state) => {
            state.fetchProductionWithPagingError = null;
        },
        resetCreateProductionLoading: (state) => {
            state.createProductionLoading = false;
        },
        resetCreateProductionResp: (state) => {
            state.createProductionResp = null;
        },
        resetCreateProductionError: (state) => {
            state.createProductionError = null;
        }
    },
    extraReducers: (builders) => {
        builders
            .addCase(fetchProductionWithPaging.pending, (state, action) => {
                state.fetchProductionWithPagingLoading = true;
                state.fetchProductionWithPagingResp = null;
                state.fetchProductionWithPagingError = null;
            })
            .addCase(fetchProductionWithPaging.fulfilled, (state, action) => {
                state.fetchProductionWithPagingLoading = false;
                state.fetchProductionWithPagingResp = action.payload;
                state.fetchProductionWithPagingError = null;
            })
            .addCase(fetchProductionWithPaging.rejected, (state, action) => {
                state.fetchProductionWithPagingLoading = false;
                state.fetchProductionWithPagingResp = null;
                state.fetchProductionWithPagingError = action.error;
            })
            .addCase(createProduction.pending, (state, action) => {
                state.createProductionLoading = true;
                state.createProductionResp = null;
                state.createProductionError = null;
            })
            .addCase(createProduction.fulfilled, (state, action) => {
                state.createProductionLoading = false;
                state.createProductionResp = action.payload;
                state.createProductionError = null;
            })
            .addCase(createProduction.rejected, (state, action) => {
                state.createProductionLoading = false;
                state.createProductionResp = null;
                state.createProductionError = action.error;
            })
    }
});

export const {
    resetFetchGoodReceiveWithPagingError, resetFetchGoodReceiveWithPagingLoading, resetFetchGoodReceiveWithPagingResp,
    resetCreateProductionError, resetCreateProductionLoading, resetCreateProductionResp
} = production.actions;

export default production.reducer;