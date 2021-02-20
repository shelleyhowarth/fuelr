import React, { useState, useEffect, Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { log } from 'react-native-reanimated';
import { Marker } from 'react-native-maps';


export default class MapTab extends Component {

  constructor(props){
    super(props);
    state = this.getLocation();
  }

  async componentDidMount(){
    this.setState(this.getLocation());
  }

  async getLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    } 

    let location = await Location.getCurrentPositionAsync({});
    return location;
  }


  render() {
      return (
        <MapView   
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
        >
        </MapView>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});