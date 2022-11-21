import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";
import { lightMode, darkMode } from "../themes/themes";
import { wHeight } from "../utils/Utils";

//switch to handle light or dark mode with recoil state.
const ColorModeButton = () => {
  const [mode, setMode] = useRecoilState(brightnessMode);

  const handleClick = () => {
    if (mode.backgroundColor === darkMode.backgroundColor) {
      setMode(lightMode);
      AsyncStorage.setItem("mode", "lightMode");
    }
    else {
      setMode(darkMode);
      AsyncStorage.setItem("mode", "darkMode");
    }
  }
    
  return(
    <SafeAreaView>
      <View style={{
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "flex-end", 
        alignSelf: "flex-end", 
        marginLeft: 5, 
        margin: 0, 
        padding: 0
      }}>
        <Switch
            style={{margin: 0, padding: 0, height: wHeight(4.2)}}
            trackColor={{ true: "#8c8c8c" , false: "#81b0ff"}}
            thumbColor={mode.enabled ? "#ebebeb" : "#ffdb6e"}
            onValueChange={handleClick}
            value={mode.enabled}
          />
        <Text style={{color: mode.navbarColor, fontSize: wHeight(1.4), margin: 0, padding: 0}}>Dark Mode</Text>
      </View>
    </SafeAreaView>
  );

}

export default ColorModeButton;