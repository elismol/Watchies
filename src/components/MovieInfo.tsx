import React, { useEffect, useState } from "react";
import { Text, Image, TouchableOpacity, View, Linking, StyleSheet } from 'react-native';
import { addLike, removeLike } from "../api/movieAPI";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { wHeight, wWidth } from "../utils/Utils";
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";
import { modalMovie } from "../states/modalMovie";
import { favouriteMoviesList } from "../states/favouriteMoviesList";

// pop up with more information about a movie
const MovieInfo = () => {
    const [poster, setPoster] = useState(require("../resources/loadingImage.png"));
    const [email, setEmail] = useState( async () => {
        const saved = await AsyncStorage.getItem("email");
        return saved || "";
      })
    const [favourites, setFavourites] = useRecoilState(favouriteMoviesList);
    const [mode, setMode] = useRecoilState(brightnessMode);
    const [modal, setModal] = useRecoilState(modalMovie);
    const [isInFavourite, setIsInFavorite] = useState(false);

    useEffect(()=> {
        setPoster({uri : modal.movie.posterlink});
        if (favourites.movies.some(m => m.id === modal.movie.id)) {
            setIsInFavorite(true);
        };
    }, []);

    const imageError = () => {
        setPoster((require("../resources/errorImage.png")));
    }


    // sends a query to either add or remove a favorite movie to the users favorite movie list
    const handleFavouriteButton = async () => {
        if (favourites.movies.some(m => m.id === modal.movie.id)) {
            await removeLike(await email, modal.movie.id);
            setFavourites({movies: favourites.movies.filter((m) => {return m.id !== modal.movie.id})});
            setIsInFavorite(false);
        } else {
            await addLike(await email, modal.movie.id);
            setFavourites({movies: [...favourites.movies, modal.movie]});
            setIsInFavorite(true);

        }
    }
    
        
    return(
        <>
        <View style={[styles.infoContainer, {backgroundColor: mode.cardBackgroundColor}]}>
            {
            (poster === require("../resources/loadingImage.png")) ?
                <Image source={require("../resources/loadingImage.png")}  style={styles.image}/> 
                : 
                <Image source={poster} onError={imageError} style={styles.image}/>
            }

            <View style={[styles.centerOfCard, {flexDirection: "column"}]}>
                <Text style={[styles.info, {color: mode.cardColor,fontWeight: 'bold'}]}>{ modal.movie.title }</Text>
                <Text style={[styles.info, {color: mode.cardColor}]}>Release year: { modal.movie.year }</Text>
                <Text style={[styles.info, {color: mode.cardColor}]}>Genres: { modal.movie.genre.join(", ").toLowerCase() }</Text>
                <Text style={[styles.info, {color: mode.cardColor}]}>IMDB score: {modal.movie.imdbscore} </Text>

                <View style={styles.infoCard}>
                <TouchableOpacity 
                        onPress={async () => {await Linking.openURL(modal.movie.imdblink)}} 
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            paddingVertical: wHeight(0.5),
                            marginVertical: wHeight(0.5),
                            width: wWidth(43.75),
                            }}
                        >
                        <View style={{
                            width: wWidth(18), 
                            height: wWidth(9),
                            justifyContent: "center",
                            alignItems: "center",
                            }}
                        >
                            <Image source={require("../resources/imdb.png")} style={{width: '100%', height: '100%'}}/>
                        </View>
                        <Text style={{color: mode.cardColor, fontSize: wWidth(3.5)}}>Go to imdb</Text>
                    </TouchableOpacity>

                    {
                    isInFavourite ? 
                        <TouchableOpacity 
                            onPress={handleFavouriteButton} 
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                                paddingVertical: wHeight(0.5),
                                marginVertical: wHeight(0.5),
                                width: wWidth(43.75)
                                }}
                            >
                            <View style={{
                                width: wWidth(9.4166), 
                                height: wWidth(9),
                                justifyContent: "center",
                                alignItems: "center",
                                }}
                            >
                                <Image source={require("../resources/starOneTone.png")} style={{width: '100%', height: '100%'}}/>
                            </View>
                            <Text style={{color: mode.cardColor, fontSize: wWidth(3.5)}}>Remove from favourites</Text>
                        </TouchableOpacity>
                            : 
                        <TouchableOpacity 
                            onPress={handleFavouriteButton} 
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                                paddingVertical: wHeight(0.5),
                                marginVertical: wHeight(0.5),
                                width: wWidth(43.75),
                                }}
                            >
                            <View style={{
                                width: wWidth(9.4166), 
                                height: wWidth(9),
                                justifyContent: "center",
                                alignItems: "center",
                                }}
                            >
                                <Image source={require("../resources/starTwoTone.png")} style={{width: '100%', height: '100%'}}/>
                            </View>
                            <Text style={{color: mode.cardColor, fontSize: wWidth(3.5)}}>Add to favourites</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
        </>
    );
}

export default MovieInfo;

const styles = StyleSheet.create({
    
    info: {
        textAlign: "center",
        margin: 0,
        fontSize: wWidth(4.2),
        marginBottom: wHeight(0.5),
    },
    image: {
        width: "100%", 
        height: "72%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "stretch"
    },
    infoContainer: {
        position: "absolute",
        borderRadius: 10,
        width: wWidth(87.5),
        height: wHeight(87.5),
        maxHeight: 800,
        border: 3,
        bordeRadius: 20,
        boxShadow: 24,
    },
    centerOfCard: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: wHeight(1),
        marginHorizontal: wWidth(1.4)
    },
    infoCard: {
        flex: 1,
        justifyContent: "center",
        width: wWidth(90),
        alignItems: "center",
        flexDirection: "row",
    }
})
