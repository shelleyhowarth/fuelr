import React, { useState, useEffect, useRef } from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Animated, Switch } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Colors } from '../../../styles/Colors';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from '../../components/StarRating';
import { Platform } from 'react-native';
import Firebase from '../../firebase/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { updateForecourts } from '../../firebase/FirebaseMethods';
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const db = Firebase.firestore();

const MapScreen = ({navigation}) => {

    const [spinner, setSpinner] = useState(true);
    const [region, setRegion] = useState(null);
    const [mapAnimation, setMapAnimation] = useState(new Animated.Value(0));
    const [forecourts, loading, error] = useCollectionDataOnce(db.collection('forecourts'));
    const [interpolations, setInterpolations] = useState();
    const [diesel, setDiesel] = useState(false);
    const isFocused = useIsFocused();

    const scrollRef = useRef(null);

    const toggleSwitch = () => setDiesel(previousState => !previousState);

    useEffect( () => {

        //Getting location permission and setting inital region to user's location
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let tempRegion = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.04,
            }

            setRegion(tempRegion);
            setSpinner(false);
          })();
        
    }, [forecourts, isFocused])

    const fuelPriceMarker = (marker) => {
        if(!diesel) {
            return (
                <View>
                    {marker.currPetrol.price ?
                        <Text> {marker.currPetrol.price} </Text>
                    :   <Text> -- </Text> }
                </View>
            )
        } else {
            return (
                <View>
                    {marker.currDiesel.price ?
                        <Text> {marker.currDiesel.price} </Text>
                    :   <Text> -- </Text> }
                </View>
            )
        }

    }

    const onMarkerPress = (e) => {
        const markerId = e._targetInst.return.key;
        let x = (markerId * CARD_WIDTH) + (markerId * 20);

        if(Platform.OS === 'ios') {
            x = x - SPACING_FOR_CARD_INSET;
        }

        scrollRef.current.scrollTo({x: x, y: 0, animated: true});
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Getting your location...'}
                textStyle={styles.spinnerTextStyle}
            />

            <MapView
                style={styles.map}
                showsUserLocation={spinner ? false : true}
                initialRegion={region ? region : null}
            >
                { !loading ? forecourts.map((marker, index) => {
                    return (
                        <Marker
                            key={index}
                            coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                            onPress={(e) => {
                                onMarkerPress(e)
                            }}
                        >
                            <TouchableOpacity
                                style={[styles.priceContainer]}
                            >
                                <Image 
                                    source={{uri: marker.logo}} 
                                    style={styles.logo}
                                />
                                {fuelPriceMarker(marker)}
                            </TouchableOpacity>
                        </Marker>
                    )
                }) : null}

            </MapView>   
            <Animated.ScrollView 
                ref = { scrollRef }
                horizontal
                scrollEventThrottle = {1}
                showsHorizontalScrollIndicator = {false}
                height = {50}
                style={styles.scrollView}
                snapToInterval = {CARD_WIDTH + 20}
                snapToAlignment = 'center'
                contentInset = {{
                    top: 0,
                    left: SPACING_FOR_CARD_INSET,
                    bottom: 0,
                    right: SPACING_FOR_CARD_INSET
                }}
                contentContainerStyle = {{
                    paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                }}
            >
                { !loading ? forecourts.map( (marker, index) => (
                    <View style={styles.card} key={index}>
                        <View style={{flex: 1}}>
                            <Image 
                                source={{uri: marker.logo}}
                                style={styles.cardImage}
                            />
                            <View style={styles.textContent}>
                                <Text 
                                    numberOfLines = {1}
                                    style={styles.cardTitle}
                                >
                                    {marker.name}
                                </Text>
                                <Text 
                                    numberOfLines = {1}
                                    style={{fontSize: 10}}
                                >
                                    {marker.address}
                                </Text>
                                <StarRating ratings={marker.ratingScore} reviews={marker.reviews.length}></StarRating>
                            </View>
                        </View>
                        <View styles={styles.priceContent}>
                            {marker.currPetrol.price ? 
                                <Text 
                                    numberOfLines = {1}
                                    style={styles.priceText}>
                                    Petrol: {marker.currPetrol.price}
                                </Text>
                            :   <Text 
                                    numberOfLines = {1}
                                    style={styles.priceText}>
                                    Petrol: --
                                </Text> 
                            }

                            {marker.currDiesel.price ? 
                                <Text 
                                    numberOfLines = {1}
                                    style={styles.priceText}>
                                    Diesel: {marker.currDiesel.price}
                                </Text>
                            :   <Text 
                                    numberOfLines = {1}
                                    style={styles.priceText}>
                                    Diesel: --
                                </Text> 
                            }
                            <View >
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('ForecourtScreen', {
                                        id: marker.id
                                    })}
                                >
                                    <Text
                                        style={styles.buttonText}
                                    >
                                        View more
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                )) : null}

            </Animated.ScrollView>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={diesel ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={diesel}
                style={styles.switch}
            />
        </View>    
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },

    logo: {
        width: '10%',
        height: '100%'
    },

    priceContainer : {
        flexDirection: 'row',
        justifyContent:'space-between',
        padding: 5,
        backgroundColor: Colors.lightGreen,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.green
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    price: {
        padding: 10
    },

    box: {
        alignContent: 'center',
        width: '100%',
        height: '120%'
    },

    spinnerTextStyle: {
        color: '#FFF'
    },

    scrollView: {
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        paddingVertical: 10,
        height: CARD_HEIGHT
    },

    switch: {
        position: "absolute",
        top: 40
    },

    card: {
        padding: 5,
        elevation: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        flexDirection: 'row',
      },

      cardImage: {
        flex: 6,
        width: '40%',
        height: '100%'
      },

      textContent: {
        flex: 2,
        padding: 10,
      },

      priceText: {
          fontSize: 20
      },

      priceContent: {
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          margin: 5,
          textAlignVertical: 'center',
          flex: 2
      },

      button: {
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.green,
        borderRadius: 4
      },

      buttonText: {
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.midGreen,

      }
});

export default MapScreen;