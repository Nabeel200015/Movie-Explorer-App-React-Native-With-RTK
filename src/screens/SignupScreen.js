import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, resetError } from '../redux/authSlice';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);

    const handleSignup = () => {
        dispatch(signUp({ email, password }));
    };

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
            dispatch(resetError());
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

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

            <Button title={loading ? "Loading..." : "Sign Up"} onPress={handleSignup} disabled={loading} />

            <Text style={styles.switchText}>
                Already have an account?
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}> Log In</Text>
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

export default SignupScreen;