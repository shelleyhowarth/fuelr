import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';
import AccountScreen from './AccountScreen';
import ForecourtScreen from './ForecourtScreen';
import TrendsScreen from './TrendsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={ MapScreen } 
        options = {{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name='map-outline'
              size={25}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={ LeaderboardScreen } 
        options = {{
          tabBarIcon: ({color, size}) => (
            <Ionicons 
              name='trophy-outline'
              size={25}
            />
          )
        }}
      />
      {/*}
      <Tab.Screen 
        name="Trends" 
        component={ TrendsScreen } 
        options = {{
          tabBarIcon: ({color, size}) => (
            <Ionicons 
              name='trending-up'
              size={25}
            />
          )
        }}
      />
      */}
      
      <Tab.Screen 
        name="Account" 
        component={ AccountScreen } 
        options = {{
          tabBarIcon: ({color, size}) => (
            <FontAwesome 
              name='user-o'
              size={25}
            />
          )
        }}
      />
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
