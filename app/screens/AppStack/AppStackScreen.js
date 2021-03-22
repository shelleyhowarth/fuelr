import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';
import AccountScreen from './AccountScreen';
import ForecourtScreen from './ForecourtScreen';
import TrendsScreen from './TrendsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={ MapScreen } 
      />
      <Tab.Screen name="Leaderboard" component={ LeaderboardScreen } />
      <Tab.Screen name="Trends" component={ TrendsScreen } />
      <Tab.Screen name="Account" component={ AccountScreen } />
    </Tab.Navigator>
  );
}

const AppStackScreen = ({navigator}) => {
  return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ForecourtScreen" component={ ForecourtScreen } />
      </Stack.Navigator>
  );

}

export default AppStackScreen;
