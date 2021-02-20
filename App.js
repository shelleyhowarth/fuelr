// App.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacityComponent, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import RootStackScreen from './screens/RootStackScreen';
import { NavigationContainer } from '@react-navigation/native';


import AccountTab from './screens/tabs/AccountTab';
import MapTab from './screens/tabs/MapTab';
import LeaderboardTab from './screens/tabs/LeaderboardTab';
import TrendsTab from './screens/tabs/TrendsTab';
import { Colors } from './styles/Colors';

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <RootStackScreen></RootStackScreen> 
      </NavigationContainer>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});