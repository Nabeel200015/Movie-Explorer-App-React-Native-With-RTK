import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';


const FavoriteMoviesScreen = ({ navigation }) => {
    const { movies } = useSelector(state => state.movies);
    const { favoriteMovieIds } = useSelector(state => state.favorites);

    const favoriteMovies = movies.filter(movie => favoriteMovieIds.includes(movie.id));

    if (favoriteMovies.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.empty}>No favorites yet.</Text>
            </View>
        );
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
            <Image source={{ uri: item.poster_url }} style={styles.poster} />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );
    return (
        <FlatList
            data={favoriteMovies}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { fontSize: 18, color: '#888' },
    list: { padding: 16 },
    card: { marginBottom: 20 },
    poster: { width: '100%', height: 200, borderRadius: 8 },
    title: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
});

export default FavoriteMoviesScreen;