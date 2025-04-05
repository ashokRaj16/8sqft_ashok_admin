import { jwtDecode } from 'jwt-decode';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { login, logout } from '../models/authModel';
import { getUserProfile, updateUserProfile } from "../models/profileModel";

// const storedUser = localStorage.getItem('eightsqfttoken');
const storedToken = localStorage.getItem('eightsqfttoken');
const storedUsers = localStorage.getItem('userInfo');

const initialState = {
    users : JSON.parse(storedUsers) || null,
    token: storedToken || null,
    isLoggedIn : !!storedToken,
    loading : false,
    error : null
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {

            console.log(credentials);
            let user;
            const result = await login(credentials);
            if(result) {
                const token = result.data?.sqftAccessToken;
                const refreshToken = result.data?.sqftRefreshToken;
                localStorage.setItem('eightsqfttoken', token);
                localStorage.setItem('eightsqftrefreshtoken', refreshToken);

                const userResult = await getUserProfile(token);
                const userData = userResult.data;
                localStorage.setItem('userInfo', JSON.stringify( userData));
                // const decode = jwtDecode(token)
                // console.log(decode);
                user = { 
                    token: token, 
                    userInfo : userData
                }
            }
            // const data = JSON.stringify(result?.data || null)
            // const { token } = JSON.parse(result.data);
            return user;

        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const updateUsers = createAsyncThunk(
    'auth/updateuser',
    async (userdata, { rejectWithValue}) => {
        try {

            const result = await updateUserProfile(userdata);
            const userData ={
                // ...JSON.Parse( storedUsers),
                ...initialState.users,
                ...result.data
            };
            // console.log(result.data, userData);
            localStorage.setItem('userInfo', JSON.stringify( userData));
            
            return userData;

        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const loginSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {

        logoutUser : (state) => {
            console.log('logount')
            localStorage.removeItem('eightsqfttoken');
            localStorage.removeItem('eightsqftrefreshtoken');
            localStorage.removeItem('userInfo');
            state.users = null;
            state.token = null;
            state.isLoggedIn = false;
        },

        // updateUser: async (state, actions) => {
        //     console.log(state, actions);
        //     try{
        //         const result = await updateUserProfile(actions.payload)
        //         console.log(result);
        //     }
        //     catch (err) {
        //         console.log(err);
        //         state.err = err;
        //         return err
        //     }
        // }
    },
    
    extraReducers: (builder) => {
        builder
            .addCase( loginUser.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase( loginUser.fulfilled, (state, actions) => {
                state.loading = false;
                console.log("actions: ",actions.payload)
                state.users = actions.payload.userInfo;
                state.token = actions.payload.token;
                state.isLoggedIn = true;
            })
            .addCase( loginUser.rejected, (state, actions) => {
                state.loading = false;
                state.error = actions.payload;
            })
            .addCase(updateUsers.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateUsers.fulfilled, (state, actions) => {
                state.loading = false;
                console.log("update: ", actions.payload)
                state.users = actions.payload.userData;
                // state.users = actions.payload;
            }) 
            .addCase(updateUsers.rejected, (state) => {
                state.loading = false;
                state.error = actions.payload
            })
    }
})

export const { logoutUser } = loginSlice.actions;
export default loginSlice.reducer;