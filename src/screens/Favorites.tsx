import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Modal, Pressable, ScrollView, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { getMovie, getUser } from '../api/movieAPI';
import { IMovieType } from '../types/types';
import Movie from '../components/Movie';
import MovieInfo from '../components/MovieInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import AccountInfo from '../components/AccountInfo';
//import ColorModeButton from '../components/ColorModeButton';

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/types';
import AccountInfo from '../components/AccountInfo';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import ColorModeButton from '../components/ColorModeButton';
import { brightnessMode } from '../states/brightnessMode';
import Header from '../components/Header';
import { wHeight, wWidth } from '../utils/Utils';
import { TextInput } from 'react-native-paper';
import { movieStyles } from '../themes/movieStyles';

type FavoritesProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const Favorites = ({navigation}: FavoritesProps) => {

    //Initial movie of type IMovieType
    const initialMovieState:IMovieType = {
        genre: new Array(''),
        id: "0",
        imdblink: "",
        imdbscore: "",
        posterlink: "",
        title: "",
        year: ""
    }
    
    const [favouriteMovies, setFavouriteMovies] = useState<IMovieType[]>([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [noData, setNoData] = useState(true);
    const [open, setOpen] = useState(false);
    const [modalMovie, setModalMovie] = useState(initialMovieState);
    const [refresh, setRefresh] = useRecoilState(refreshed);
    const [mode, setMode] = useRecoilState(brightnessMode);
    const [email, setEmail] = useState("");
    
    // handles opening and closing the dialog pop up
    const handleOpen = (movie:IMovieType) => {setModalMovie(movie); setOpen(true)};
    const handleClose = () => {setOpen(false); fetchFavouriteMovies();};

    //Cheks if user is signed in. Navigates to login page if not. 
    //get users favorite movies after first render
    useEffect(()=> {
        isActive();
        fetchFavouriteMovies();
    }, []);

    const isActive = async () => {
        const active = await AsyncStorage.getItem("active");
        if(active === "false") {
            navigation.navigate("Login");
        }
        else {
            setRefresh({hasRefreshed: false, refresh: false});
        }
    };

    //Fetches favourite list consisting of ids for movies. 
    const fetchFavourites = async () => {
        const previousEmail = await AsyncStorage.getItem("email");
        if(previousEmail !== undefined) {
            setEmail(previousEmail || "");
        }

        return await getUser(previousEmail || "")
            .then((value) => {
                if (value[0].favourites.length > 0) {
                    setNoData(false);
                }
                else {
                    setNoData(true);
                }
            return value[0].favourites})
    }

    //Fetches favourite movies using the ids fetched in fetchFavourites().
    const fetchFavouriteMovies = async () => {
        setFetchingData(true);
        const favouriteIds:string[] = await fetchFavourites();

        let movies: IMovieType[] = [];
        for(let i=0; i<favouriteIds.length; i++) {
            await getMovie(favouriteIds[i])
                .then((value: IMovieType) => {
                    movies[i] = value;          
                });
        }
        setFavouriteMovies(movies);
        setFetchingData(false);
    }



    return (
        <>
        <SafeAreaView style={{display: "flex", flex: 1, backgroundColor: mode.backgroundColor}}>
            <View  style={{backgroundColor: mode.backgroundColor}}>
                <Header></Header>
            </View>

        {(!fetchingData) ?
        <View style={{flex: 1}}>
            <FlatList
                contentContainerStyle={movieStyles.movieContainer}
                numColumns={3}
                data={favouriteMovies}
                keyExtractor={(movie: IMovieType) => movie.id}
                renderItem={({item}) => (            
                    <Pressable 
                        style={
                            movieStyles.cardContainer
                        }
                        key={item.id} 
                        onTouchEndCapture={() => handleOpen(item)}
                    >
                        <Movie {...item} />
                    </Pressable>
                )}
            />
        </View> 
        :
        (noData) ? 
            <></>
            : 
            <View style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE",
                }}>
                <ActivityIndicator animating size="large"/>
            </View>
        }

        {noData && !fetchingData ? <Text style={{flex:1, alignSelf: "center", color: mode.fontColor}}>You have no favourite movies!</Text> : <></>}

        <View>
            <Modal
                    animationType="slide"
                    visible={open}
                    onRequestClose={handleClose}
                    transparent={false} // set to true when styling is done
                >
                    <View>
                        <MovieInfo {...modalMovie}/>  
                        <TouchableOpacity onPress={handleClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>      
                    </View> 
                </Modal>
            </View>
        </SafeAreaView>
        </>
    );
};
export default Favorites;