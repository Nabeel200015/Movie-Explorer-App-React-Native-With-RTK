import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";


//===Fetch Favorites=== 
export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, thunkAPI) => {
    try {
        const { data: user } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('favorites')
            .select('movie_id')
            .eq('user_id', user.user.id);

        if (error) throw error;

        return data.map(fav => fav.movie_id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Add Favorite===
export const addFavorite = createAsyncThunk('favorites/addFavorite', async (movie_id, thunkAPI) => {
    try {
        const { data: user } = await supabase.auth.getUser();
        const { error } = await supabase.from('favorites').insert({
            user_id: user.user.id,
            movie_id,
        });

        if (error) throw error;
        return movie_id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Remove Favorite===
export const removeFavorite = createAsyncThunk('favorites/removeFavorites', async (movie_id, thunkAPI) => {
    try {
        const { data: user } = await supabase.auth.getUser();
        const { error } = await supabase.from('favorites')
            .delete()
            .match({
                user_id: user.user.id,
                movie_id,
            });

        if (error) throw error;

        return movie_id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Slice===
const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        favoriteMovieIds: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //===Fetch==
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.favoriteMovieIds = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //===Add===
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favoriteMovieIds.push(action.payload);
            })

            //===Remove===
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favoriteMovieIds.filter(id => id !== action.payload);
            });
    }
});

export default favoritesSlice.reducer;