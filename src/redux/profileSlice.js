import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";


//===Fetch user profile from profile Table=== 
export const fetchProfile = createAsyncThunk('profiles/fetchProfile', async (_, thunkAPI) => {
    try {
        const user = await thunkAPI.getState().auth.user;
        if (!user) throw new Error('User not Found!!');
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


//===Update Profile===
export const updateProfile = createAsyncThunk('profiles/updateProfile', async ({ full_name, avatar_url }, thunkAPI) => {
    try {
        const user = thunkAPI.getState().auth.user;
        if (!user) throw new Error('User not Found!!');

        const updates = {
            full_name,
            avatar_url,
            id: user.id,
            updated_at: new Date(),
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(updates)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//===Upload Avatar to Supabase Storage===
export const uploadAvatar = createAsyncThunk('profiles/uploadAvatar', async (fileUri, thunkAPI) => {
    try {
        const user = thunkAPI.getState().auth.user;
        if (!user) throw new Error('User not found');

        const fileExt = fileUri.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`;

        // Fetch file as blob (React Native)
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, { upsert: true });

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = await supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        //Update profile with new avatar URL
        await thunkAPI.dispatch(updateProfile({ avatar_url: publicUrl, full_name: thunkAPI.getState().profile?.full_name || '' }));


        return publicUrl;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


//===Slice===
const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetProfileError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //===Fetching Profile===
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //===Update Profile===
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //===Upload Avatar===
            .addCase(uploadAvatar.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.avatar_url = action.payload;
                }
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { resetProfileError } = profileSlice.actions;
export default profileSlice.reducer;