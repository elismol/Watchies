import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import { wHeight, wWidth } from "../utils/Utils";
import { useRecoilState } from "recoil";
import { SafeAreaView } from 'react-native-safe-area-context';
import { modalMovie } from '../states/modalMovie';
import MovieInfo from "./MovieInfo";
import { brightnessMode } from "../states/brightnessMode";



// pop up with more information about a movie
const ModalMovieInfo = () => {
    const [modal, setModal] = useRecoilState(modalMovie);
    const [mode, setMode] = useRecoilState(brightnessMode);

    
    useEffect(() => {
        if(modal.openModal) {
            setModal({movie: modal.movie, openModal: true});
        }
    },[modal.openModal])

    const handleClose = () => {
        setModal({movie: modal.movie, openModal: false});
    };
    
        
    return(
        <SafeAreaView>
            <View>
                <Modal
                    animationType="fade"
                    visible={modal.openModal}
                    onRequestClose={handleClose}
                    transparent={true}
                >
                    <View style={{
                        flex: 1, 
                        justifyContent: "center", 
                        alignItems: "center", 
                        flexDirection: "row", 
                        backgroundColor: "rgba(0,0,0,0.8)", 
                        }}
                    >
                        <MovieInfo/>  
                        <TouchableOpacity style={{position: "absolute", top: wHeight(6.25), left: 0, right: 0, bottom: wHeight(70),}} onPress={handleClose}>
                        </TouchableOpacity>
                        <TouchableOpacity style={{position: "absolute", top: wHeight(93.75), left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center"}} onPress={handleClose}>
                            <Text style={{color: mode.closeButtonColor, fontSize: wWidth(5)}}>Close</Text>
                        </TouchableOpacity>   
                        <TouchableOpacity style={{position: "absolute", top: 0, left: 0, right: 0, bottom: wHeight(93.75),}} onPress={handleClose}>
                        </TouchableOpacity>    
                        <TouchableOpacity style={{position: "absolute", top: 0, left: 0, right: wWidth(93.75), bottom: 0,}} onPress={handleClose}>
                        </TouchableOpacity>
                        <TouchableOpacity style={{position: "absolute", top: 0, left: wWidth(93.75), right: 0, bottom: 0,}} onPress={handleClose}>
                        </TouchableOpacity>  
                    </View> 
                </Modal>
            </View>

            <View/>
        </SafeAreaView>
    );
}

export default ModalMovieInfo;

const styles = StyleSheet.create({
    
    info: {
        textAlign: "center",
        margin: 0,
        fontSize: wWidth(4.5),
        marginBottom: wHeight(0.5),
    },
    image: {
        width: "100%", 
        height: "72%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "stretch"
    },
    star: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    }
})