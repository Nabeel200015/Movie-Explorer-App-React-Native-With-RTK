import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/profileSlice';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.profile);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);

    if (loading || !profile) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.placeholder]}>
                    <Text style={styles.placeholderText}>No Avatar</Text>
                </View>
            )}

            <Text style={styles.name}>{profile.full_name || "No Name Set"}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, alignItems: 'center' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
});

export default ProfileScreen;