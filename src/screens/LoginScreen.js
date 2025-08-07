import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetError } from '../redux/authSlice';


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    const handleLogin = () => {
        dispatch(login({ email, password }));
    };


    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder='Email'
                placeholderTextColor='#000'
                value={email}
                autoCapitalize="none"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                placeholderTextColor='#000'
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button title={loading ? "Loading..." : "Log In"} onPress={handleLogin} disabled={loading} />

            <Text style={styles.switchText}>
                Don't have an account?
                <Text style={styles.link} onPress={() => navigation.navigate('Signup')}> Sign Up</Text>
            </Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, color: '#000' },
    switchText: { textAlign: 'center', marginTop: 20 },
    link: { color: 'blue' }
});

export default LoginScreen;