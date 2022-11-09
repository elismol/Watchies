import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";

//switch to handle light or dark mode with recoil state.
const ColorModeButton = () => {
  const [mode, setMode] = useRecoilState(brightnessMode);

  const handleClick = () => {
    (mode.backgroundColor === "black") ? 
      setMode({
        backgroundColor: "white", 
        fontColor: "black", 
        navbarColor: "#f0f0f0", 
        enabled: false, 
        pressOpacity: 0.45, 
        cardColor: "#c8c2ff", 
        buttonColor: "#7566ff", 
        inputColor: "#f7f2fa"
      }) 
        : 
      setMode({
        backgroundColor: "black", 
        fontColor: "white", 
        navbarColor: "#151515", 
        enabled: true, 
        pressOpacity: 0.85, 
        cardColor: "#1d1433", 
        buttonColor: "#7f4aff", 
        inputColor: "#dcd7e0"
      });
  }
    
  return(
    <SafeAreaView>
      <View style={{display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "flex-end", marginLeft: 10, margin: 0, padding: 0}}>
        <Text style={{color: mode.buttonColor, fontSize: 10, margin: 0, padding: 0}}>Dark Mode:</Text>
        <Switch
          style={{margin: 0, padding: 0}}
          trackColor={{ false: "#81b0ff", true: "#767577" }}
          thumbColor={mode.enabled ? "#f4f3f4" : "#f5dd4b"}
          onValueChange={handleClick}
          value={mode.enabled}
        />
      </View>
    </SafeAreaView>
  );

}

export default ColorModeButton;