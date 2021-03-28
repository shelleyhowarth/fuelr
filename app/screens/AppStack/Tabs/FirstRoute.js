import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { submitReview, updatePetrolPrice, updateDieselPrice, addPoints } from '../../../firebase/FirebaseMethods';
import Firebase from '../../../firebase/Firebase';
import { TextInput } from 'react-native-gesture-handler';
import moment from 'moment';
import { Colors } from '../../../../styles/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from '../../../components/StarRating';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';

export const FirstRoute = ({forecourt}) => {
    //States
    const [petrolModalVisible, setPetrolModalVisible] = useState(false);
    const [dieselModalVisible, setDieselModalVisible] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [petrolElapsedTime, setPetrolElapsedTime] = useState();
    const [dieselElapsedTime, setDieselElapsedTime] = useState();
    const [petrolPrice, setPetrolPrice] = useState();
    const [dieselPrice, setDieselPrice] = useState();
    
    //Vars
    const currentUser = Firebase.auth().currentUser;
    const layout = useWindowDimensions();
    let petrolInput, dieselInput;

    //UseEffect
    useEffect(() => {
        setPetrolElapsedTime(moment.utc(forecourt.currPetrol.timestamp).local().startOf('seconds').fromNow());
        setDieselElapsedTime(moment.utc(forecourt.currDiesel.timestamp).local().startOf('seconds').fromNow());
        setSpinner(false);
    }, [dieselPrice])

    //Methods
    const topPetrolReporters = () => {
        let reporters = ['--', '--', '--'];
        let first = '--', second = '--', third = '--';

        if(forecourt && forecourt.petrol.length > 0) {
            let copy = forecourt.petrol;

            first = mostCommon(copy);
            copy = copy.filter( val =>  val.user !== first);
            reporters[0] = first;
    
            if(copy.length) {
                second = mostCommon(copy);
                reporters[1] = second;
                copy = copy.filter( val =>  val.user !== second);
                if(copy.length) {
                    third = mostCommon(copy);
                    reporters[2] = third;
                }
            }    
        }
        return reporters;
    }

    const mostCommon = (arr) => {
        var maxEl = arr[0].user
        var maxCount = 1;
        var modeMap = {};

        for(var i = 0; i < arr.length; i++) {
            var el = arr[i].user;

            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    const onConfirmCurrent = (type) => {
        if(type === 'petrol') {
            updatePetrolPrice(forecourt.id, forecourt.currPetrol.price)
            setPetrolModalVisible(false);
        } else {
            updateDieselPrice(forecourt.id, forecourt.currDiesel.price)
            setDieselModalVisible(false);
        }
    }

    const onPetrolSubmit = () => {
        console.log("input: " + petrolInput);
        console.log("state: " + petrolPrice);
        if(Math.abs(forecourt.currPetrol.price - petrolPrice) >= 5) {
            Alert.alert(
                "Warning",
                `This is a significant increase/decrease from the current price (${forecourt.currPetrol.price}) - are you sure it's correct?`,
                [
                  {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => {
                    updatePetrolPrice(forecourt.id, petrolPrice);
                    setPetrolModalVisible(false);
                  }}
                ]
              );
        } else {
            updatePetrolPrice(forecourt.id, petrolPrice);
            setPetrolModalVisible(false);
        }
    }

    const onDieselSubmit = () => {
        if(Math.abs(forecourt.currDiesel.price - dieselPrice) >= 5) {
            Alert.alert(
                "Warning",
                `This is a significant increase/decrease from the current price (${forecourt.currDiesel.price}) - are you sure it's correct?`,
                [
                  {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => {
                    updateDieselPrice(forecourt.id, dieselPrice);
                    setDieselModalVisible(false);
                  }}
                ]
              );
        } else {
            updateDieselPrice(forecourt.id, dieselPrice);
            setDieselModalVisible(false);
        }
    }

    //Views & return
    if(forecourt) {
        return(
            <View style={{ flex: 1, backgroundColor: Colors.lightGreen, alignItems: 'center'}} >
                <Modal
                    animationIn="slideInDown"
                    animationOut="slideOutDown"
                    isVisible={petrolModalVisible}
                    style={styles.modal}
                    coverScreen={false}
                    onBackdropPress={() => setPetrolModalVisible(false)}
                    onPress={ () => {Keyboard.dismiss()}}
                >
                    <View style={{width: '100%', height: '100%'}}>
                        <Text
                            style={styles.petrolModalTitle}
                        >Report Petrol
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <Text style={styles.priceModal}>{forecourt.currPetrol.price}</Text>
                            </View>
                            <View style={{flex:1}}/>

                            <TouchableOpacity onPress={ () => onConfirmCurrent('petrol')} style={{flex: 3, justifyContent: 'center'}}>
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={styles.confirm}
                                >
                                    <Text style={styles.reportPrice}>Same Price</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={{flex:1}}/>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={val => {
                                        petrolInput = val; 
                                        setPetrolPrice(petrolInput);
                                    }}
                                    keyboardType='numeric'
                                    value={petrolPrice}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={{flex: 3}} onPress={ () => onPetrolSubmit()} disabled={!petrolPrice}>
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                                style={petrolPrice ? styles.confirmModal : styles.confirmModalDisabled}
                            >
                                <Text style={styles.reportPrice}>Update Price</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <Modal
                    animationIn="slideInDown"
                    animationOut="slideOutDown"
                    isVisible={dieselModalVisible}
                    style={styles.modal}
                    coverScreen={false}
                    onBackdropPress={() => setDieselModalVisible(false)}
                    onPress={ () => {Keyboard.dismiss()}}
                >
                    <View style={{width: '100%', height: '100%'}}>
                        <Text
                            style={styles.petrolModalTitle}
                        >Report Diesel
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <Text style={styles.priceModal}>{forecourt.currDiesel.price}</Text>
                            </View>
                            <View style={{flex:1}}/>

                            <TouchableOpacity onPress={ () => onConfirmCurrent('diesel')} style={{flex: 3, justifyContent: 'center'}}>
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={styles.confirm}
                                >
                                    <Text style={styles.reportPrice}>Same Price</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={{flex:1}}/>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={val => {
                                        dieselInput = val; 
                                        setDieselPrice(dieselInput);
                                    }}
                                    keyboardType='numeric'
                                    value={dieselPrice}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={{flex: 3}} onPress={ () => onDieselSubmit()} disabled={!dieselPrice}>
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                                style={dieselPrice ? styles.confirmModal : styles.confirmModalDisabled}
                            >
                                <Text style={styles.reportPrice}>Update Price</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <View style={styles.header}>
                    <Text style={styles.stationTitle}>{forecourt.name ? forecourt.name : 'FUEL STATION'}</Text>
                    <Text>{forecourt.address}</Text>
                    <StarRating 
                        ratings={forecourt.ratingScore} 
                        reviews={forecourt.reviews.length}
                        style={{height: '20%'}}
                    />
                </View>

                <View style={styles.space}></View>

                <View style={styles.middle}>
                    <Text
                        style={styles.petrolTitle}
                    >Petrol
                    </Text>
                    <View style={{flex: 3}}>
                        <Text style={styles.price}>{forecourt.currPetrol.price}</Text>
                    </View>
                    <View style={{flex: 3}}>
                        <Text style={styles.updated}>{petrolElapsedTime}</Text>
                        <Text style={styles.updated}>{forecourt.currPetrol.user}</Text>
                    </View>
                    <TouchableOpacity style={{flex: 3}} onPress={() => setPetrolModalVisible(!petrolModalVisible)}>
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.confirm}
                        >
                            <Text style={styles.reportPrice}>Report Price</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.space}></View>

                <View style={styles.middle}>
                    <Text
                        style={styles.petrolTitle}
                    >Diesel
                    </Text>
                    <View style={{flex: 3}}>
                        <Text style={styles.price}>{forecourt.currDiesel.price}</Text>
                    </View>
                    <View style={{flex: 3}}>
                        <Text style={styles.updated}>{dieselElapsedTime}</Text>
                        <Text style={styles.updated}>{forecourt.currDiesel.user}</Text>
                    </View>
                    <TouchableOpacity style={{flex: 3}} onPress={() => setDieselModalVisible(!dieselModalVisible)}>
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.confirm}
                        >
                            <Text style={styles.reportPrice}>Report Price</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.space}></View>
                <View style={styles.footer}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <FontAwesome
                            name="star"
                            color={Colors.shadeGreen}
                            size={40}
                            style={styles.icon}
                        />
                        <Text style={styles.petrolTitle}>Top Reporters</Text>
                        <FontAwesome
                            name="star"
                            color={Colors.shadeGreen}
                            size={40}
                            style={styles.icon}
                        />
                    </View>

                    {topPetrolReporters().map((val, index) => {
                        return(
                            <Text style={styles.reportersText}>{index+1}. {val}</Text>
                        )
                    })}
                </View>
                <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                >
                    <FontAwesome
                        name="arrow-left"
                        color={Colors.green}
                        size={60}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <Spinner
            visible={spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            />
        );

    }
        
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
    header: {
        height: '10%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
    },
    middle: {
        height: '10%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        height: '20%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
    },
    input: {
        width: '100%',
        height: '55%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: 30,
    },
    confirm: {
        width: '100%',
        height: '55%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: 30,
        justifyContent: 'center'
    },
    confirmModal: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: 30,
        justifyContent: 'center'
    },
    confirmModalDisabled: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: 30,
        justifyContent: 'center',
        opacity: 0.1
    },
    stationTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.green
    },
    petrolTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        flex: 4
    },
    petrolModalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        flex: 3
    },
    reportersText: {
        fontSize: 20
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    space: {
        padding: 5
    },
    price: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    priceModal: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    updated: {
        color: 'grey'
    },
    reportPrice: {
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: 17,
    }
});