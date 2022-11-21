import { StyleSheet } from "react-native";
import { wHeight, wWidth } from "../utils/Utils";

export const movieStyles = StyleSheet.create({
    cardContainer: {
        display: "flex",
        zIndex: -2,
        color: "white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: wWidth(30),
        height: wWidth(60),
        marginHorizontal: wWidth(1.66),
        marginBottom: wHeight(2),
        borderRadius: 10,
        paddingBottom: wHeight(1),
        overflow: "hidden",
    },
    movieContainer: {
        display: "flex", 
        width: wWidth(100),
        margin: 0,
        padding: 0, 
        zIndex: -10
    }
});