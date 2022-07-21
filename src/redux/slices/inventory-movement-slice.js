import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'inventory-movement';

export const createInventoryMovement = createAsyncThunk(
    `${namespace}/createInventoryMovement`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory-movement/create`;
        const resp = await axios.post(endpointUrl, params.createInvMovement, { headers: { 'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json' } });
        return resp.data.payload;
    }
);

export const findAllInvMovement = createAsyncThunk(
    `${namespace}/findAllInvMovement`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/inventory-management/inventory-movement/find-all?page=${params.page}&size=${params.size}`;
        const resp = await axios.get(endpointUrl, { headers: { 'Authorization': `Bearer ${params.token}` } });
        return resp.data.payload;
    }
);

const inventoryMovementSlice = createSlice({
    name: namespace,
    initialState: {
        createInventoryMovementLoading: false,
        createInventoryMovementError: null,
        createInventoryMovementResp: null,
        findAllInvMovementLoading: false,
        findAllInvMovementError: null,
        findAllInvMovementData: null,
    },
    reducers: {
        resetCreateInventoryMovementError: (state) => {
            state.createInventoryMovementError = null;
        },
        resetCreateInventoryMovementResp: (state) => {
            state.createInventoryMovementResp = null;
        },
        resetFindAllInvMovementError: (state) => {
            state.findAllInvMovementError = null;
        },
        resetFindAllInvMovementData: (state) => {
            state.findAllInvMovementData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInventoryMovement.pending, (state) => {
                state.createInventoryMovementLoading = true;
                state.createInventoryMovementError = null;
                state.createInventoryMovementResp = null;
            })
            .addCase(createInventoryMovement.fulfilled, (state, action) => {
                state.createInventoryMovementLoading = false;
                state.createInventoryMovementError = null;
                state.createInventoryMovementResp = action.payload;
            })
            .addCase(createInventoryMovement.rejected, (state, action) => {
                state.createInventoryMovementLoading = false;
                state.createInventoryMovementError = action.error;
                state.createInventoryMovementResp = null;
            })
            .addCase(findAllInvMovement.pending, (state) => {
                state.findAllInvMovementLoading = true;
                state.findAllInvMovementData = null;
                state.findAllInvMovementError = null;
            })
            .addCase(findAllInvMovement.fulfilled, (state, action) => {
                state.findAllInvMovementLoading = false;
                state.findAllInvMovementData = action.payload;
                state.findAllInvMovementError = null;
            })
            .addCase(findAllInvMovement.rejected, (state, action) => {
                state.findAllInvMovementLoading = false;
                state.findAllInvMovementData = null;
                state.findAllInvMovementError = action.error;
            })
    }
});

export const {resetCreateInventoryMovementError, resetCreateInventoryMovementResp, resetFindAllInvMovementData, resetFindAllInvMovementError} = inventoryMovementSlice.actions;
export default inventoryMovementSlice.reducer;