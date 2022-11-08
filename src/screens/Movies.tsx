import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StatusBar, Text , TextInput, TouchableOpacity, View,Modal, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IfetchType, IMovieType } from '../types/types';
import useFetch from '../hooks/useFetch';
import Movie from '../components/movie';
import MovieInfo from '../components/movieInfo';
import FilterSort from '../components/filterSort';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/types';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountInfo from '../components/AccountInfo';
import ColorModeButton from '../components/ColorModeButton';
import { brightnessMode } from '../states/brightnessMode';

type MoviesProps = NativeStackScreenProps<RootStackParamList, 'Movies'>;

const Movies = ({navigation}: MoviesProps) => {


    const [limit, setLimit] = useState(30); //offset for fetching the next movies in the infinite scroll
    const [genreWord, setGenreWord] = useState("");
    const [searchWord, setSearchWord] = useState("");
    const [orderBy, setOrderBy] = useState("-1");
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useRecoilState(refreshed);
    const handleOpen = (movie:IMovieType) => {setModalMovie(movie); setOpen(true)};
    const handleClose = () => setOpen(false);
    const [email, setEmail] = useState("");
    const [mode, setMode] = useRecoilState(brightnessMode);


        // initial IMovieType object
        const initialMovieState:IMovieType = {
            genre: new Array(''),
            id: "0",
            imdblink: "",
            imdbscore: "",
            posterlink: "",
            title: "",
            year: ""
        }

    const [modalMovie, setModalMovie] = useState(initialMovieState);

    //Cheks if user is signed in. Navigates to login page if not. 
    useEffect(() => {
        isActive();
        getEmail();
    },[]);

    const isActive = async () => {
        const active = await AsyncStorage.getItem("active");
        if(active === "false") {
            navigation.navigate("Login");
        }
        else {
            setRefresh({hasRefreshed: false});
        }
    };

    //get email for account
    const getEmail = async () => {
        const previousEmail = await AsyncStorage.getItem("email");
        if(previousEmail !== undefined) {
            setEmail(previousEmail || "");
        }
    };

    // initial IfetchType object
    const querySearch: IfetchType = {
        limit: limit,
        filterWord: genreWord,
        searchWord: searchWord,
        orderBy: orderBy
    }

    const [query, setQuery] = useState<IfetchType>(querySearch);
    const [page, setPage] = useState(0);
    const { loading, list } = useFetch(query, page);

    //Fetches movies by query.
    const fetchMovies = (limit: number, filterWord: string, searchWord: string, orderBy: string) => {
        const newQuery:IfetchType = {
            limit: limit,
            filterWord: filterWord,
            searchWord: searchWord,
            orderBy: orderBy
        }
        setQuery(newQuery);
    }

    //Handles input from search bar and fetches movies according to the input. 
    const onSearchChange = (value: string) => {
        setSearchWord(value);
        setPage(0);
        fetchMovies(limit, genreWord, value, orderBy);
    }

    //Handles input from genre menu and fetches movies according to the input. 
    const onGenreClick = (character:string) => {
        if (character == "All"){ character = "";}
        setGenreWord(character);
        setPage(0);
        fetchMovies(limit, character, searchWord, orderBy);
    }

    //Handles input from order menu and fetches movies according to the input. 
    const onOrderByClick = (character:string) => {
        setOrderBy(character);
        setPage(0);
        fetchMovies(limit, genreWord, searchWord, character);
    }

    const renderFooter = () => {
        if (loading) {
            return (<Text>No more movies found.</Text>);
        }
        else {
            return (
                <View style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE",
                }}>
                    <ActivityIndicator animating size="large"/>
                </View>
            );
        }
    }    

    return (
        <>
        <SafeAreaView>
        <View>
            <Text style={{color: mode.fontColor}}>Movie search</Text>

            <View>
                <View >
                    <TextInput 
                        placeholder="Search for a movie" 
                        value={searchWord} 
                        onChangeText={(text) => onSearchChange(text)}
                    />
                </View>
                <View>
                    <FilterSort onChangeSort={onOrderByClick} onChangeFilter={onGenreClick} />
                </View>
            </View>
        </View>
        <AccountInfo email={email}></AccountInfo>
        <ColorModeButton></ColorModeButton>
        <SafeAreaView>
            <FlatList
                data={list}
                keyExtractor={(movie: IMovieType) => movie.id}
                onEndReached={() => setPage((prev: number) => ((prev/limit)+1)*limit)}
                onEndReachedThreshold={1}
                ListFooterComponent={renderFooter}
                renderItem={({item}) => (
                    <TouchableOpacity style={{height: 80}} key={item.id} onPress={() => handleOpen(item)}>
                        <Movie {...item} />
                    </TouchableOpacity>
                )}
            />  
        </SafeAreaView>

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

        <View/>
        </SafeAreaView>
        </>
        )};

export default Movies;