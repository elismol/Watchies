export interface IMovieType {
    id: string
    imdblink: string
    title: string
    year: string
    imdbscore: string
    genre: Array<string>
    posterlink: string
}

export interface IUserType {
    favourites: Array<string>
    password: string
    id: string
}

export interface IfetchType {
    limit: number
    filterWord: string
    searchWord: string
    orderBy: string
}

export type RootStackParamList = {
    Login: any;
    Movies: undefined;
    Favorites: undefined;
  };