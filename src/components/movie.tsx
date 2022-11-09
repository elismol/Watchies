import React, { useEffect, useState, PureComponent } from "react";
import { Text, Image} from 'react-native';
import { IMovieType } from "../types/types";

// display movies on homepage
const Movie = (props: IMovieType) => {
    const [poster, setPoster] = useState(require("../resources/loadingImage.png"));

    useEffect(() => {
        //.png makes the image lower resolution. Without .png the website will be slow because of too high resolution
        setPoster({uri : props.posterlink + ".png"});
    }, []);

    //sets poster not found image if the posterlink is broken
    const imageError = () => {
        setPoster((require("../resources/errorImage.png")));
    }

    return (
        <>
            {(poster === require("../resources/loadingImage.png")) ?
                <Image source={require("../resources/loadingImage.png")} resizeMode="contain" style={{width: 100, height: 100}}/> 
                : 
                <Image source={poster} onError={imageError} resizeMode="contain" style={{width: 100, height: 100}}/>
            }
            <Text>{props.title}</Text>
            <Text>{props.year}</Text>
        </>
    );
}


export default React.memo(Movie);
