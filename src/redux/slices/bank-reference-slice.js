import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'bank-reference';

export const createBankReference = createAsyncThunk(
    `${namespace}/createBankReference`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/create-bank`;
        const resp = await axios.post(endpointUrl, params.bankRef, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const updateBankReference = createAsyncThunk(
    `${namespace}/updateBankReference`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/update-bank`;
        const resp = await axios.post(endpointUrl, params.bankRef, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const fetchAllBankReference = createAsyncThunk(
    `${namespace}/fetchAllBankReference`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/fetch-all-bank`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
);

export const createCustomerBank = createAsyncThunk(
    `${namespace}/createCustomerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/create-customer-bank`;
        const resp = await axios.post(endpointUrl, params.customerBank, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const updateCustomerBank = createAsyncThunk(
    `${namespace}/updateCustomerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/update-customer-bank`;
        const resp = await axios.post(endpointUrl, params.customerBank, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const fetchCustomerBank = createAsyncThunk(
    `${namespace}/fetchCustomerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/fetch-customer-bank?customerId=${params.customerId}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
);

export const createOwnerBank = createAsyncThunk(
    `${namespace}/createOwnerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/create-owner-bank`;
        const resp = await axios.post(endpointUrl, params.ownerBank, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const updateOwnerBank = createAsyncThunk(
    `${namespace}/updateOwnerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/update-owner-bank`;
        const resp = await axios.post(endpointUrl, params.ownerBank, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const fetchOwnerBank = createAsyncThunk(
    `${namespace}/fetchOwnerBank`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/bank-reference/fetch-owner-bank`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
);

const bankReferenceSlice = createSlice({
    name: namespace,
    initialState: {
        createBankRefLoading: false,
        createBankRefResp: null,
        createBankRefErr: null,
        updateBankRefLoading: false,
        updateBankRefResp: null,
        updateBankRefErr: null,
        fetchBankRefLoading: false,
        fetchBankRefResp: null,
        fetchBankrefErr: null,
        createCustBankLoading: false,
        createCustBankResp: null,
        createCustBankErr: null,
        updateCustBankLoading: false,
        updateCustBankResp: null,
        updateCustBankErr: null,
        fetchCustBankLoading: false,
        fetchCustBankResp: null,
        fetchCustBankError: null,
        createOwnerBankLoading: false,
        createOwnerBankResp: null,
        createOwnerBankErr: null,
        updateOwnerBankLoading: false,
        updateOwnerBankResp: null,
        updateOwnerBankErr: null,
        fetchOwnerBankLoading: false,
        fetchOwnerBankResp: null,
        fetchOwnerBankErr: null
    },
    reducers: {
        resetCreateBankRefLoading: (state) => {
            state.createBankRefLoading = false;
        },
        resetCreateBankRefResp: (state) => {
            state.createBankRefResp = null;
        },
        resetCreateBankRefErr: (state) => {
            state.createBankRefErr = null;
        },
        resetUpdateBankRefLoading: (state) => {
            state.updateBankRefLoading = false;
        },
        resetUpdateBankRefResp: (state) => {
            state.updateBankRefResp = null;
        },
        resetUpdateBankRefErr: (state) => {
            state.updateBankRefErr = null;
        },
        resetFetchBankRefLoading: (state) => {
            state.fetchBankRefLoading = false;
        },
        resetFetchBankRefResp: (state) => {
            state.fetchBankRefResp = null;
        },
        resetFetchBankRefErr: (state) => {
            state.fetchBankRefResp = null;
        },
        resetCreateCustBankLoading: (state) => {
            state.createCustBankLoading = false;
        },
        resetCreateCustBankResp: (state, action) => {
            state.createCustBankResp = null;
        },
        resetCreateCustBankErr: (state, action) => {
            state.createCustBankErr = null;
        },
        resetUpdateCustBankLoading: (state,action) => {
            state.updateCustBankLoading = false;
        },
        resetUpdateCustBankResp: (state, action) => {
            state.updateCustBankResp = null;
        },
        resetUpdateCustBankErr: (state, action) => {
            state.updateCustBankErr = null;
        },
        resetFetchCustBankLoading: (state) => {
            state.fetchCustBankLoading = false;
        },
        resetFetchCustBankResp: (state, action) => {
            state.fetchCustBankResp = null;
        },
        resetFetchCustBankErr: (state, action) => {
            state.fetchCustBankError = null;
        },
        resetCreateOwnerBankLoading: (state) => {
            state.createOwnerBankLoading = false;
        },
        resetCreateOwnerBankResp: (state, action) => {
            state.createOwnerBankResp = null;
        },
        resetCreateOwnerBankErr: (state, action) => {
            state.createOwnerBankResp = null;
        },
        resetUpdateOwnerBankLoading: (state) => {
            state.updateOwnerBankLoading = false;
        },
        resetUpdateOwnerBankResp: (state, action) => {
            state.updateBankRefErr = null;
        },
        resetUpdateOwnerBankErr: (state, action) => {
            state.updateCustBankErr = null;
        },
        resetFetchOwnerBankLoading: (state) => {
            state.fetchOwnerBankLoading = false;
        },
        resetFetchOwnerBankResp: (state, action) => {
            state.fetchOwnerBankResp = null;
        },
        resetFetchOwnerBankErr: (state, action) => {
            state.fetchOwnerBankErr = null;
        }
    },
    extraReducers: (builders) => {
        builders
        .addCase(createBankReference.pending, (state, action) => {
            state.createBankRefLoading = true;
            state.createBankRefResp = null;
            state.createBankRefErr = null;
        })
        .addCase(createBankReference.fulfilled, (state, action) => {
            state.createBankRefLoading = false;
            state.createBankRefResp = action.payload;
            state.createBankRefErr = null;
        })
        .addCase(createBankReference.rejected, (state, action) => {
            state.createBankRefLoading = false;
            state.createBankRefResp = null;
            state.createBankRefErr = action.error;
        })
        .addCase(updateBankReference.pending, (state, action) => {
            state.updateBankRefLoading = true;
            state.updateBankRefResp = null;
            state.updateBankRefErr = null;
        })
        .addCase(updateBankReference.fulfilled, (state, action) => {
            state.updateBankRefLoading = false;
            state.updateBankRefResp = action.payload;
            state.updateBankRefErr = null;
        })
        .addCase(updateBankReference.rejected, (state, action) => {
            state.updateBankRefLoading = false;
            state.updateBankRefResp = null;
            state.updateBankRefErr = action.error;
        })
        .addCase(fetchAllBankReference.pending, (state, action) => {
            state.fetchBankRefLoading = true;
            state.fetchBankRefResp = null;
            state.fetchBankrefErr = null;
        })
        .addCase(fetchAllBankReference.fulfilled, (state, action) => {
            state.fetchBankRefLoading = false;
            state.fetchBankRefResp = action.payload;
            state.fetchBankrefErr = null;
        })
        .addCase(fetchAllBankReference.rejected, (state, action) => {
            state.fetchBankRefLoading = false;
            state.fetchBankRefResp = null;
            state.fetchBankrefErr = action.error;
        })
        .addCase(createOwnerBank.pending, (state, action) => {
            state.createOwnerBankLoading = true;
            state.createOwnerBankResp = null;
            state.createOwnerBankErr = null;
        })
        .addCase(createOwnerBank.fulfilled, (state, action) => {
            state.createOwnerBankLoading = false;
            state.createOwnerBankResp = action.payload;
            state.createOwnerBankErr = null;
        })
        .addCase(createOwnerBank.rejected, (state, action) => {
            state.createOwnerBankLoading = false;
            state.createOwnerBankResp = null;
            state.createOwnerBankErr = action.error;
        })
        .addCase(updateOwnerBank.pending, (state, action) => {
            state.updateOwnerBankLoading = true;
            state.updateOwnerBankResp = null;
            state.updateOwnerBankErr = null;
        })
        .addCase(updateOwnerBank.fulfilled, (state, action) => {
            state.updateOwnerBankLoading = false;
            state.updateOwnerBankResp = action.payload;
            state.updateOwnerBankErr = null;
        })
        .addCase(updateOwnerBank.rejected, (state, action) => {
            state.updateOwnerBankLoading = false;
            state.updateOwnerBankResp = null;
            state.updateOwnerBankErr = action.error;
        })
        .addCase(fetchOwnerBank.pending, (state, action) => {
            state.fetchOwnerBankLoading = true;
            state.fetchOwnerBankResp = null;
            state.fetchOwnerBankErr = null;
        })
        .addCase(fetchOwnerBank.fulfilled, (state, action) => {
            state.fetchOwnerBankLoading = false;
            state.fetchOwnerBankResp = action.payload;
            state.fetchOwnerBankErr = null;
        })
        .addCase(fetchOwnerBank.rejected, (state, action) => {
            state.fetchOwnerBankLoading = false;
            state.fetchOwnerBankResp = null;
            state.fetchOwnerBankErr = action.error;
        })
        .addCase(fetchCustomerBank.pending, (state, action) => {
            state.fetchCustBankLoading = true;
            state.fetchCustBankResp = null;
            state.fetchCustBankError = null;
        })
        .addCase(fetchCustomerBank.fulfilled, (state, action) => {
            state.fetchCustBankLoading = false;
            state.fetchCustBankResp = action.payload;
            state.fetchCustBankError = null;
        })
        .addCase(fetchCustomerBank.rejected, (state, action) => {
            state.fetchCustBankLoading = false;
            state.fetchCustBankResp = null;
            state.fetchCustBankError = action.error;
        })
        .addCase(createCustomerBank.pending, (state, action) => {
            state.createCustBankLoading = true;
            state.createCustBankResp = null;
            state.createCustBankErr = null;
        })
        .addCase(createCustomerBank.fulfilled, (state, action) => {
            state.createCustBankLoading = false;
            state.createCustBankResp = action.payload;
            state.createCustBankErr = null;
        })
        .addCase(createCustomerBank.rejected, (state, action) => {
            state.createCustBankLoading = false;
            state.createCustBankResp = null;
            state.createCustBankErr = action.error;
        })
    }
});

export const {
    resetCreateBankRefErr, resetCreateBankRefLoading, resetCreateBankRefResp,
    resetUpdateBankRefErr, resetUpdateBankRefLoading, resetUpdateBankRefResp,
    resetFetchBankRefErr, resetFetchBankRefLoading, resetFetchBankRefResp,
    resetCreateCustBankErr, resetCreateCustBankLoading, resetCreateCustBankResp,
    resetUpdateCustBankErr, resetUpdateCustBankLoading, resetUpdateCustBankResp,
    resetCreateOwnerBankErr, resetCreateOwnerBankLoading, resetCreateOwnerBankResp,
    resetUpdateOwnerBankErr, resetUpdateOwnerBankLoading, resetUpdateOwnerBankResp,
    resetFetchCustBankLoading, resetFetchCustBankResp, resetFetchCustBankErr, 
    resetFetchOwnerBankErr, resetFetchOwnerBankLoading, resetFetchOwnerBankResp
} = bankReferenceSlice.actions;

export default bankReferenceSlice.reducer;