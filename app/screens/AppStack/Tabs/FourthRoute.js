
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

export const FourthRoute = ({forecourt}) => {
    //States
    const [available, setAvailable] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);


    useEffect( () => {
        if(forecourt) {
            for (const [key, value] of Object.entries(forecourt.amenities)) {
                if(value == true) {
                    console.log("matched")
                    setAvailable(available => available.concat(key));
                }
            }
            console.log(available);
        }
    }, [available])

    if(forecourt) {
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
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <FontAwesome 
                                name='euro'
                                size={25}
                            />
                            <MaterialCommunityIcons 
                                name='car-wash'
                                size={25}
                            />
                            <MaterialCommunityIcons 
                                name='toilet'
                                size={25}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Text>ATM</Text>
                            <Text>Car Wash</Text>
                            <Text>Toilet</Text>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <MaterialCommunityIcons 
                                name='storefront-outline'
                                size={25}
                            />

                            <FontAwesome5
                                name='gas-pump'
                                size={25}
                            />

                            <Ionicons
                                name='fast-food-outline'
                                size={25}
                            />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Text>Convenience Store</Text>
                            <Text>Pay at pump</Text>
                            <Text>Deli</Text>
                        </View>


                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <FontAwesome5
                                name='charging-station'
                                size={25}
                            />

                            <FontAwesome5
                                name='wifi'
                                size={25}
                            />

                            <FontAwesome5
                                name='credit-card'
                                size={25}
                            />


                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Text>Electric vehicle charging</Text>
                            <Text>WiFi</Text>
                            <Text>Accepts card</Text>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Ionicons
                                    name='wine'
                                    size={25}
                            />

                            <Ionicons
                                name='water-outline'
                                size={25}
                            />

                            <MaterialIcons
                                name='cleaning-services'
                                size={25}
                            />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Text>Alcohol</Text>
                            <Text>Air and water</Text>
                            <Text>Vacuum</Text>
                        </View>
                        <TouchableOpacity style={{flex: 3}}>
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                            >
                                <Text style={styles.reportPrice}>Update Price</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </Modal>
                

                <View style={styles.middle}>
                    <Text
                        style={styles.petrolTitle}
                    >Available Amenities
                    </Text>
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
        height: '10%',
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
        marginTop: '40%',
        marginBottom: '100%',
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 5,
        alignSelf: 'center',
        padding: 10
    },
    logoDisabled: {
        color: 'grey'
    },
    logo: {
        color: Colors.shadeGreen
    }
});