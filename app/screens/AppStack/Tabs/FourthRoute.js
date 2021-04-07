
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Colors } from '../../../../styles/Colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 
import { updateAmenities } from '../../../firebase/FirebaseMethods';
export const FourthRoute = ({forecourt}) => {
    //States
    const [available, setAvailable] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [forecourtState, setForecourtState] = useState(forecourt);
    
    const icons = [
        {
            dbName: 'acceptsCard',
            return: 
                <View>
                    <FontAwesome5
                        name='credit-card'
                        size={25}
                        color={forecourtState.amenities.acceptsCard ? 'green' : 'grey'}  
                    />
                    <Text style={{color: forecourtState.amenities.acceptsCard ? 'green' : 'grey'}}>Accepts Card</Text>
                </View>
        },
        {
            dbName: 'airAndWater',
            return: 
                <View>
                    <Ionicons
                        name='water-outline'
                        size={25}
                        color={forecourtState.amenities.airAndWater ? 'green' : 'grey'}  
                    />
                    <Text style={{color: forecourtState.amenities.airAndWater ? 'green' : 'grey'}}>Air and Water</Text>
                </View>
        },
        {
            dbName: 'alcohol',
            return: 
                <View>
                    <Ionicons
                        name='wine'
                        size={25}
                        color={forecourtState.amenities.alcohol ? 'green' : 'grey'}  
                    />
                    <Text style={{color: forecourtState.amenities.alcohol ? 'green' : 'grey'}}>Alcohol</Text>
                </View>
        },
        {   
            dbName: 'atm',
            return: 
            <View>
                <FontAwesome 
                    name='euro'
                    size={25}
                    color={forecourtState.amenities.atm ? 'green' : 'grey'}
                />
                <Text style={{color: forecourtState.amenities.atm ? 'green' : 'grey'}}>ATM</Text>
            </View>
       
        },
        {
            dbName: 'bathroom',
            return: 
            <View>
                <MaterialCommunityIcons 
                    name='toilet'
                    size={25}
                    color={forecourtState.amenities.bathroom ? 'green' : 'grey'}
                />
                <Text style={{color: forecourtState.amenities.bathroom ? 'green' : 'grey'}}>Toilet</Text>
            </View>
        },
        {
            dbName: 'carWash',
            return: 
            <View>
                <MaterialCommunityIcons 
                    name='car-wash'
                    size={25}
                    color={forecourtState.amenities.carWash ? 'green' : 'grey'}
                />
                <Text style={{color: forecourtState.amenities.carWash ? 'green' : 'grey'}}>Car Wash</Text>
            </View>
        },
        {
            dbName: 'convenienceStore',
            return: 
            <View>
                <MaterialCommunityIcons 
                    name='storefront-outline'
                    size={25}
                    color={forecourtState.amenities.convenienceStore ? 'green' : 'grey'}
                />
                <Text style={{color: forecourtState.amenities.convenienceStore ? 'green' : 'grey'}}>Convenience Store</Text>
            </View>
        },
        {
            dbName: 'deli',
            return: 
            <View>
                <Ionicons
                    name='fast-food-outline'
                    size={25}
                    color={forecourtState.amenities.deli ? 'green' : 'grey'}  
                />
                <Text style={{color: forecourtState.amenities.deli ? 'green' : 'grey'}}>Deli</Text>
            </View>
        },
        {
            dbName: 'electricCharging',
            return: 
            <View>
                <FontAwesome5
                    name='charging-station'
                    size={25}
                    color={forecourtState.amenities.electricCharging ? 'green' : 'grey'}  
                />
                <Text style={{color: forecourtState.amenities.electricCharging ? 'green' : 'grey'}}>Electric Vehicle Charging</Text>
            </View>
        },
        {
            dbName: 'payAtPump',
            return: 
            <View>
                <FontAwesome5
                    name='gas-pump'
                    size={25}
                    color={forecourtState.amenities.payAtPump ? 'green' : 'grey'}  
                />
                <Text style={{color: forecourtState.amenities.payAtPump ? 'green' : 'grey'}}>Pay At Pump</Text>
            </View>
        },
        {
            dbName: 'vacuum',
            return: 
            <View>
                <MaterialIcons
                    name='cleaning-services'
                    size={25}
                    color={forecourtState.amenities.vacuum ? 'green' : 'grey'}  
                />
                <Text style={{color: forecourtState.amenities.vacuum ? 'green' : 'grey'}}>Vacuum</Text>
            </View>
        },
        {
            dbName: 'wifi',
            return: 
            <View>
                <FontAwesome5
                    name='wifi'
                    size={25}
                    color={forecourtState.amenities.wifi ? 'green' : 'grey'}  
                />
                <Text style={{color: forecourtState.amenities.wifi ? 'green' : 'grey'}}>WiFi</Text>
            </View> 
        }
    ]

    useEffect( () => {
    }, [forecourtState])

    if(forecourtState) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
                <StatusBar backgroundColor={Colors.green} barStyle="dark-content"/>
                <Modal
                    animationIn="slideInDown"
                    animationOut="slideOutDown"
                    isVisible={modalVisible}
                    style={styles.modal}
                    coverScreen={false}
                    onBackdropPress={() => setModalVisible(false)}
                    onPress={ () => {Keyboard.dismiss()}}
                >
                    <View style={{width: '100%', height: '100%'}}>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                            {icons.map((obj, index) => {
                                return (
                                    <View style={{justifyContent: 'center', alignItems: 'center', padding: wp('2.0%')}}>
                                        <TouchableOpacity onPress={ () => {
                                            for (const [key, value] of Object.entries(forecourtState.amenities)) {
                                                if(key === obj.dbName) {
                                                    
                                                    let amenitiesObj = {
                                                        ...forecourtState.amenities,
                                                        [key]: !forecourtState.amenities[key]
                                                    }
                                                    
                                                    setForecourtState({
                                                        ...forecourtState,
                                                        amenities: amenitiesObj
                                                    });
                                                }
                                            }   
                                        }}>
                                            {obj.return}
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                        <TouchableOpacity style={{flex: 3}} onPress={() => {
                            modalVisible = false;
                            updateAmenities(forecourtState.id, forecourtState.amenities)
                        }}>
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                            >
                                <Text style={styles.reportPrice}>Update Amenities</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </Modal>
                

                <View style={styles.middle}>
                    <Text
                        style={styles.petrolTitle}
                    >Available Amenities
                    </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', width: '100%'}}>
                        { forecourtState ? 
                            Object.keys(forecourtState.amenities).map((key, index) => {
                                if(forecourtState.amenities[key] === true) {
                                    return (
                                            icons[index].return
                                        )
                                }
                            })
                        : null}
                    </View>

                    <TouchableOpacity style={{flex: 3}} onPress={() => setModalVisible(true)}>
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.confirm}
                        >
                            <Text style={styles.reportPrice}>Edit amenities</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    middle: {
        height: hp('15%'),
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        alignItems: 'center'
    },
    petrolTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        flex: 4
    },
    confirm: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: 30,
        justifyContent: 'center',
        padding: 5
    },
    reportPrice: {
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: 17,
    },
    modal: {
        marginTop: hp('20%'),
        marginBottom: hp('40%'),
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 5,
        alignSelf: 'center',
        padding: 5
    },
    logoDisabled: {
        color: 'grey'
    },
    logo: {
        color: Colors.shadeGreen
    }
});