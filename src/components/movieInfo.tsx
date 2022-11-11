import React, { useEffect, useState } from "react";
import { IMovieType } from "../types/types";
import { Button, StatusBar, Text, Image, TextInput, TouchableOpacity, View, Modal, Linking, StyleSheet } from 'react-native';
import { addLike, getUser, removeLike } from "../api/movieAPI";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { wHeight, wWidth } from "../utils/Utils";

// pop up with more information about a movie
const movieInfo = (props: IMovieType) => {
    const [poster, setPoster] = useState(require("../resources/loadingImage.png"));
    const [email, setEmail] = useState( async () => {
        const saved = await AsyncStorage.getItem("email");
        return saved || "";
      })
    const [favourites, setFavourites] = useState<string[]>([]);

    useEffect(()=> {
        setPoster({uri : props.posterlink});
        fetchFavourites();
    }, []);

    const imageError = () => {
        setPoster((require("../resources/errorImage.png")));
    }

    //get favourite movies from user to later determine which movieInfo component should have a active favorite start icon
    const fetchFavourites = async () => {
        await getUser(await email)
            .then((value) => {
                setFavourites(value[0].favourites);
            })
    }

    // sends a query to either add or remove a favorite movie to the users favorite movie list
    const handleFavouriteButton = async () => {
        if (favourites.includes(props.id)) {
            await removeLike(await email, props.id);
        } else {
            await addLike(await email, props.id);
        }
        await fetchFavourites();
    }
    
        
    return(
        <>
        <View style={styles.infoContainer}>
            {(poster === require("../resources/loadingImage.png")) ?
                <Image source={require("../resources/loadingImage.png")}  style={styles.image}/> 
                : 
                <Image source={poster} onError={imageError} style={styles.image}/>
            }
            <Text style={styles.info}>{ props.title }</Text>
            <Text style={styles.info}>Release year: { props.year }</Text>
            <Text style={styles.info}>Genres: { props.genre.join(", ") }</Text>
            <Text style={styles.info}>IMDB score: {props.imdbscore} </Text>
            {
            favourites.includes(props.id) ? 
            <TouchableOpacity onPress={handleFavouriteButton}>
                <View style={styles.star}>
                    <Text>Remove from favourites</Text>
                    <View style={{width: 30, height: 30}}><Image source={require("../resources/starOneTone.png")} style={{width: '100%', height: '100%'}}/></View>
                </View>
            </TouchableOpacity> 
            : 
            <TouchableOpacity onPress={handleFavouriteButton}>
                <View style={styles.star}>
                    <Text>Add to favourites</Text>
                    <View style={{width: 30, height: 30}}><Image source={require("../resources/starTwoTone.png")} style={{width: '100%', height: '100%'}}/></View>
                </View>
            </TouchableOpacity>
            }
            <TouchableOpacity onPress={async () => {await Linking.openURL(props.imdblink)}}><Text>IMDB</Text></TouchableOpacity>
        </View>
        </>
    );
}

export default movieInfo;

const styles = StyleSheet.create({
    info: {
        textAlign: "center",
        margin: 0,
        fontSize: wWidth(4.5),
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
        color: "#b1b0b0",
        position: "absolute",
        paddingBottom: wHeight(3),
        borderRadius: 10,
        width: wWidth(80),
        height: wWidth(165),
        maxHeight: 800,
        backgroundColor: "lightskyblue", 
        border: 3,
        bordeRadius: 20,
        boxShadow: 24,
    },
    star: {
        
    }
})