// App.js
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacityComponent, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackScreen from './screens/AuthStack/AuthStackScreen';
import AppStackScreen from './screens/AppStack/AppStackScreen';
import Firebase from './firebase/Firebase';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  Firebase.auth().onAuthStateChanged(user => {
    if(user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  })

  return (
    <NavigationContainer>
      { loggedIn ? <AppStackScreen/> : <AuthStackScreen/> }
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