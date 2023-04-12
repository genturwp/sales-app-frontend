import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'sales-order';

export const createSODraft = createAsyncThunk(
    `${namespace}/createSODraft`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/create-draft`;
        const resp = await axios.post(endpointUrl, params.soDraft, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const updateSODraftToOpen = createAsyncThunk(
    `${namespace}/updateSODraftToOpen`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/set-open`;
        const reqParams = new URLSearchParams();
        reqParams.append('soId', params.soId);
        const resp = await axios.post(endpointUrl, reqParams, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/x-www-form-urlencoded'}});
        return resp.data.payload;
    }
);

export const searchSalesOrder = createAsyncThunk(
    `${namespace}/searchSalesOrder`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/search?searchStr=${params.searchStr}&page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const findSOById = createAsyncThunk(
    `${namespace}/findSOById`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/detail/${params.soId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const searchSalesItems = createAsyncThunk(
    `${namespace}/searchSalesItems`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/search-sales-items?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const searchSalesOrderBySoNumber = createAsyncThunk(
    `${namespace}/searchSalesOrderSoNumber`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/search-by-so-number?soNumber=${params.soNumber}`
        const resp = await axios.get(endpointUrl, {headers: {'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
)

export const updateSOTransaction = createAsyncThunk(
    `${namespace}/updateSOTransaction`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/update-transaction`;
        const resp = await axios.post(endpointUrl, params.soDraft, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const salesOrderSlice = createSlice({
    name: namespace,
    initialState: {
        createSODraftLoading: false,
        createSODraftResp: null,
        createSODraftError: null,
        updateSODraftToOpenLoading: false,
        updateSODraftToOpenResp: null,
        updateSODraftToOpenError: null,
        searchSalesOrderLoading: false,
        searchSalesOrderResp: null,
        searchSalesOrderError: null,
        searchSalesItemsLoading: false,
        searchSalesItemsResp: null,
        searchSalesItemsError: null,
        findSOByIdLoading: false,
        findSOByIdResp: null,
        findSOByIdError: null,
        searchSoBySoNumberLoading: false,
        searchSoBySoNumberResp: null,
        searchSoBySoNumberError: null,
        updateSOTransactionLoading: false,
        updateSOTransactionResp: null,
        updateSOTransactionError: null,
    },
    reducers: {
        resetUpdateSOTransactionLoading: (state) => {
            state.updateSOTransactionLoading = false;
        },
        resetUpdateSOTransactionResp: (state) => {
            state.updateSOTransactionResp = null;
        },
        resetUpdateSOTransactionError: (state) => {
            state.updateSOTransactionError = null;
        },
        resetCreateSODraftLoading: (state) => {
            state.createSODraftLoading = false;
        },
        resetCreateSODraftResp: (state) => {
            state.createSODraftResp = null;
        },
        resetCreateSODraftError: (state) => {
            state.createSODraftError = null;
        },
        resetUpdateSODraftToOpenLoading: (state) => {
            state.updateSODraftToOpenLoading = false;
        },
        resetUpdateSODraftToOpenResp: (state) => {
            state.updateSODraftToOpenResp = null;
        },
        resetUpdateSODraftToOpenError: (state) => {
            state.updateSODraftToOpenError = null;
        },
        resetSearchSalesOrderLoading: (state) => {
            state.searchSalesOrderLoading = false;
        },
        resetSearchSalesOrderResp: (state) => {
            state.searchSalesOrderResp = null;
        },
        resetSearchSalesOrderError: (state) => {
            state.searchSalesOrderError = null;
        },
        resetSearchSalesItemsLoading: (state) => {
            state.searchSalesItemsLoading = false;
        },
        resetSearchSalesItemsResp: (state) => {
            state.searchSalesItemsResp = null;
        },
        resetSearchSalesItemsError: (state) => {
            state.searchSalesItemsError = null;
        },
        resetFindSOByIdLoading: (state) => {
            state.findSOByIdLoading = false;
        },
        resetFindSOByIdResp: (state) => {
            state.findSOByIdResp = null;
        },
        resetFindSOByIdError: (state) => {
            state.findSOByIdError = null;
        },
        resetSearchSoBySoNumberLoading: (state) => {
            state.searchSoBySoNumberLoading = false;
        },
        resetSearchSoBySoNumberResp: (state) => {
            state.searchSoBySoNumberResp = null;
        },
        resetSearchSoBySoNumberError: (state) => {
            state.searchSoBySoNumberError = null;
        }
    },
    extraReducers: (builders) => {
        builders
            .addCase(createSODraft.pending, (state, action) => {
                state.createSODraftLoading = true;
                state.createSODraftResp = null;
                state.createSODraftError = null;
            })
            .addCase(createSODraft.fulfilled, (state, action) => {
                state.createSODraftLoading = false;
                state.createSODraftResp = action.payload;
                state.createSODraftError = null;
            })
            .addCase(createSODraft.rejected, (state, action) => {
                state.createSODraftLoading = false;
                state.createSODraftResp = null;
                state.createSODraftError = action.error;
            })
            .addCase(updateSODraftToOpen.pending, (state, action) => {
                state.updateSODraftToOpenLoading = true;
                state.updateSODraftToOpenResp = null;
                state.updateSODraftToOpenError = null;
            })
            .addCase(updateSODraftToOpen.fulfilled, (state, action) => {
                state.updateSODraftToOpenLoading = false;
                state.updateSODraftToOpenResp = action.payload;
                state.updateSODraftToOpenError = null;
            })
            .addCase(updateSODraftToOpen.rejected, (state, action) => {
                state.updateSODraftToOpenLoading = false;
                state.updateSODraftToOpenResp = null;
                state.updateSODraftToOpenError = action.error;
            })
            .addCase(searchSalesOrder.pending, (state, action) => {
                state.searchSalesOrderLoading = true;
                state.searchSalesOrderResp = null;
                state.searchSalesOrderError = null;
            })
            .addCase(searchSalesOrder.fulfilled, (state, action) => {
                state.searchSalesOrderLoading = false;
                state.searchSalesOrderResp = action.payload;
                state.searchSalesOrderError = null;
            })
            .addCase(searchSalesOrder.rejected, (state, action) => {
                state.searchSalesOrderLoading = false;
                state.searchSalesOrderResp = null;
                state.searchSalesOrderError = action.error;
            })
            .addCase(searchSalesItems.pending, (state, action) => {
                state.searchSalesItemsLoading = true;
                state.searchSalesItemsResp = null;
                state.searchSalesItemsError = null;
            })
            .addCase(searchSalesItems.fulfilled, (state, action) => {
                state.searchSalesItemsLoading = false;
                state.searchSalesItemsResp = action.payload;
                state.searchSalesItemsError = null;
            })
            .addCase(searchSalesItems.rejected, (state, action) => {
                state.searchSalesItemsLoading = false;
                state.searchSalesItemsResp = null;
                state.searchSalesItemsError = action.error;
            })
            .addCase(findSOById.pending, (state, action) => {
                state.findSOByIdLoading = true;
                state.findSOByIdResp= null;
                state.findSOByIdError = null;
            })
            .addCase(findSOById.fulfilled, (state, action) => {
                state.findSOByIdLoading = false;
                state.findSOByIdResp= action.payload;
                state.findSOByIdError = null;
            })
            .addCase(findSOById.rejected, (state, action) => {
                state.findSOByIdLoading = false;
                state.findSOByIdResp= null;
                state.findSOByIdError = action.error;
            })
            .addCase(searchSalesOrderBySoNumber.pending, (state, action) => {
                state.searchSoBySoNumberLoading = true;
                state.searchSoBySoNumberResp = null;
                state.searchSoBySoNumberError = null;
            })
            .addCase(searchSalesOrderBySoNumber.fulfilled, (state, action) => {
                state.searchSoBySoNumberLoading = false;
                state.searchSoBySoNumberResp = action.payload;
                state.searchSoBySoNumberError = null;
            })
            .addCase(searchSalesOrderBySoNumber.rejected, (state, action) => {
                state.searchSoBySoNumberLoading = false;
                state.searchSoBySoNumberResp = null;
                state.searchSoBySoNumberError = action.error;
            })
            .addCase(updateSOTransaction.pending, (state, action) => {
                state.updateSOTransactionLoading = true;
                state.updateSOTransactionResp = null;
                state.updateSOTransactionError = null;
            })
            .addCase(updateSOTransaction.fulfilled, (state, action) => {
                state.updateSOTransactionLoading = false;
                state.updateSOTransactionResp = action.payload;
                state.updateSOTransactionError = null;
            })
            .addCase(updateSOTransaction.rejected, (state, action) => {
                state.updateSOTransactionLoading = false;
                state.updateSOTransactionResp = null;
                state.updateSOTransactionError = action.error;
            })
    }
});

export const {
resetCreateSODraftError, resetCreateSODraftLoading, resetCreateSODraftResp, resetSearchSalesOrderError, 
resetSearchSalesOrderLoading, resetSearchSalesOrderResp, resetUpdateSODraftToOpenError, resetUpdateSODraftToOpenLoading, resetUpdateSODraftToOpenResp,
resetSearchSalesItemsError, resetSearchSalesItemsLoading, resetSearchSalesItemsResp, resetFindSOByIdError, resetFindSOByIdLoading, resetFindSOByIdResp,
resetSearchSoBySoNumberLoading, resetSearchSoBySoNumberResp, resetSearchSoBySoNumberError, resetUpdateSOTransactionError, resetUpdateSOTransactionLoading, resetUpdateSOTransactionResp
} = salesOrderSlice.actions;

export default salesOrderSlice.reducer;