import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View} from 'react-native';
import { Text } from 'react-native-paper';
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";
import {  modalMovie } from "../states/modalMovie";
import { movieStyles } from "../themes/movieStyles";
import { IMovieType } from "../types/types";
import { wWidth } from "../utils/Utils";


// display movies on homepage
const Movie = (props: IMovieType) => {
    
    const [poster, setPoster] = useState({uri : props.posterlink + ".png"});
    const [mode, setMode] = useRecoilState(brightnessMode);
    const [modal, setModal] = useRecoilState(modalMovie);


    //sets poster not found image if the posterlink is broken
    const imageError = () => {
        setPoster((require("../resources/errorImage.png")));
    }

    const handleModal = () => {
        setModal({movie: props, openModal: true});
    }

    return (
        <Pressable 
            style={[
                movieStyles.cardContainer,
                {backgroundColor: mode.cardBackgroundColor}
            ]}
            key={props.id} 
            onTouchEndCapture={handleModal}
        >
            <Image source={poster} onError={imageError} resizeMode="contain" style={styles.image}/>
            <Text ellipsizeMode='tail' numberOfLines={3} style={[styles.text, {fontWeight: 'bold', color: mode.cardColor}]}>{props.title}</Text>
            <View style={{display: "flex", justifyContent: "flex-end", flex: 1}}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.text, {color: mode.cardColor}]}>{props.year}</Text>
            </View>
        </Pressable>
    );
}

export default React.memo(Movie);

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
