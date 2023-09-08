import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'master-item';

export const createMasterItem = createAsyncThunk(
    `${namespace}/createMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/create`;
        const data = {
            ...params.data, itemWeight: parseFloat(params.data.itemWeight), 
            dimension: {
                height: parseFloat(params.data.dimension.height),
                length: parseFloat(params.data.dimension.length),
                width: parseFloat(params.data.dimension.width)
            }
        }
        const resp = await axios.post(endpointUrl, JSON.stringify(data), { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const searchMasterItem = createAsyncThunk(
    `${namespace}/searchMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/search?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const searchMasterItemInv = createAsyncThunk(
    `${namespace}/searchMasterItemInv`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/search-inv?page=${params.page}&size=${params.size}&searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

export const searchInventoryItem = createAsyncThunk(
    `${namespace}/searchInventoryItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/master-item-inventory?page=${params.page}&size=${params.size}&searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const searchInventoryItemNoPaging = createAsyncThunk(
    `${namespace}/searchInventoryItemNoPaging`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/master-item-inventory-no-paging?searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
)

export const updateMasterItem = createAsyncThunk(
    `${namespace}/updateMasterItem`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/master-item/update`;
        const data = {
            ...params.data, itemWeight: parseFloat(params.data.itemWeight), 
            dimension: {
                height: parseFloat(params.data.dimension.height),
                length: parseFloat(params.data.dimension.length),
                width: parseFloat(params.data.dimension.width)
            }
        }
        const resp = await axios.post(endpointUrl, JSON.stringify(data), { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

const masterItemSlice = createSlice({
    name: namespace,
    initialState: {
        createMasterItemLoading: false,
        createMasterItemResp: null,
        createMasterItemError: null,
        searchMasterItemLoading: false,
        searchMasterItemResp: [],
        searchMasterItemError: null,
        searchMasterItemInvLoading: false,
        searchMasterItemInvResp: null,
        searchMasterItemInvError: null,
        updateMasterItemLoading: false,
        updateMasterItemResp: null,
        updateMasterItemError: null,
        searchInventoryItemLoading: false,
        searchInventoryItemResp: null,
        searchInventoryItemError: null,
        searchInventoryItemNoPagingLoading: false,
        searchInventoryItemNoPagingResp: null,
        searchInventoryItemNoPagingError: null
    },
    reducers: {
        resetCreateMasterItemError: (state) => {
            state.createMasterItemError = null;
        },
        resetSearchMasterItemError: (state) => {
            state.searchMasterItemError = null;
        },
        resetSearchMasterItemInvError: (state) => {
            state.searchMasterItemInvError = null;
        },
        resetUpdateMasterItemError: (state) => {
            state.updateMasterItemError = null;
        },
        resetCreateMasteritemResp: (state) => {
            state.createMasterItemResp = null;
        },
        resetUpdateMasterItemResp: (state) => {
            state.updateMasterItemResp = null;
        },
        resetSearchInventoryItemLoading: (state) => {
            state.searchInventoryItemLoading = false;
        },
        resetSearchInventoryItemResp: (state) => {
            state.searchInventoryItemResp = null;
        },
        resetSearchInventoryItemError: (state) => {
            state.searchInventoryItemError = null;
        },
        resetSearchInventoryItemLoading: (state) => {
            state.searchInventoryItemNoPagingLoading = false;
        },
        resetSearchInventoryItemResp: (state) => {
            state.searchInventoryItemNoPagingResp = null;
        },
        resetSearchInventoryItemError: (state) => {
            state.searchInventoryItemNoPagingError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createMasterItem.pending, (state) => {
                state.createMasterItemLoading = true;
                state.createMasterItemResp = null;
                state.createMasterItemError = null;
            })
            .addCase(createMasterItem.fulfilled, (state, action) => {
                state.createMasterItemLoading = false;
                state.createMasterItemResp = action.payload;
                state.createMasterItemError = null;
            })
            .addCase(createMasterItem.rejected, (state, action) => {
                state.createMasterItemLoading = false;
                state.createMasterItemResp = null;
                state.createMasterItemError = action.error;
            })
            .addCase(searchMasterItem.pending, (state) => {
                state.searchMasterItemLoading = true;
                state.searchMasterItemResp = [];
                state.searchMasterItemError = null;
            })
            .addCase(searchMasterItem.fulfilled, (state, action) => {
                state.searchMasterItemLoading = false;
                state.searchMasterItemResp = action.payload;
                state.searchMasterItemError = null;
            })
            .addCase(searchMasterItem.rejected, (state, action) => {
                state.searchMasterItemLoading = false;
                state.searchMasterItemResp = [];
                state.searchMasterItemError = action.error;
            })
            .addCase(searchMasterItemInv.pending, (state) => {
                state.searchMasterItemInvLoading = true;
                state.searchMasterItemInvResp = null;
                state.searchMasterItemInvError = null;
            })
            .addCase(searchMasterItemInv.fulfilled, (state, action) => {
                state.searchMasterItemInvLoading = false;
                state.searchMasterItemInvResp = action.payload;
                state.searchMasterItemInvError = null;
            })
            .addCase(searchMasterItemInv.rejected, (state, action) => {
                state.searchMasterItemInvLoading = false;
                state.searchMasterItemInvResp = null;
                state.searchMasterItemInvError = action.error;
            })
            .addCase(updateMasterItem.pending, (state) => {
                state.updateMasterItemLoading = true;
                state.updateMasterItemResp = null;
                state.updateMasterItemError = null;
            })
            .addCase(updateMasterItem.fulfilled, (state, action) => {
                state.updateMasterItemLoading = false;
                state.updateMasterItemResp = action.payload;
                state.updateMasterItemError = null;
            })
            .addCase(updateMasterItem.rejected, (state, action) => {
                state.updateMasterItemLoading = false;
                state.updateMasterItemResp = null;
                state.updateMasterItemError = action.error;
            })
            .addCase(searchInventoryItem.pending, (state) => {
                state.searchInventoryItemLoading = true;
                state.searchInventoryItemResp = null;
                state.searchInventoryItemError = null;
            })
            .addCase(searchInventoryItem.fulfilled, (state, action) => {
                state.searchInventoryItemLoading = false;
                state.searchInventoryItemResp = action.payload;
                state.searchInventoryItemError = null;
            })
            .addCase(searchInventoryItem.rejected, (state, action) => {
                state.searchInventoryItemLoading = false;
                state.searchInventoryItemResp = null;
                state.searchInventoryItemError = action.error;
            })
            .addCase(searchInventoryItemNoPaging.pending, (state) => {
                state.searchInventoryItemNoPagingLoading = true;
                state.searchInventoryItemNoPagingResp = null;
                state.searchInventoryItemNoPagingError = null;
            })
            .addCase(searchInventoryItemNoPaging.fulfilled, (state, action) => {
                state.searchInventoryItemNoPagingLoading = false;
                state.searchInventoryItemNoPagingResp = action.payload;
                state.searchInventoryItemNoPagingError = null;
            })
            .addCase(searchInventoryItemNoPaging.rejected, (state, action) => {
                state.searchInventoryItemNoPagingLoading = false;
                state.searchInventoryItemNoPagingResp = null;
                state.searchInventoryItemNoPagingError = action.error;
            })


    }
})

export const {resetCreateMasterItemError, resetSearchMasterItemError, 
    resetSearchMasterItemInvError, resetUpdateMasterItemError, 
    resetCreateMasteritemResp, resetUpdateMasterItemResp, resetSearchInventoryItemError, 
    resetSearchInventoryItemLoading, resetSearchInventoryItemResp} = masterItemSlice.actions;

export default masterItemSlice.reducer;