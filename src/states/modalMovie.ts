import { atom } from "recoil";
import { IMovieType } from '../types/types';

// initial IMovieType object
export const initialMovieState:IMovieType = {
    genre: new Array(''),
    id: "0",
    imdblink: "",
    imdbscore: "",
    posterlink: "",
    title: "",
    year: ""
}

// recoil state
export const modalMovie = atom({
  key: "modalMovie",
  default: {
    movie: initialMovieState,
    openModal: false,
  },
});

