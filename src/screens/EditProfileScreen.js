import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, uploadAvatar } from '../redux/profileSlice';

const EditProfileScreen = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.profile);
    const [fullName, setFullName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        dispatch(fetchProfile());
    }, []);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarPreview(profile.avatar_url || null);
        }
    }, [profile]);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarPreview(profile.avatar_url || null);
        }
    }, [profile]);

    const handleSave = () => {
        dispatch(updateProfile(updateProfile({ full_name: fullName, avatar_url: profile?.avatar_url || '' })))
            .unwrap()
            .then(() => Alert.alert("Success", "Profile updated successfully"));
    };

    const handlePickAvatar = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.didCancel || response.errorCode) return;

            const uri = response.assets?.[0]?.uri;

            if (uri) {
                setAvatarPreview(uri);
                dispatch(uploadAvatar(uri));
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            {loading && <ActivityIndicator size="large" />}

            <TouchableOpacity onPress={handlePickAvatar}>
                {avatarPreview ? (
                    <Image source={{ uri: avatarPreview }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.placeholder]}>
                        <Text style={styles.placeholderText}>Pick Avatar</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#000"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
            />

            <Button title="Save" onPress={handleSave} disabled={loading} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    placeholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: { color: '#666' },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        color: '#000',
    },
});

export default EditProfileScreen;