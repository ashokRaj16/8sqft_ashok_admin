import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout, updateUserProfile } from '../models/authModel';

const storedUser = JSON.parse(localStorage.getItem('userInfo'));
const storedToken = JSON.parse(localStorage.getItem('authToken'));

const initialState = {
    users : storedUser || null,
    token: storedToken || null,
    isLoggedIn : !!storedToken,
    loading : false,
    error : null
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {

            const user = await login(credentials);
            console.log(user);
            localStorage.setItem('authToken', JSON.stringify(user));
            return user;

        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const updateUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {

            const user = await updateUserProfile(credentials);
            console.log(user);
            return user;

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
            localStorage.removeItem('authToken');
            state.users = null;
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( loginUser.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase( loginUser.fulfilled, (state, actions) => {
                state.loading = false;
                state.users = actions.payload;
                state.isLoggedIn = true;
            })
            .addCase( loginUser.rejected, (state, actions) => {
                state.loading = false;
                state.error = actions.payload;
            })
    }
})

export const { logoutUser } = loginSlice.actions;
export default loginSlice.reducer;