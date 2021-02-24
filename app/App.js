// App.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacityComponent, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import AuthStackScreen from './screens/AuthStack/AuthStackScreen';
import AppStackScreen from './screens/AppStack/AppStackScreen';


function App() {

  firebaseConfig = {
    apiKey: "AIzaSyCF3fMACz3A1SYhaSg2yehXGFchNGPvjvc",
    authDomain: "fuelr-22721.firebaseapp.com",
    databaseURL: "https://fuelr-22721.firebaseio.com",
    projectId: "fuelr-22721",
    storageBucket: "fuelr-22721.appspot.com",
    messagingSenderId: "458991083503",
    appId: "1:458991083503:web:d5bfe178f415b6d95fa01a",
    measurementId: "G-NN5W4SSTBC"
  }

  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(firebaseConfig);
  }
  
  return (
    <NavigationContainer>
      <AuthStackScreen/> 
    </NavigationContainer>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;