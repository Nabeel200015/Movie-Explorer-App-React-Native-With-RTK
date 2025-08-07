import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, TextInput, Button, FlatList, Text, Image, StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, fetchFavorites, removeFavorite } from '../redux/favoritesSlice';
import { addReview, deleteReview, editReview, fetchReviews } from '../redux/reviewsSlice';

const MovieDetailScreen = () => {
    const route = useRoute();
    const movie = route.params?.movie;

    const dispatch = useDispatch();
    const { favoriteMovieIds } = useSelector(state => state.favorites);
    const { items: reviews, error } = useSelector(state => state.reviews);
    const user = useSelector(state => state.auth.user);

    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const isFavorite = useSelector(state => state.favorites.favoriteMovieIds.includes(movie.id));

    useEffect(() => {
        dispatch(fetchFavorites());
    }, []);

    useEffect(() => {
        if (error) {
            console.log("Review Error:", error);
        }
    }, [error]);


    const handleToggleFavorite = async () => {
        if (isFavorite) {
            await dispatch(removeFavorite(movie.id));
        } else {
            await dispatch(addFavorite(movie.id));
        }
        dispatch(fetchFavorites());
        console.log('Favorites :', favoriteMovieIds);
    };

    useEffect(() => {
        dispatch(fetchReviews(movie.id));
        console.log('Reviews :', reviews);
    }, [movie.id]);

    const handleReviewSubmit = () => {
        if (!rating || !comment || isNaN(rating) || rating < 1 || rating > 10) {
            Alert.alert("Error", "Please enter a valid rating (1–10) and comment.");
            return;
        }
        if (myReview) {
            dispatch(editReview({ id: myReview.id, rating, comment }));
        } else {
            dispatch(addReview({ movie_id: movie.id, rating, comment }));

        }

        dispatch(fetchReviews(movie.id));

        setRating('');
        setComment('');

    };

    const handleDeleteReview = (id) => {
        Alert.alert('Delete Review', 'Are you sure?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    dispatch(deleteReview(id))
                    setRating('');
                    setComment('');
                }
            },
        ]);
        dispatch();
        dispatch(fetchReviews(movie.id));
    };

    const myReview = reviews.find(r => r.user_id === user?.id);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: movie.poster_url }} style={styles.poster} resizeMode='contain' />
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.subtext}>Release Date: {movie.release_date}</Text>
            <Text style={styles.subtext}>Rating: {movie.rating}</Text>
            <Text style={styles.description}>{movie.description}</Text>

            <TouchableOpacity style={styles.favoriteBtn} onPress={handleToggleFavorite}>
                <Text style={styles.favoriteText}>{isFavorite ? '💖 Remove Favorite' : '🤍 Add to Favorites'}</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Reviews</Text>
            </View>

            {myReview ? (
                <View style={{ marginVertical: 10, gap: 10 }}>
                    <TextInput
                        style={styles.reviewInput}
                        placeholderTextColor={'#000'}
                        placeholder="Update rating"
                        value={rating}
                        onChangeText={setRating}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Update your comment"
                        placeholderTextColor={'#000'}
                        value={comment}
                        onChangeText={setComment}
                    />
                    <Button title="Update Review" onPress={handleReviewSubmit} />
                    <Button
                        title="Delete Review"
                        onPress={() => handleDeleteReview(myReview.id)}
                        color="red"
                    />
                </View>
            ) : (
                user && (
                    <View style={{ marginVertical: 10, gap: 10 }}>

                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Rating (1–10)"
                            placeholderTextColor={'#000'}
                            value={rating}
                            onChangeText={setRating}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Write a comment"
                            placeholderTextColor={'#000'}
                            value={comment}
                            onChangeText={setComment}
                        />
                        <Button title={"Add Review"} onPress={handleReviewSubmit} />
                    </View>
                )
            )}

            <FlatList
                scrollEnabled={false}
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>
                                {item.user_id === user?.id ? 'You' : item.user_id}
                            </Text>
                            <Text>Rating: {item.rating}</Text>
                            <Text>{item.comment}</Text>

                        </View>
                    )
                }
                }
            />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    poster: {
        width: '100%',
        height: 400,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    description: {
        marginTop: 15,
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'justify',
    },
    favoriteBtn: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 8,
        alignItems: 'center',
    },
    favoriteText: { fontSize: 16, fontWeight: '600' },
    reviewInput: {
        borderWidth: 2
    }
});

export default MovieDetailScreen;