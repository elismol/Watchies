import { Dimensions } from "react-native";

// calculate horisontal pixels from percentage
export const wWidth = (percentage: number) => {
    return percentage*(Dimensions.get('window').width)/100;
}

// calculate vertival pixels from percentage
export const wHeight = (percentage: number) => {
    return percentage*(Dimensions.get('window').height)/100;
}