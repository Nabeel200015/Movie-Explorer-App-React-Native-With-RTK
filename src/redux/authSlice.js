import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";

//==SIGNUP==
export const signUp = createAsyncThunk('auth/signUp', async ({ email, password }, thunkAPI) => {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//==LOGIN==
export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//==LOGOUT==
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        return;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//==Slice==
const state = {
    user: null,
    session: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: state,
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
            state.user = action.payload?.user || null;
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Sign Up ---
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload.session;
                state.user = action.payload.user;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Login ---
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload.session;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Logout ---
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.session = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSession, resetError } = authSlice.actions;

export default authSlice.reducer;

