import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState, PureComponent } from "react";
import { Text, Image, View} from 'react-native';
import { useRecoilState } from "recoil";
import Favorites from "../screens/Favorites";
import Login from "../screens/Login";
import Movies from "../screens/Movies";
import { brightnessMode } from "../states/brightnessMode";
import { IMovieType, RootStackParamList } from "../types/types";

// display movies on homepage
const Navigation = () => {
  const [mode, setMode] = useRecoilState(brightnessMode);
  const Tab = createBottomTabNavigator<RootStackParamList>();

    return (
        <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: mode.fontColor,
            tabBarStyle: {
              backgroundColor: mode.navbarColor,
              minHeight: 55,
              paddingBottom: 5,
            },
          }} 
          initialRouteName="Login"
        >
          <Tab.Screen 
            options={{
              unmountOnBlur: true, 
              tabBarIcon: () => {
                return (
                  <View>
                    <Image
                      source={require('../resources/play.png')}
                      resizeMode="contain"
                      style={{ width: 25 }}
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
                      style={{ width: 23 }}
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
                      style={{ width: 20 }}
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
    );
}


export default Navigation;