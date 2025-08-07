
import React from 'react'
import AuthStack from './AuthStack'
import { useSelector } from 'react-redux'
import { ActivityIndicator, View } from 'react-native';
import AppStack from './AppStack';

const AppNavigator = () => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return user ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;