import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'delivery-order';

export const searchDORequest = createAsyncThunk(
    `${namespace}/searchDORequest`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/search-do-req?searchStr=${params.searchStr}&page=${params.page}&size=${params.size}&doRequestStatus=${params.doRequestStatus}&doNumber=${params.doNumber}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const getDORequest = createAsyncThunk(
    `${namespace}/getDORequest`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/get-doreq/${params.doReqId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const getDoByDoReq = createAsyncThunk(
    `${namespace}/getDoByDoReq`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/find-do-by-doreqid/${params.id}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const createDo = createAsyncThunk(
    `${namespace}/createDo`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/create-do`;
        const resp = await axios.post(endpointUrl, params.do, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
)

export const findDoById = createAsyncThunk(
    `${namespace}/findDoById`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/find-do-by-doid/${params.doId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }   
);

export const setDoReceive = createAsyncThunk(
    `${namespace}/setDoReceive`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/delivery-management/do/set-do-receive`;
        const reqParams = new URLSearchParams();
        reqParams.append('doId', params.doId);
        reqParams.append('receiver', params.receiver);
        const resp = await axios.post(endpointUrl, reqParams, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/x-www-form-urlencoded'}});
        return resp.data.payload;
    }
)

const deliveryOrderSlice = createSlice({
    name: namespace,
    initialState: {
        searchDOReqLoading: false,
        searchDOReqResp: null,
        searchDOReqError: null,
        getDoRequestLoading: false,
        getDoRequestResp: null,
        getDoRequestError: null,
        getDoByDoReqLoading: false,
        getDoByDoReqResp: null,
        getDoByDoReqError: null,
        createDoLoading: false,
        createDoResp: null,
        createDoError: null,
        findDoByIdLoading: false,
        findDoByIdResp: null,
        findDoByIdError: null,
        setDoReceiveLoading: false,
        setDoReceiveResp: null,
        setDoReceiveError: null,
    },
    reducers: {
        resetSearchDOReqLoading: (state) => {
            state.searchDOReqLoading = false;
        },
        resetSearchDOReqResp: (state) => {
            state.searchDOReqResp = null;
        },
        resetSearchDOReqError: (state) => {
            state.searchDOReqError = null;
        },
        resetGetDoRequestLoding: (state) => {
            state.getDoRequestLoading = false;
        },
        resetGetDoRequestResp: (state) => {
            state.getDoRequestResp = null;
        },
        resetGetDoRequestError: (state) => {
            state.getDoRequestError = null;
        },
        resetGetDoByDoReqLoading: (state) => {
            state.getDoByDoReqLoading = false;
        },
        resetGetDoByDoReqResp: (state) => {
            state.getDoByDoReqResp = null;
        },
        resetGetDoByDoReqError: (state) => {
            state.getDoByDoReqError = null;
        },
        resetCreateDoLoading: (state) => {
            state.createDoLoading = false;
        },
        resetCreateDoResp: (state) => {
            state.createDoResp = null;
        },
        resetCreateDoError: (state) => {
            state.createDoError = null;
        },
        resetFindDoByIdLoading: (state) => {
            state.findDoByIdLoading = false;
        },
        resetFindDoByIdResp: (state) => {
            state.findDoByIdResp = null;
        },
        resetFindDoByIdError: (state) => {
            state.findDoByIdError = null;
        },
        resetSetDoReceiveLoading: (state) => {
            state.setDoReceiveLoading = false;
        },
        resetSetDoReceiveResp: (state) => {
            state.setDoReceiveResp = null;
        },
        resetSetDoReceiveError: (state) => {
            state.setDoReceiveError = null;
        }
    },
    extraReducers: (builders) => {
        builders
            .addCase(searchDORequest.pending, (state, action) => {
                state.searchDOReqLoading = true;
                state.searchDOReqResp = null;
                state.searchDOReqError = null;
            })
            .addCase(searchDORequest.fulfilled, (state, action) => {
                state.searchDOReqLoading = false;
                state.searchDOReqResp = action.payload;
                state.searchDOReqError = null;
            })
            .addCase(searchDORequest.rejected, (state, action) => {
                state.searchDOReqLoading = false;
                state.searchDOReqResp = null;
                state.searchDOReqError = action.error;
            })
            .addCase(getDORequest.pending, (state, action) => {
                state.getDoRequestLoading = true;
                state.getDoRequestResp = null;
                state.getDoRequestError = null;
            })
            .addCase(getDORequest.fulfilled, (state, action) => {
                state.getDoRequestLoading = false;
                state.getDoRequestResp = action.payload;
                state.getDoRequestError = null;
            })
            .addCase(getDORequest.rejected, (state, action) => {
                state.getDoRequestLoading = false;
                state.getDoRequestResp = null;
                state.getDoRequestError = action.error;
            })
            .addCase(getDoByDoReq.pending, (state, action) => {
                state.getDoByDoReqLoading = true;
                state.getDoByDoReqResp = null;
                state.getDoByDoReqError = null;
            })
            .addCase(getDoByDoReq.fulfilled, (state, action) => {
                state.getDoByDoReqLoading = false;
                state.getDoByDoReqResp = action.payload;
                state.getDoByDoReqError = null;
            })
            .addCase(getDoByDoReq.rejected, (state, action) => {
                state.getDoByDoReqLoading = false;
                state.getDoByDoReqResp = null;
                state.getDoByDoReqError = action.error;
            })
            .addCase(createDo.pending, (state, action) => {
                state.createDoLoading = true;
                state.createDoResp = null;
                state.createDoError = null;
            })
            .addCase(createDo.fulfilled, (state, action) => {
                state.createDoLoading = false;
                state.createDoResp = action.payload;
                state.createDoError= null;
            })
            .addCase(createDo.rejected, (state, action) => {
                state.createDoLoading = false;
                state.createDoResp = null;
                state.createDoError = action.error;
            })
            .addCase(findDoById.pending, (state, action) => {
                state.findDoByIdLoading = true;
                state.findDoByIdResp = null;
                state.findDoByIdError = null;
            })
            .addCase(findDoById.fulfilled, (state, action) => {
                state.findDoByIdLoading = false;
                state.findDoByIdResp = action.payload;
                state.findDoByIdError = null;
            })
            .addCase(findDoById.rejected, (state, action) => {
                state.findDoByIdLoading = false;
                state.findDoByIdResp = null;
                state.findDoByIdError = action.error;
            })
            .addCase(setDoReceive.pending, (state, action) => {
                state.setDoReceiveLoading= true;
                state.setDoReceiveResp = null;
                state.setDoReceiveError = null;
            })
            .addCase(setDoReceive.fulfilled, (state, action) => {
                state.setDoReceiveLoading = false;
                state.setDoReceiveResp = action.payload;
                state.setDoReceiveError = null;
            })
            .addCase(setDoReceive.rejected, (state, action) => {
                state.setDoReceiveLoading = false;
                state.setDoReceiveResp = null;
                state.setDoReceiveError = action.error;
            })
    }
});

export const {
    resetSearchDOReqError, resetSearchDOReqLoading, resetSearchDOReqResp, resetGetDoRequestError, resetGetDoRequestLoding, resetGetDoRequestResp,
    resetGetDoByDoReqError, resetGetDoByDoReqLoading, resetGetDoByDoReqResp, resetCreateDoError, resetCreateDoLoading, resetCreateDoResp,
    resetFindDoByIdError, resetFindDoByIdLoading, resetFindDoByIdResp, resetSetDoReceiveError, resetSetDoReceiveLoading, resetSetDoReceiveResp
} = deliveryOrderSlice.actions;

export default deliveryOrderSlice.reducer;