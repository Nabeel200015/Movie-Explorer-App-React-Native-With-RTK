import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import moviesReducer from './moviesSlice';
import favoritesReducer from './favoritesSlice';
import reviewsReducer from './reviewsSlice'
import profileReducer from './profileSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        movies: moviesReducer,
        favorites: favoritesReducer,
        reviews: reviewsReducer,
        profile: profileReducer,
    },
});

export default store;