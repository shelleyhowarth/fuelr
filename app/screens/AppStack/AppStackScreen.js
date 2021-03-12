import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './MapScreen';
import AccountScreen from './AccountScreen';
import { Colors } from '../../../styles/Colors';

const Tab = createBottomTabNavigator();


const AppStackScreen = () => {

    return (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={MapScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      );

}

export default AppStackScreen;
