import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";

//switch to handle light or dark mode with recoil state.
const ColorModeButton = () => {
  const [mode, setMode] = useRecoilState(brightnessMode);

  const handleClick = () => {
    (mode.backgroundColor === "black") ? setMode({backgroundColor: "white", fontColor: "black", navbarColor: "#f0f0f0", enabled: false}) : setMode({backgroundColor: "black", fontColor: "white", navbarColor: "#151515", enabled: true});
  }
    
  return(
      <View>
        <Text>Dark Mode:</Text>
        <Switch
          trackColor={{ false: "#81b0ff", true: "#767577" }}
          thumbColor={mode.enabled ? "#f4f3f4" : "#f5dd4b"}
          onValueChange={handleClick}
          value={mode.enabled}
        />
      </View>
  );

}

export default ColorModeButton;