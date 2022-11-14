import React from "react";
import { View, Image } from "react-native";
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";
import { wHeight } from "../utils/Utils";
import AccountInfo from "./AccountInfo";
import ColorModeButton from "./ColorModeButton";

const Header = () => {
    const [mode, setMode] = useRecoilState(brightnessMode);

    return(
        <>
            <View style={{
                height: wHeight(5), 
                display: "flex", 
                backgroundColor: mode.navbarBackgroundColor
            }}>   
                <Image source={require("../resources/watchiesLogo.png")} resizeMode="contain" style={{display: "flex", alignSelf: "center", height: "100%"}}/>
            </View>
            <View style={{
                display: "flex", 
                justifyContent: 'space-between', 
                alignItems: "flex-end", 
                flexDirection: 'row', 
                height: wHeight(5), 
                backgroundColor: mode.navbarBackgroundColor
            }}>        
                <ColorModeButton></ColorModeButton>
                <AccountInfo></AccountInfo>
            </View>  
        </>
    );
}

export default Header;