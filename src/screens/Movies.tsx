import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StatusBar, Text , TextInput, TouchableOpacity, View,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IfetchType, IMovieType } from '../types/types';
import useFetch from '../hooks/useFetch';
import Movie from '../components/movie';
import MovieInfo from '../components/movieInfo';
import FilterSort from '../components/filterSort';

const Movies = (navigation: any) => {
    
    //Cheks if user is signed in. Navigates to login page if not. 
    useEffect(() => {
        isActive();
    },[]);

    const isActive = async () => {
        const active = await AsyncStorage.getItem("active");
        if(active === "false") {
            navigation.navigate("Login");
        };
    };

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

    const [limit, setLimit] = useState(30); //offset for fetching the next movies in the infinite scroll
    const [genreWord, setGenreWord] = useState("");
    const [searchWord, setSearchWord] = useState("");
    const [orderBy, setOrderBy] = useState("-1");
    const [open, setOpen] = useState(false);
    const handleOpen = (movie:IMovieType) => {setModalMovie(movie); setOpen(true)};
    const handleClose = () => setOpen(false);
    const email = AsyncStorage.getItem("email") || "";

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

    //Handles infinite scrolling by using a custom callback hook
    /*const handleObserver = useCallback((entries: any[]) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => ((prev/limit)+1)*limit);
        }
      }, []);*/

    return (
        <>
        <Text></Text>
        <Text></Text>

        <View>
        <View>
            <Text>Movie search</Text>

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

        <View>
            {list.map((movie:IMovieType) => 
            <TouchableOpacity key={movie.id} onPress={() => handleOpen(movie)}>
                <Movie {...movie} />
            </TouchableOpacity>
            )}        
        </View>

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
        
        </View>
        </>
        )};

export default Movies;