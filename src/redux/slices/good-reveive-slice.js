import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'good-receive';

export const fetchGoodReceiveWithPaging = createAsyncThunk(
    `${namespace}/fetchGoodReceiveWithPaging`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/good-receive/find-with-paging?page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const createGoodReceive = createAsyncThunk(
    `${namespace}/createGoodReceive`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/good-receive/receive`;
        const resp = await axios.post(endpointUrl, params.goodReceive, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
)

const goodReceiveSlice = createSlice({
    name: namespace,
    initialState: {
        fetchGoodReceiveWithPagingLoading: false,
        fetchGoodReceiveWithPagingResp: null,
        fetchGoodReceiveWithPagingError: null,
        createGoodReceiveLoading: false,
        createGoodReceiveResp: null,
        createGoodReceiveError: null,
    },
    reducers: {
        resetFetchGoodReceiveWithPagingLoading: (state) => {
            state.fetchGoodReceiveWithPagingLoading = false;
        },
        resetFetchGoodReceiveWithPagingResp: (state) => {
            state.fetchGoodReceiveWithPagingResp = null;
        },
        resetFetchGoodReceiveWithPagingError: (state) => {
            state.fetchGoodReceiveWithPagingError = null;
        },
        resetCreateGoodReceiveLoading: (state) => {
            state.createGoodReceiveLoading = false;
        },
        resetCreateGoodReceiveResp: (state) => {
            state.createGoodReceiveResp = null;
        },
        resetCreateGoodReceiveError: (state) => {
            state.createGoodReceiveError = null;
        }
    },
    extraReducers: (builders) => {
        builders
            .addCase(fetchGoodReceiveWithPaging.pending, (state, action) => {
                state.fetchGoodReceiveWithPagingLoading = true;
                state.fetchGoodReceiveWithPagingResp = null;
                state.fetchGoodReceiveWithPagingError = null;
            })
            .addCase(fetchGoodReceiveWithPaging.fulfilled, (state, action) => {
                state.fetchGoodReceiveWithPagingLoading = false;
                state.fetchGoodReceiveWithPagingResp = action.payload;
                state.fetchGoodReceiveWithPagingError = null;
            })
            .addCase(fetchGoodReceiveWithPaging.rejected, (state, action) => {
                state.fetchGoodReceiveWithPagingLoading = false;
                state.fetchGoodReceiveWithPagingResp = null;
                state.fetchGoodReceiveWithPagingError = action.error;
            })
            .addCase(createGoodReceive.pending, (state, action) => {
                state.createGoodReceiveLoading = true;
                state.createGoodReceiveResp = null;
                state.createGoodReceiveError = null;
            })
            .addCase(createGoodReceive.fulfilled, (state, action) => {
                state.createGoodReceiveLoading = false;
                state.createGoodReceiveResp = action.payload;
                state.createGoodReceiveError = null;
            })
            .addCase(createGoodReceive.rejected, (state, action) => {
                state.createGoodReceiveLoading = false;
                state.createGoodReceiveResp = null;
                state.createGoodReceiveError = action.error;
            })
    }
});

export const {
    resetFetchGoodReceiveWithPagingLoading, resetFetchGoodReceiveWithPagingResp, resetFetchGoodReceiveWithPagingError,
    resetCreateGoodReceiveError, resetCreateGoodReceiveLoading, resetCreateGoodReceiveResp
} = goodReceiveSlice.actions;

export default goodReceiveSlice.reducer;