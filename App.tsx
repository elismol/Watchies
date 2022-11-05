import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import style from './App.css';

export default function App() {
  return (
    <View style={style.container}>
      <Text style={style.text}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
