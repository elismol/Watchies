import React from 'react';
import { Image, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import { RecoilRoot } from 'recoil';
import Movies from './src/screens/Movies';
import Favorites from './src/screens/Favorites';
import { RootStackParamList } from './src/types/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<RootStackParamList>();

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

  return (
    <SafeAreaProvider>
    <RecoilRoot>
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Tab.Screen options={{
          unmountOnBlur: true, 
          tabBarIcon: () => {
            return (
              <View>
                <Image
                  source={require('./src/resources/play.png')}
                  resizeMode="contain"
                  style={{ width: 25 }}
                />
              </View>
            );
          }
        }} 
        name = "Movies" 
        component={Movies} />
        <Tab.Screen 
          options={{
            unmountOnBlur: true, 
            tabBarIcon: () => {
              return (
                <View>
                  <Image
                    source={require('./src/resources/star.png')}
                    resizeMode="contain"
                    style={{ width: 23 }}
                  />
                </View>
              );
            }
          }} 
          name = "Favorites" 
          component={Favorites} />
        <Tab.Screen 
          options={{
            tabBarStyle: { display: "none" }, 
            unmountOnBlur: true, 
            title: "Sign Out",
            tabBarIcon: () => {
              return (
                <View>
                  <Image
                    source={require('./src/resources/signOut.png')}
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
    </RecoilRoot>
    </SafeAreaProvider>
  );
}
