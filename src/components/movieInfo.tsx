import React, { useEffect, useState } from "react";
import { IMovieType } from "../types/types";
import { Button, StatusBar, Text, Image, TextInput, TouchableOpacity, View, Modal, Linking } from 'react-native';
import { addLike, getUser, removeLike } from "../api/movieAPI";
import AsyncStorage from '@react-native-async-storage/async-storage'

// pop up with more information about a movie
const movieInfo = (props: IMovieType) => {
    const [poster, setPoster] = useState(require("../resources/loadingImage.png"));
    const [email, setEmail] = useState( async () => {
        const saved = await AsyncStorage.getItem("email");
        return saved || "";
      })
    const [favourites, setFavourites] = useState<string[]>([]);

    useEffect(()=> {
        setPoster(props.posterlink); 
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
        <View>
            {(poster === require("../resources/loadingImage.png")) ?
                <Image source={require("../resources/loadingImage.png")} resizeMode="contain" style={{width: 10, height: 10}}/> : <Image source={poster} onError={imageError} style={{width: '5%', height: '5%'}}/>
            }
            <Text>{ props.title }</Text>
            <Text>Release year: { props.year }</Text>
            <Text>Genres: { props.genre.join(", ") }</Text>
            <Text>IMDB score: {props.imdbscore} </Text>
            {
            favourites.includes(props.id) ? 
            <TouchableOpacity onPress={handleFavouriteButton}>
                <View>
                    <Text>Remove from favourites</Text>
                    <View style={{width: 30, height: 30}}><Image source={require("../resources/starOneTone.png")} style={{width: '100%', height: '100%'}}/></View>
                </View>
            </TouchableOpacity> 
            : 
            <TouchableOpacity onPress={handleFavouriteButton}>
                <View>
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