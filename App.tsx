import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import style from './App.css';
import { getUser } from './src/api/movieAPI';
import { IUserType } from './src/types/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './src/screens/Login';
import Login from './src/screens/Login';
//import Movies from './src/screens/movies';
//import userProfile from './src/screens/userProfile';
import { RecoilRoot } from 'recoil';
import Movies from './src/screens/Movies';

const Stack = createNativeStackNavigator();

export default function App() {
  /*
  const [a, setA] = useState("b");

  useEffect(() => {
    fetchName("alexle@stud.ntnu.no");
  },[]);

  const fetchName = async (c: string) => {
     const b = await getUser(c)
        .then((value) => {
        setA(value.password);
        return("success");
      })
  }

  return (
    <View style={style.container}>
      <Text style={style.text}>{a}</Text>
      <StatusBar style="auto" />
    </View>
  );*/

//<Stack.Screen name = "Movies" component={Movies} />
//<Stack.Screen name = "UserProfile" component={userProfile} />
  return (
    <>
    <RecoilRoot>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade', animationDuration: 0.1}} initialRouteName="Login">
        <Stack.Screen name = "Login" component={Login} />
        <Stack.Screen name = "Movies" component={Movies} />
      </Stack.Navigator>
    </NavigationContainer>
    </RecoilRoot>
    </>
  );
}
