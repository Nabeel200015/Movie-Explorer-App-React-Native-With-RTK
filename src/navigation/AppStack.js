import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoriteMoviesScreen from '../screens/FavoriteMoviesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MovieList' component={MovieListScreen} />
            <Stack.Screen name='MovieDetail' component={MovieDetailScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} />
            <Stack.Screen name='Favorites' component={FavoriteMoviesScreen} />
        </Stack.Navigator>
    )
}

export default AppStack;