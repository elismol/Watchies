import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, StatusBar, Text , Image, TouchableOpacity, View, Modal, FlatList, ActivityIndicator, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IfetchType, IMovieType } from '../types/types';
import useFetch from '../hooks/useFetch';
import Movie from '../components/Movie';
import MovieInfo from '../components/MovieInfo';
import FilterSort from '../components/FilterSort';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/types';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountInfo from '../components/AccountInfo';
import ColorModeButton from '../components/ColorModeButton';
import { brightnessMode } from '../states/brightnessMode';
import Header from '../components/Header';
import { wHeight, wWidth } from '../utils/Utils';
import { TextInput } from 'react-native-paper';
import { movieStyles } from '../themes/movieStyles';

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
    const [coordinateY, setCoordinateY] = useState(0);
    const [showSearchBar, setShowSearchBar] = useState<("flex" | "none" | undefined)>("flex");
    const [searchBarChanged, setSearchBarChanged] = useState(true);

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
    

    //Cheks if user is signed in. Navigates to login page if not. 
    useEffect(() => {
            isActive();
            getEmail();
    },[]);

    const isActive = async () => {
        const active = await AsyncStorage.getItem("active");
        if(!active) {
            navigation.navigate("Login");
        }
        else {
            setRefresh({hasRefreshed: false, refresh: false});
        }
    };

    //get email for account
    const getEmail = async () => {
        const previousEmail = await AsyncStorage.getItem("email");
        if(previousEmail !== undefined) {
            setEmail(previousEmail || "");
        }
    };

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

    // loading icon or text when fetching movies
    const renderFooter = () => {
        if (!loading) {
            return (<Text style={{flex:1, alignSelf: "center", color: mode.fontColor}}>No more movies found.</Text>);
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

    // fetch more movies
    const newPage = () => {
        if(loading) {
            setPage((prev: number) => ((prev/limit)+1)*limit);
        }
    }

    //show searchbar when scrolling down and hide when scrolling up
    function showSearch (event: NativeSyntheticEvent<NativeScrollEvent>) {
        const flooredY = Math.floor(event.nativeEvent.contentOffset.y);
        if (flooredY <= wHeight(15.5)) {
            setShowSearchBar("flex");
        }
        else if(!searchBarChanged && flooredY > coordinateY && (flooredY-coordinateY) > 5 && flooredY > wHeight(15.5) && showSearchBar !== "none") {
            console.log("down");
            console.log("flooredY: "+flooredY);
            console.log("coordinateY: "+coordinateY);
            console.log("diff: " + (flooredY-coordinateY));
            setSearchBarChanged(true);
            setShowSearchBar("none");
        }
        else if(!searchBarChanged && flooredY < coordinateY && flooredY > wHeight(15.5) && showSearchBar !== "flex") {
            console.log("up");
            console.log("flooredY: "+flooredY);
            console.log("coordinateY: "+coordinateY);
            console.log("diff: " + (flooredY-coordinateY));
            setSearchBarChanged(true);
            setShowSearchBar("flex");
        }

        if(flooredY !== coordinateY) {
            if(searchBarChanged && Math.abs((flooredY-coordinateY)) > wHeight(1)) {
                setSearchBarChanged(false);
            }
            else {
                setCoordinateY(flooredY);
            }
        }
    }

    return (
        <>
        <SafeAreaView style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: mode.backgroundColor}}>
            <Header></Header>
            
            <View style={{height: wHeight(15.5), display: "flex", position: "absolute", marginTop: wHeight(10)}}>                   
                <View style={{display: "flex", flex: 1}}>
                    <View  style={{height: wHeight(7.5), minWidth: wWidth(100), display: showSearchBar}}>
                        <TextInput
                            style={{
                                flex: 1, 
                                zIndex: 11, 
                                backgroundColor: mode.navbarColor, 
                                borderColor: "rgba(0,0,0,0)",
                                borderTopLeftRadius: 0, 
                                borderTopRightRadius: 0, 
                                borderBottomLeftRadius: 0, 
                                borderBottomRightRadius: 0,
                                borderWidth: wHeight(1),
                            }}
                            textColor={mode.inputColor}
                            placeholderTextColor={"gray"}
                            placeholder="Search for a movie"
                            mode="flat"
                            activeUnderlineColor="purple"
                            underlineColor="gray"
                            value={searchWord} 
                            onChangeText={(text) => onSearchChange(text)}
                        />
                    </View>
                    <View  style={{height: wHeight(8), minWidth: wWidth(100), display: showSearchBar}}>
                        <FilterSort onChangeSort={onOrderByClick} onChangeFilter={onGenreClick} />
                    </View>
                </View>
            </View>

            <View style={{flex: 1}}>
                <FlatList
                    contentContainerStyle={movieStyles.movieContainer}
                    numColumns={3}
                    data={list}
                    keyExtractor={(movie: IMovieType) => movie.id}
                    onEndReached={newPage}
                    onEndReachedThreshold={0.001}
                    initialNumToRender={limit}
                    ListHeaderComponent={<View style={{height: wHeight(17)}}></View>}
                    ListFooterComponent={renderFooter}
                    onScroll={(event) => showSearch(event)}
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
        </SafeAreaView>

        <SafeAreaView>
            <View>
                <Modal
                    animationType="slide"
                    visible={open}
                    onRequestClose={handleClose}
                    transparent={true}
                >
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
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