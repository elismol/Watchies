import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Modal, Pressable, ScrollView, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { getMovie, getUser } from '../api/movieAPI';
import { IMovieType } from '../types/types';
import Movie from '../components/Movie';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import AccountInfo from '../components/AccountInfo';
//import ColorModeButton from '../components/ColorModeButton';

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/types';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import { brightnessMode } from '../states/brightnessMode';
import Header from '../components/Header';
import { wHeight } from '../utils/Utils';
import { movieStyles } from '../themes/movieStyles';
import { favouriteMoviesList } from '../states/favouriteMoviesList';

type FavoritesProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const Favorites = ({navigation}: FavoritesProps) => {
    
    const [refresh, setRefresh] = useRecoilState(refreshed);
    const [mode, setMode] = useRecoilState(brightnessMode);
    const [favouriteMovies, setFavouriteMovies] = useRecoilState(favouriteMoviesList);

    //Cheks if user is signed in. Navigates to login page if not. 
    //get users favorite movies after first render
    useEffect(()=> {
        isActive();
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

    // loading icon or text when fetching movies
    const renderFooter = () => {
        return (
            (favouriteMovies.movies.length === 0) ?
                <Text style={{flex:1, alignSelf: "center", paddingTop: wHeight(40), color: mode.inputColor}}>No favourite movies found</Text>
                    :
                <></>
        )
    }    

    return (
        <>
        <SafeAreaView style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: mode.backgroundColor}}>
            <Header></Header>

            <View style={{flex: 1}}>
                <FlatList
                contentContainerStyle={movieStyles.movieContainer}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={<View style={{height: wHeight(2)}}></View>}
                numColumns={3}
                data={favouriteMovies.movies}
                keyExtractor={(movie: IMovieType) => movie.id}
                renderItem={({item}) => (            
                        <Movie {...item} />
                )}
            />
            </View>  
        </SafeAreaView>
        </>
        );
    };
export default Favorites;