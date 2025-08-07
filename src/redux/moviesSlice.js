import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";

//===Thunk: FETCH MOVIES===
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (_, thunkAPI) => {
    try {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .order('release_date', { ascending: false });

        if (error) throw error;

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Slice==
const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default moviesSlice.reducer;