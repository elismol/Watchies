import React, { useEffect, useState } from 'react';
import { Button, Modal, ScrollView, Text , TextInput, TouchableOpacity, View } from 'react-native';
import { getMovie, getUser } from '../api/movieAPI';
import { IMovieType } from '../types/types';
import Movie from '../components/movie';
import MovieInfo from '../components/movieInfo';
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
            setRefresh({hasRefreshed: false});
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
        <SafeAreaView>
        <AccountInfo email={email}></AccountInfo>
        <ColorModeButton></ColorModeButton>
        <Text>My favorite movies</Text>
        {!fetchingData ?
        (
        <ScrollView>
            {favouriteMovies.map((movie:IMovieType) => 
            <TouchableOpacity style={{height: 80}} key={movie.id} onPress={() => handleOpen(movie)}>
                <Movie {...movie} />
            </TouchableOpacity>
            )}        
        </ScrollView>

        ) : <Text>loading favourite movies...</Text>}

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
            {noData && !fetchingData ? <Text>You have no favourite movies!</Text> : <></>}

        </SafeAreaView>
    );
};
export default Favorites;


