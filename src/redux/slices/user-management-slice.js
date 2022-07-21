import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONST from '../../../const';

const namespace = 'user-management';

export const fetchAllRoles = createAsyncThunk(
    `${namespace}/fetchAllRoles`,
    async (token, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/user-management/roles`;
        const resp = await axios.get(endpointUrl, {headers: {'Authorization': `Bearer ${token}`}});
        return resp.data.payload;
    }
);

export const searchUser = createAsyncThunk(
    `${namespace}/searchUser`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/user-management/user/search?page=${params.page}&size=${params.size}&searchStr=${params.searchStr}`;
        const resp = await axios.get(endpointUrl, {headers: {'Authorization': `Bearer ${params.token}`}});
        return resp.data.payload;
    }
);

export const enableOrDisableUser = createAsyncThunk(
    `${namespace}/enableOrDisableUser`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/user-management/user/enable-disable`;
        const reqParams = new URLSearchParams();
        reqParams.append('profileId', params.profileId);
        const resp = await axios.post(endpointUrl, reqParams, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/x-www-form-urlencoded'}});
        return resp.data.payload;
    }
);

export const createUser = createAsyncThunk(
    `${namespace}/createUser`,
    async (params, thunkAPI) => {
        const endpointUrl = `${CONST.API_ENDPOINT}/user-management/user/create`;
        const userReq = {
            name: params.name,
            phone: params.phone,
            email: params.email,
            address: params.address,
            username: params.username,
            password: params.password,
            roles: params.roles
        }
        const resp = await axios.post(endpointUrl, userReq, {headers: {'Authorization': `Bearer ${params.token}`, 'Content-Type': 'application/json'}});
        return resp.data.payload;
    }
);

const userManagementSlice = createSlice({
    name: namespace,
    initialState: {
        fetchRolesLoading: false,
        fetchRolesError: null,
        roles: [],
        searchUsersLoading: false,
        searchUsersError: null,
        users: null,
        enableOrDisableUserLoading: false,
        enableOrDisableUserError: null,
        enableOrDisableUserResp: null,
        createUserLoading: false,
        createUserError: null,
        createUserResp: null,
    },
    reducers: {
        resetFetchRolesError: (state) => {
            state.fetchRolesError = null;
        },
        resetSearchUsersError: (state) => {
            state.searchUsersError = null;
        },
        resetEnableOrDisableUserError: (state) => {
            state.enableOrDisableUserError = null;
        },
        resetCreateUserError: (state) => {
            state.createUserError = null;
        },
        resetCreateUserResp: (state) => {
            state.createUserResp = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllRoles.pending, (state) => {
            state.fetchRolesLoading = true;
            state.roles = [];
            state.fetchRolesError = null;
        })
        .addCase(fetchAllRoles.fulfilled, (state, action) => {
            state.fetchRolesLoading = false;
            state.roles = action.payload;
            state.fetchRolesError = false;
        })
        .addCase(fetchAllRoles.rejected, (state, action) => {
            state.fetchRolesLoading = false;
            state.roles = [];
            state.fetchRolesError = action.error;
        })
        .addCase(searchUser.pending, (state) => {
            state.searchUsersLoading = true;
            state.users = null;
            state.searchUsersError = null;
        })
        .addCase(searchUser.fulfilled, (state, action) => {
            state.searchUsersLoading = false;
            state.users = action.payload;
            state.searchUsersError = null;
        })
        .addCase(searchUser.rejected, (state, action) => {
            state.searchUsersLoading = false;
            state.users = null;
            state.searchUsersError = action.error;
        })
        .addCase(enableOrDisableUser.pending, (state) => {
            state.enableOrDisableUserLoading = true;
            state.enableOrDisableUserResp = null;
            state.enableOrDisableUserError = null;
        })
        .addCase(enableOrDisableUser.fulfilled, (state, action) => {
            state.enableOrDisableUserLoading = false;
            state.enableOrDisableUserResp = action.payload;
            state.enableOrDisableUserError = null;
        })
        .addCase(enableOrDisableUser.rejected, (state, action) => {
            state.enableOrDisableUserLoading = false;
            state.enableOrDisableUserResp = null;
            state.enableOrDisableUserError = action.error;
        })
        .addCase(createUser.pending, (state) => {
            state.createUserLoading = true;
            state.createUserResp = null;
            state.createUserError = null;
        })
        .addCase(createUser.fulfilled, (state, action) => {
            state.createUserLoading = false;
            state.createUserResp = action.payload;
            state.createUserError = null;
        })
        .addCase(createUser.rejected, (state, action) => {
            state.createUserLoading = false;
            state.createUserResp = null;
            state.createUserError = action.error;
        })
    }
});

export const {resetCreateUserError, resetEnableOrDisableUserError, resetFetchRolesError, resetSearchUsersError, resetCreateUserResp} = userManagementSlice.actions;

export default userManagementSlice.reducer;