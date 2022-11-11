import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState, PureComponent } from "react";
import { Text, Image, View, StatusBar} from 'react-native';
import { useRecoilState } from "recoil";
import Favorites from "../screens/Favorites";
import Login from "../screens/Login";
import Movies from "../screens/Movies";
import { brightnessMode } from "../states/brightnessMode";
import { refreshed } from "../states/refreshed";
import { IMovieType, RootStackParamList } from "../types/types";
import { wHeight, wWidth } from "../utils/Utils";

// display movies on homepage
const Navigation = () => {
  const [mode, setMode] = useRecoilState(brightnessMode);
  const [refresh, setRefresh] = useRecoilState(refreshed);
  const Tab = createBottomTabNavigator<RootStackParamList>();

    return (
        <>
          {(mode.statusbar === "light-content") ?
            <StatusBar barStyle={"light-content"} backgroundColor={mode.backgroundColor}/>
              :
            <StatusBar barStyle={"dark-content"} backgroundColor={mode.backgroundColor}/>
          }
          <NavigationContainer>
          <Tab.Navigator 
            screenOptions={{
              tabBarHideOnKeyboard: true,
              headerShown: false,
              tabBarActiveTintColor: mode.fontColor,
              tabBarStyle: {
                borderTopWidth: 0,
                backgroundColor: mode.navbarColor,
                minHeight: wHeight(6.6),
                paddingBottom: wHeight(0.8),
              },
            }} 
            initialRouteName="Login"
          >
            <Tab.Screen 
              options={{
                unmountOnBlur: refresh.hasRefreshed, 
                tabBarIcon: () => {
                  return (
                    <View>
                      <Image
                        source={require('../resources/play.png')}
                        resizeMode="contain"
                        style={{ width: wWidth(6.6) }}
                      />
                    </View>
                  );
                }
              }} 
              name = "Movies" 
              component={Movies} 
            />
            <Tab.Screen 
              options={{
                unmountOnBlur: true, 
                tabBarIcon: () => {
                  return (
                    <View>
                      <Image
                        source={require('../resources/star.png')}
                        resizeMode="contain"
                        style={{ width: wWidth(6.3) }}
                      />
                    </View>
                  );
                }
              }} 
              name = "Favorites" 
              component={Favorites} 
            />
            <Tab.Screen 
              options={{
                tabBarStyle: { display: "none" }, 
                unmountOnBlur: true, 
                title: "Sign Out",
                tabBarIcon: () => {
                  return (
                    <View>
                      <Image
                        source={require('../resources/signOut.png')}
                        resizeMode="contain"
                        style={{ width: wWidth(5.3) }}
                      />
                    </View>
                  );
                }
              }}
              name="Login"
              component={Login} 
            />
          </Tab.Navigator>
        </NavigationContainer>
      </>
    );
}


export default Navigation;