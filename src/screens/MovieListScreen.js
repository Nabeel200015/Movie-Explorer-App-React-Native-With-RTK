import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/moviesSlice';

const MovieListScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { movies, loading, error } = useSelector(state => state.movies);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch])

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
            <Image source={{ uri: item.poster_url }} style={styles.poster} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Rating: {item.rating}</Text>
                <Text style={styles.subtitle}>Release: {item.release_date}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Button title="Go to Favorites" color="lightgreen" onPress={() => navigation.navigate('Favorites')} />
                <Button title="Go to Profile" color="orange" onPress={() => navigation.navigate('EditProfile')} />
            </View>
            <FlatList
                data={movies}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    list: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
    },
    poster: {
        width: 100,
        height: 150,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MovieListScreen;