// App.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacityComponent, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackScreen from './screens/AuthStack/AuthStackScreen';
import AppStackScreen from './screens/AppStack/AppStackScreen';
import Firebase from './firebase/Firebase';


function App() {

  return (
    <NavigationContainer>
      { Firebase.auth().currentUser ? <AppStackScreen/> : <AuthStackScreen/> }
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