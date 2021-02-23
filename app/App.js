// App.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacityComponent, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import AuthStackScreen from './screens/AuthStack/AuthStackScreen';
import { NavigationContainer } from '@react-navigation/native';
import AppStackScreen from './screens/AppStack/AppStackScreen';

function App() {
  
  return (
    <NavigationContainer>
      <AppStackScreen></AppStackScreen> 
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