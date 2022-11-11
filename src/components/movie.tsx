import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View} from 'react-native';
import { Text } from 'react-native-paper';
import { IMovieType } from "../types/types";
import { wWidth } from "../utils/Utils";

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
                <Image source={require("../resources/loadingImage.png")} resizeMode="contain" style={styles.image}/> 
                : 
                <Image source={poster} onError={imageError} resizeMode="contain" style={styles.image}/>
            }
                <Text ellipsizeMode='tail' numberOfLines={3} style={[styles.text, {fontWeight: 'bold'}]}>{props.title}</Text>
                <View style={{display: "flex", justifyContent: "flex-end", flex: 1}}>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>{props.year}</Text>
                </View>
        </>
    );
}


export default Movie;

const styles = StyleSheet.create({
    image: {
      width: "100%", 
      height: "72%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      resizeMode: "stretch"
    },
    text: {
        textAlign: "center", 
        fontSize: wWidth(3.2)
    }
});
