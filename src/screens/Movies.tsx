import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IfetchType, IMovieType } from '../types/types';
import useFetch from '../hooks/useFetch';
import Movie from '../components/Movie';
import SearchFilterSort from '../components/SearchFilterSort';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/types';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { brightnessMode } from '../states/brightnessMode';
import Header from '../components/Header';
import { wHeight, wWidth } from '../utils/Utils';
import { movieStyles } from '../themes/movieStyles';
import ModalMovieInfo from '../components/ModalMovieInfo';
import { getMovie, getUser } from '../api/movieAPI';
import { favouriteMoviesList } from '../states/favouriteMoviesList';

type MoviesProps = NativeStackScreenProps<RootStackParamList, 'Movies'>;

const Movies = ({navigation}: MoviesProps) => {


    const [limit, setLimit] = useState(30); //offset for fetching the next movies in the infinite scroll
    const [genreWord, setGenreWord] = useState("");
    const [searchWord, setSearchWord] = useState("");
    const [orderBy, setOrderBy] = useState("-1");
    const [refresh, setRefresh] = useRecoilState(refreshed);
    const [mode, setMode] = useRecoilState(brightnessMode);
    const [coordinateY, setCoordinateY] = useState(0);
    const [showSearchBar, setShowSearchBar] = useState<("flex" | "none" | undefined)>("flex");
    const [searchBarChanged, setSearchBarChanged] = useState(true);
    const [favouriteMovies, setFavouriteMovies] = useRecoilState(favouriteMoviesList);

    // initial IfetchType object
    const querySearch: IfetchType = {
        limit: limit,
        filterWord: genreWord,
        searchWord: searchWord,
        orderBy: orderBy
    }

    const [query, setQuery] = useState<IfetchType>(querySearch); //holds the current query for useFetch
    const [page, setPage] = useState(0); //keep track of which page
    const { loading, list } = useFetch(query, page); //hook to get movies and add into list
    const flatListRef = useRef<FlatList>(null); //ref for scrolling to top



    //Cheks if user is signed in. Navigates to login page if not. 
    useEffect(() => {
            isActive();
            fetchFavouriteMovies();
    },[]);

    const isActive = async () => {
        const active = await AsyncStorage.getItem("active");
        if(!active) {
            navigation.navigate("Login");
        }
        else {
            setRefresh({hasRefreshed: false, refresh: false});
        }
    }

    //Fetches favourite list and set email for accountCom
    const fetchFavourites = async () => {
        const email = await AsyncStorage.getItem("email");

        return await getUser(email || "")
            .then((value) => {
                return value[0].favourites
            })
    }

    //Fetches favourite movies using the ids fetched in fetchFavourites().
    const fetchFavouriteMovies = async () => {
        const favouriteIds:string[] = await fetchFavourites();

        let movies: IMovieType[] = [];
        for(let i=0; i<favouriteIds.length; i++) {
            await getMovie(favouriteIds[i])
                .then((value: IMovieType) => {
                    movies[i] = value;          
                });
        }
        setFavouriteMovies({movies: movies});
        
        return movies;
    }

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
        flatListRef.current?.scrollToOffset({animated: false, offset: 0});
        setSearchWord(value);
        setPage(0);
        fetchMovies(limit, genreWord, value, orderBy);
    }

    //Handles input from genre and fetches movies according to the input. 
    const onChangeFilter = (character:string) => {
        if (character == "All"){ character = "";}
        flatListRef.current?.scrollToOffset({animated: false, offset: coordinateY});
        flatListRef.current?.scrollToOffset({animated: false, offset: 0});
        setGenreWord(character);
        setPage(0);
        fetchMovies(limit, character, searchWord, orderBy);
    }

    //Handles input from order and fetches movies according to the input. 
    const onChangeSort = (character:string) => {
        flatListRef.current?.scrollToOffset({animated: false, offset: 0});
        setOrderBy(character);
        setPage(0);
        fetchMovies(limit, genreWord, searchWord, character);
    }

    // loading icon or text when fetching movies
    const renderFooter = () => {
        if (!loading && list.length !==0) {
            return (
                <Text style={{
                    flex:1, 
                    marginBottom: wHeight(2), 
                    alignSelf: "center", 
                    color: mode.inputColor
                }}
                >
                    No more movies found
                </Text>);
        }
        else if (!loading && list.length === 0) {
            return(
                <View style={{                    
                    zIndex: 10,
                    flex:1, 
                    justifyContent: "center",
                    alignItems: "center", 
                }}>
                    <Text style={{
                        color: mode.inputColor, 
                        textAlign: "center", 
                    }}
                    >
                        No movies matched your search
                    </Text>
                </View>
            );
        }
        else {
            return (
                <View style={{
                    flex: 1,
                    paddingVertical: wHeight(2),
                }}>
                    <ActivityIndicator animating size="large"/>
                </View>
            );
        }
    }    

    // fetch more movies
    const newPage = () => {
        if(loading && coordinateY > wHeight(50)) {
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
            setSearchBarChanged(true);
            setShowSearchBar("none");
        }
        else if(!searchBarChanged && flooredY < coordinateY && flooredY > wHeight(15.5) && showSearchBar !== "flex") {
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

            <View style={{height: wHeight(15), display: "flex", position: "absolute", marginTop: wHeight(10)}}>                   
                    <View style={{flex: 1, display: showSearchBar, width: wWidth(100), margin: 0, padding: 0}}>
                        <SearchFilterSort 
                            onChangeSort={onChangeSort} 
                            onChangeFilter={onChangeFilter} 
                            onSearchChange={onSearchChange} 
                            searchValue={searchWord}/>
                    </View>
            </View>
                        
            <View style={{flex: 1}}>
                <FlatList
                    style={{zIndex: -1}}
                    ref={flatListRef}
                    contentContainerStyle={movieStyles.movieContainer}
                    numColumns={3}
                    data={list}
                    keyExtractor={(movie: IMovieType) => movie.id}
                    onEndReached={newPage}
                    onEndReachedThreshold={0.001}
                    initialNumToRender={200}
                    maxToRenderPerBatch={200} //stores a render of 200 at a time
                    ListFooterComponent={renderFooter}
                    ListHeaderComponent={<Text style={{height: wHeight(15.5), color: mode.navbarBackgroundColor}}>You are not supposed to see this</Text>}
                    onScroll={(event) => showSearch(event)}
                    renderItem={({item}) => (     
                            <Movie {...item} />
                    )}
                />
            </View>  
        </SafeAreaView>
        <ModalMovieInfo/> 
        {/* this modal pop ups on both Moves and Favorites, 
        I dont know why lol, if i try to add it to favorites 
        and remove it from Movies, it only pops up in favorites.
        If I add to both, then it will open 2 modals in favorite,
        however you will have to close one of them to navigate
        to favorites to check, so there will only be one left.

        Basically, the ModalMovieInfo that is placed in Favorites 
        will open up ONE common render over both Movies and Favorites 
        at the same time.*/}
        </>
        );
    };

export default Movies;