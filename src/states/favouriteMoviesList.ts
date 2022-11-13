import { atom } from "recoil";
import { IMovieType } from '../types/types';

// recoil state
export const favouriteMoviesList = atom({
  key: "favouriteMoviesList",
  default: {
    movies: new Array<IMovieType>(),
  },
});

