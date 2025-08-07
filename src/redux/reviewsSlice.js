import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";


//===Fetch Reviews According to Movie by movie_id===
export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (movie_id, thunkAPI) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('movie_id', movie_id)
            .order('created_at', { ascending: false });

        if (error) throw error

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Add review(rating,comment with movie_id) to Movie===
export const addReview = createAsyncThunk('reviews/addReview', async ({ movie_id, rating, comment }, thunkAPI) => {
    try {
        const { user } = await thunkAPI.getState().auth;
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ movie_id, rating, comment, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Edit review(using review id,rating,comment)===
export const editReview = createAsyncThunk('reviews/editReview', async ({ id, rating, comment }, thunkAPI) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .update({ rating, comment })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Delete review(using review id)===
export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id, thunkAPI) => {
    try {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Slice===
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add 
            .addCase(addReview.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                console.log('Error :', action.payload);
            })

            // Edit Review
            .addCase(editReview.fulfilled, (state, action) => {
                const index = state.items.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(editReview.rejected, (state, action) => {
                console.log("Error :", action.payload);
            })

            // Delete Review
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.items = state.items.filter(r => r.id !== action.payload);
            });
    }
});

export const { resetError } = reviewsSlice.actions;

export default reviewsSlice.reducer;