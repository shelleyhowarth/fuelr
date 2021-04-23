import React, { useState, useEffect, useRef } from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Animated, TouchableOpacity, Platform, ScrollView, Keyboard } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Switch } from 'react-native-switch';
import { Colors } from '../../../styles/Colors';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRatingOverall from '../../components/StarRating';
import Firebase from '../../firebase/Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen';
import moment from 'moment';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';
import { TextInputMask } from 'react-native-masked-text'
import { SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Styling consts
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = (Platform.OS === 'ios' ? hp('30.0%') : hp('33.0%'))
const CARD_WIDTH = width * 0.9;
const SPACING_FOR_CARD_INSET = width * 0.1 - 20;
const db = Firebase.firestore();

const MapScreen = ({navigation}) => {

    //States
    const [region, setRegion] = useState(null);
    const [forecourtsDb, loading, error] = useCollectionData(
        db.collection('forecourts'),
        {
            snapshotListenOptions: {includeMetadataChanges: true}
        }
    );
    const [forecourts, setForecourts] = useState(forecourtsDb);
    const [diesel, setDiesel] = useState(false);
    const scrollRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [preferredAmenities, setPreferredAmenities] = useState({
      'atm': false,
      'deli': false,
      'bathroom': false,
      'electricCharging': false,
      'payAtPump': false,
      'acceptsCard': false,
      'convenienceStore': false,
      'carWash': false,
      'airAndWater': false,
      'vacuum': false,
      'wifi': false,
      'alcohol': false
    });
    const [kmRadius, setKmRadius] = useState(5);
    const [applyingFilters, setApplyingFilters] = useState(false);
    const [maxPrice, setMaxPrice] = useState();

    const icons = [
        {
            dbName: 'acceptsCard',
            return: 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome5
                        name='credit-card'
                        size={25}
                        color={preferredAmenities.acceptsCard ? 'green' : 'grey'}  
                    />
                    <Text >Accepts Card</Text>
                </View>
        },
        {
            dbName: 'airAndWater',
            return: 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons
                        name='water-outline'
                        size={25}
                        color={preferredAmenities.airAndWater ? 'green' : 'grey'}  
                    />
                    <Text>Air and Water</Text>
                </View>
        },
        {
            dbName: 'alcohol',
            return: 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons
                        name='wine'
                        size={25}
                        color={preferredAmenities.alcohol ? 'green' : 'grey'}  
                    />
                    <Text >Alcohol</Text>
                </View>
        },
        {   
            dbName: 'atm',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome 
                    name='euro'
                    size={25}
                    color={preferredAmenities.atm ? 'green' : 'grey'}
                />
                <Text >ATM</Text>
            </View>
       
        },
        {
            dbName: 'bathroom',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons 
                    name='toilet'
                    size={25}
                    color={preferredAmenities.bathroom ? 'green' : 'grey'}
                />
                <Text >Toilet</Text>
            </View>
        },
        {
            dbName: 'carWash',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons 
                    name='car-wash'
                    size={25}
                    color={preferredAmenities.carWash ? 'green' : 'grey'}

                />
                <Text>Car Wash</Text>
            </View>
        },
        {
            dbName: 'convenienceStore',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: wp('1.0%')}}>
                <MaterialCommunityIcons 
                    name='storefront-outline'
                    size={25}
                    color={preferredAmenities.convenienceStore ? 'green' : 'grey'}
                />
                <Text >Convenience Store</Text>
            </View>
        },
        {
            dbName: 'deli',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons
                    name='fast-food-outline'
                    size={25}
                    color={preferredAmenities.deli ? 'green' : 'grey'}  
                />
                <Text >Deli</Text>
            </View>
        },
        {
            dbName: 'electricCharging',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome5
                    name='charging-station'
                    size={25}
                    color={preferredAmenities.electricCharging ? 'green' : 'grey'}  
                />
                <Text>Electric Vehicle Charging</Text>
            </View>
        },
        {
            dbName: 'payAtPump',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome5
                    name='gas-pump'
                    size={25}
                    color={preferredAmenities.payAtPump ? 'green' : 'grey'}  
                />
                <Text>Pay At Pump</Text>
            </View>
        },
        {
            dbName: 'vacuum',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <MaterialIcons
                    name='cleaning-services'
                    size={25}
                    color={preferredAmenities.vacuum ? 'green' : 'grey'}  
                />
                <Text >Vacuum</Text>
            </View>
        },
        {
            dbName: 'wifi',
            return: 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome5
                    name='wifi'
                    size={25}
                    color={preferredAmenities.wifi ? 'green' : 'grey'}  
                />
                <Text >WiFi</Text>
            </View> 
        }
    ]

    useEffect( () => {
        //Getting location permission and setting inital region to user's location
        if(!region) {
            getLocation();
        }

        //Apply filters once location has been got
        if(!loading && region) {
            applyFilters();
        }
    
    }, [forecourtsDb, region, preferredAmenities, kmRadius, diesel])

    //Methods

    //Get user's location
    const getLocation = async () => {
        let tempRegion;

        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission to access location was denied');
              return;
            }

            let location = await Location.getCurrentPositionAsync({});

            tempRegion = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.04,
            }
            setRegion(tempRegion);
        })();
    }

    //Apply filters to map
    const applyFilters = () => {
        let temp = [];
        temp = forecourtsDb.filter((forecourt) => {
            let dist =  calculateDistance(region.latitude, region.longitude, forecourt.latitude, forecourt.longitude);
            return dist <= kmRadius;
        });   
        setForecourts(temp);        
    
    
        if(preferredAmenities && forecourts) {
            let temp = [];
            forecourts.forEach((forecourt) => {
                for (const [key, value] of Object.entries(forecourt.currAmenities.amenities)) {
                    if(value && preferredAmenities[key]) {
                        temp.push(forecourt);
                    }
                } 
            })

            if(temp.length) {
                setForecourts(temp);
            }
        }

        if(maxPrice && !diesel) {
            let temp = [];
            temp = forecourts.filter((forecourt) => {
                return (forecourt.currPetrol.price <= maxPrice && forecourt.currPetrol.price !== null);
            });   

            forecourts.forEach(( forecourt, index) => {
                console.log(maxPrice);
                console.log(forecourt.currPetrol.price);
            });

            setForecourts(temp);
        } else if(maxPrice && diesel) {
            
            let temp = [];
            temp = forecourts.filter((forecourt) => {
                return (forecourt.currDiesel.price <= maxPrice && forecourt.currDiesel.price !== null);
            });   
            setForecourts(temp);
        }
    }

    //Reset filters
    const resetFilters = () => {
        setPreferredAmenities({      
            'atm': false,
            'deli': false,
            'bathroom': false,
            'electricCharging': false,
            'payAtPump': false,
            'acceptsCard': false,
            'convenienceStore': false,
            'carWash': false,
            'airAndWater': false,
            'vacuum': false,
            'wifi': false,
            'alcohol': false
        });
        setKmRadius(5);
        setDiesel(false);
        setMaxPrice();
    }

    //Change toggle between petrol and diesel in filter modal
    const toggleSwitch = () => setDiesel(previousState => !previousState);

    //Calculate distance between 2 geopoints
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        var p = 0.017453292519943295; 
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
        
        return 12742 * Math.asin(Math.sqrt(a)); 
    }

    //Calculate distance between user and forecourt
    const kmFromMe = (forecourt) => {
        let dist = calculateDistance(region.latitude, region.longitude, forecourt.latitude, forecourt.longitude);
        return dist.toFixed(2) + " km away";
    }

    //Returns time since petrol price was last updated
    const petrolElapsedTime = (forecourt) => {
        if(forecourt.currPetrol.timestamp) {
            return (moment.utc(forecourt.currPetrol.timestamp).local().startOf('seconds').fromNow());
        }
    }

    //Returns time since petrol price was last updated
    const dieselElapsedTime = (forecourt) => {
        if(forecourt.currDiesel.timestamp) {
            return (moment.utc(forecourt.currDiesel.timestamp).local().startOf('seconds').fromNow());
        }
    }

    //Displays current prices on map markers
    const fuelPriceMarker = (marker) => {
        if(!diesel) {
            return (
                <View>
                    {marker.currPetrol.price ?
                        <Text> {marker.currPetrol.price} </Text>
                    :   <Text> --.- </Text> }
                </View>
            )
        } else {
            return (
                <View>
                    {marker.currDiesel.price ?
                        <Text> {marker.currDiesel.price} </Text>
                    :   <Text> --.- </Text> }
                </View>
            )
        }
    }

    //Remove name from address
    const shortenAddress = (marker) => {
        return marker.address.replace(marker.name, '');
    }

    //When a map marker is pressed, scroll to the relevant card
    const onMarkerPress = (e) => {
        const markerId = e._targetInst.return.key;
        let x = (markerId * CARD_WIDTH) + (markerId * 20);

        if(Platform.OS === 'ios') {
            x = x - SPACING_FOR_CARD_INSET;
        }

        scrollRef.current.scrollTo({x: x, y: 0, animated: true});
    }

    //Return
    return (
        <View style={styles.container}>

            <Spinner
                visible={!forecourts}
                textContent={'Loading forecourts...'}
                textStyle={styles.spinnerTextStyle}
            />

            <Spinner
                visible={applyingFilters}
                textContent={'Applying filters...'}
                textStyle={styles.spinnerTextStyle}
            />

            <Modal
                animationIn="slideInDown"
                animationOut="slideOutDown"
                isVisible={modalVisible}
                style={styles.modal}
                coverScreen={false}
                onBackdropPress={() => setModalVisible(false)}
            >     
                <ScrollView contentContainerStyle={{alignItems: 'center', flexGrow: 1}} nestedScrollEnabled={true}>
                    <Text style={styles.action}>Fuel type</Text>
                    <Switch
                        activeText={'Diesel'}
                        inActiveText={'Petrol'}
                        backgroundActive={Colors.midGreen}
                        backgroundInactive={Colors.green}
                        changeValueImmediately={true}
                        switchLeftPx={3} 
                        switchRightPx={3}
                        switchWidthMultiplier={3}
                        onValueChange={toggleSwitch}
                        value={diesel}
                        useNativeDriver={true}
                    />

                    <Text style={styles.action}>KM radius</Text>
                    <Text>{kmRadius}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text>1</Text>
                        <Slider
                            style={{width: 200, height: 40}}
                            minimumValue={1}
                            maximumValue={50}
                            minimumTrackTintColor={Colors.green}
                            maximumTrackTintColor={Colors.lightGreen}
                            value={kmRadius}
                            step={1}
                            onSlidingComplete={ (val) => setKmRadius(val) }
                        />
                        <Text>50</Text>
                    </View>
                    <Text style={[styles.action]} >Max price </Text>
                    <View style={{flexDirection: 'row', height: '10%'}}>
                        <TextInputMask
                            type={'money'}
                            options={{
                                precision: 1,
                                separator: '.',
                                unit: '',

                            }}
                            style={styles.input}
                            onChangeText={val => {
                                let priceInput = val; 
                                setMaxPrice(priceInput);
                            }}
                            keyboardType='numeric'
                            value={maxPrice}
                            placeholder='130.1'
                            maxLength={5}
                        />
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{flex: 2, height: '300%'}}
                        >
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                                style={styles.applyFilters}
                            >
                                <Text style={styles.buttonText}>Ok</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.action}>Amenities</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        {icons.map((obj, index) => {
                            return (
                                <View style={{justifyContent: 'center', alignItems: 'center', padding: wp('2.0%')}}>
                                    <TouchableOpacity onPress={ () => {
                                        for(const [key, value] of Object.entries(preferredAmenities)) {
                                            if(key === obj.dbName) {
                                                let amenitiesObj = {
                                                    ...preferredAmenities,
                                                    [key]: !value
                                                }
                                                console.log(amenitiesObj);
                                                setPreferredAmenities(amenitiesObj)  
                                            }
                                          
                                        }
                                    }}>
                                        {obj.return}
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                resetFilters()
                            }}
                            style={{width: '50%', paddingHorizontal: 5, height: hp('20.0%')}}
                        >
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={styles.applyFilters}
                                >
                                    <Text style={styles.buttonText}>Reset filters</Text>
                                </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                applyFilters()
                                setModalVisible(false);
                            }}
                            style={{width: '50%', paddingHorizontal: 5, height: hp('20.0%')}}
                        >
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={styles.applyFilters}
                                >
                                    <Text style={styles.buttonText}>Apply filters</Text>
                                </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>      
            </Modal>

            <MapView
                style={styles.map}
                showsUserLocation={loading ? false : true}
                initialRegion={region ? region : null}
            >
                { forecourts ? forecourts.map((marker, index) => {
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
                height = {10}
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
                { forecourts ? forecourts.map( (marker, index) => {
                    //flex:1, flexDirection: 'row'
                    return (
                        <View style={styles.card} key={index}>
                            <View style={{flex: 2}}>
                                <Image 
                                    source={{uri: marker.logo}}
                                    style={styles.cardImage}
                                />
                            </View>
                            <View style={{flex: 1}}/>

                            <View style={{flex: 3, flexDirection: 'column'}}>

                                <View>
                                    <Text 
                                        numberOfLines = {2}

                                        style={styles.cardTitle}
                                    >
                                        {marker.name ? marker.name : 'FUEL STATION'}
                                    </Text>
                                    <Text 
                                        numberOfLines = {1}
                                        style={{fontSize: wp('2.0%')}}
                                    >
                                        {shortenAddress(marker)}
                                    </Text>
                                    <StarRatingOverall ratings={marker.ratingScore} reviews={marker.reviews.length}></StarRatingOverall>
                                    <Text style={{color: 'grey'}}>{kmFromMe(marker)}</Text>
                                </View>

                                <View style={Platform.OS === 'android' ? {padding: 2} : {flex: 1}}/>

                                <View style={{flex: 3}}>
                                    <View styles={styles.priceContent}>
                                        {marker.currPetrol.price ? 
                                            <View style={{flexDirection: 'row'}}>
                                                <Text 
                                                    numberOfLines = {1}
                                                    style={styles.priceText}>
                                                    Petrol: {marker.currPetrol.price}
                                                </Text>
                                                <Text style={styles.elapsedText}>({petrolElapsedTime(marker)})</Text>
                                            </View>
                                        :   <Text 
                                                numberOfLines = {1}
                                                style={styles.priceText}>
                                                Petrol: --.-
                                            </Text> 
                                        }

                                        {marker.currDiesel.price ? 
                                            <View style={{flexDirection: 'row'}}>
                                                <Text 
                                                    numberOfLines = {1}
                                                    style={styles.priceText}>
                                                    Diesel: {marker.currDiesel.price}
                                                </Text>
                                                <Text style={styles.elapsedText}>({dieselElapsedTime(marker)})</Text>
                                            </View>
                                        :   <Text 
                                                numberOfLines = {1}
                                                style={styles.priceText}>
                                                Diesel: --.-
                                            </Text> 
                                        }
                                    </View>
                                </View>
                                <View style={{padding: 2}}/>
                                <View style={{flex: 3}}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('ForecourtScreen', {
                                            id: marker.id,
                                            coords: {
                                                lat: region.latitude,
                                                lng: region.longitude
                                            }
                                        })}
                                    >
                                            <LinearGradient
                                                colors={[Colors.midGreen, Colors.green]}
                                                style={styles.signIn}
                                            >
                                                <Text style={styles.buttonText}>View more</Text>
                                            </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }) : null}

            </Animated.ScrollView>
            <TouchableOpacity style={styles.switch} onPress={ () => setModalVisible(true)}>
                <Feather
                    name='sliders'
                    size={wp('10.0%')}
                    color={Colors.green}
                />
            </TouchableOpacity>
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
        fontSize: wp('4.0%'),
        fontWeight: "bold",
    },

    logo: {
        width: wp('3.5%'),
        height: '100%'
    },

    priceContainer : {
        flexDirection: 'row',
        justifyContent:'space-between',
        padding: wp('1.3%'),
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
        bottom: hp('1.0%'),
        left: 0,
        right: 0,
        paddingVertical: 10,
        height: CARD_HEIGHT
    },

    switch: {
        position: "absolute",
        top: 40,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 100,
        padding: 5,
    },

    card: {
        padding: wp('0.5%'),
        elevation: 2,
        backgroundColor: Colors.lightGreen,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT - hp('1.0%'),
        width: CARD_WIDTH,
        overflow: 'visible',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: Colors.green,
        flex: 1,
        flexDirection: 'row'
    },

    cardImage: {
        width: wp('33.0%'),
        height: hp('20.0%')
    },

    priceText: {
        fontSize: wp('3.5%')
    },

    priceContent: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        textAlignVertical: 'center',
    },

    button: {
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderColor: Colors.green,
        borderRadius: 4
    },

    buttonText: {
        fontSize: wp('4.0%'),
        fontWeight: 'bold',
        color: 'white'
    },

    signIn: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        borderRadius:  10,
        flexDirection: 'row',
        alignItems: 'center'
    },

    applyFilters: {
        width: '100%',
        height: '30%',
        justifyContent: 'center',
        borderRadius:  10,
        alignItems: 'center'
    },

    filter: {
        color: Colors.green,
        alignSelf: 'center',
        textAlign: 'center'
    },
    modal: {
        marginTop: Platform.OS === 'ios' ? hp('10%') : hp('10%'),
        marginBottom: Platform.OS === 'ios' ? hp('10%') : hp('10%'),
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 20,
        alignSelf: 'center',
        padding: 10
    },
    action: {
        marginTop: hp('1.0%'),
        paddingBottom: 5,
        color: 'grey'
    },
    elapsedText: {
        color: 'grey', 
        fontSize: wp('3.5%'), 
        paddingLeft: wp('1.0%')
    },
    input: {
        width: '100%',
        height: '90%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('4.5%'),
        flex: 2
    },
});

export default MapScreen;