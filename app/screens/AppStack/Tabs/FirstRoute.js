import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert, Image, Keyboard} from 'react-native';
import { updatePetrolPrice, updateDieselPrice } from '../../../firebase/FirebaseMethods';
import moment from 'moment';
import { Colors } from '../../../../styles/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRatingOverall from '../../../components/StarRating';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInputMask } from 'react-native-masked-text'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen';

export const FirstRoute = ({forecourt, navigation}) => {
    //States
    const [petrolModalVisible, setPetrolModalVisible] = useState(false);
    const [dieselModalVisible, setDieselModalVisible] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [petrolElapsedTime, setPetrolElapsedTime] = useState();
    const [dieselElapsedTime, setDieselElapsedTime] = useState();
    const [petrolPrice, setPetrolPrice] = useState();
    const [dieselPrice, setDieselPrice] = useState();
    
    //Vars
    let petrolInput, dieselInput;

    //UseEffect
    useEffect(() => {
        if(forecourt.currPetrol.timestamp) {
            setPetrolElapsedTime(moment.utc(forecourt.currPetrol.timestamp).local().startOf('seconds').fromNow());
        }

        if(forecourt.currDiesel.timestamp) {
            setDieselElapsedTime(moment.utc(forecourt.currDiesel.timestamp).local().startOf('seconds').fromNow());
        }
        setSpinner(false);
    }, [forecourt])

    //Methods
    const findReporters = () => {
        let reporters = [];
        let reportersPetrol = []
        let reportersDiesel = []    
        let reportersScores = [];

        if(forecourt) {
            //Add users
            forecourt.petrol.map( (object, index) => {
                reporters.push(object.user)
            })
    
            forecourt.diesel.map( (object, index) => {
                reporters.push(object.user)
            })

            //Remove duplicates
            reporters = reporters.filter( (data,index )=> {
                return reporters.indexOf(data) === index;
            })

            if(reporters) {
                forecourt.petrol.map((object, index) => {
                    let user = object.user

                    //Add usernames and occurences
                    let occurrences = forecourt.petrol.filter( (v) => (v.user === user))
                    let obj = {};
                    obj['name'] = user
                    obj['points']= occurrences.length;
                    reportersPetrol.push(obj);
                })

                forecourt.diesel.map((object, index) => {
                    let user = object.user

                    let occurrences = forecourt.diesel.filter( (v) => (v.user === user))
                    let obj = {};
                    obj['name'] = user
                    obj['points']= occurrences.length;
                    reportersDiesel.push(obj);
                })

                //Remove duplicates
                reportersPetrol = Array.from(new Set(reportersPetrol.map(a => a.name)))
                .map(name => {
                    return reportersPetrol.find(a => a.name === name)
                })

                reportersDiesel = Array.from(new Set(reportersDiesel.map(a => a.name)))
                .map(name => {
                    return reportersDiesel.find(a => a.name === name)
                })

                reportersScores = reportersDiesel.concat(reportersPetrol);

                //Add together points from petrol and diesel
                reportersScores.map( (object, index) => {
                    reportersScores.map( (object2, index2) => {
                        //If multiple occurrences of same user, add points and delete other object
                        if(reportersScores.indexOf(object) !== reportersScores.indexOf(object2) && object.name === object2.name) {
                            object.points = object.points + object2.points;
                            reportersScores.splice(reportersScores.indexOf(object2), 1);
                        }
                    })
                })
            }
        }
        return reportersScores;
    }

    const shortenAddress = (marker) => {
        return marker.address.replace(marker.name, '');
    }
    
    const topPetrolReporters = () => {
        let reporters = ['--', '--', '--'];

        if(forecourt) {
            let copy = findReporters();

            if(copy.length) {
                let first = copy.reduce(function (prev, current) {
                    return (prev.points > current.points) ? prev : current
                })
                reporters[0] = first.name;
                let index = copy.findIndex(x => JSON.stringify(x) === JSON.stringify(first));
                copy.splice(index, 1);

                if(copy.length) {
                    let second = copy.reduce(function (prev, current) {
                        return (prev.points > current.points) ? prev : current
                    })
                    reporters[1] = second.name;
                    let index = copy.findIndex(x => JSON.stringify(x) === JSON.stringify(second));
                    copy.splice(index, 1);

                    if(copy.length) {
                        let third = copy.reduce(function (prev, current) {
                            return (prev.points > current.points) ? prev : current
                        })
                        reporters[2] = third.name;
                        let index = copy.findIndex(x => JSON.stringify(x) === JSON.stringify(third));
                        copy.splice(index, 1);
                    }
                }

            } 
        }
        return reporters;
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
                                <Text style={styles.priceModal}>{forecourt.currPetrol.price ? forecourt.currPetrol.price : '--.-' }</Text>
                            </View>
                            <View style={{flex:1}}/>

                            <TouchableOpacity onPress={ () => onConfirmCurrent('petrol')} style={{flex: 3, justifyContent: 'center'}} disabled={!forecourt.currPetrol.price}>
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={forecourt.currPetrol.price ? styles.confirm : styles.confirmDisabled}
                                >
                                    <Text style={styles.reportPrice}>Same Price</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={styles.space}/>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <TextInputMask
                                    type={'money'}
                                    options={{
                                        precision: 1,
                                        separator: '.',
                                        unit: '',

                                    }}
                                    style={styles.input}
                                    onChangeText={val => {
                                        petrolInput = val; 
                                        setPetrolPrice(petrolInput);
                                    }}
                                    keyboardType='numeric'
                                    value={petrolPrice}
                                    placeholder='120.1'
                                    maxLength={5}
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
                                <Text style={styles.priceModal}>{forecourt.currDiesel.price ? forecourt.currDiesel.price : '--.-' }</Text>
                            </View>
                            <View style={styles.space}/>
                            <TouchableOpacity onPress={ () => onConfirmCurrent('petrol')} style={{flex: 3, justifyContent: 'center'}} disabled={!forecourt.currDiesel.price}>
                                <LinearGradient
                                    colors={[Colors.midGreen, Colors.green]}
                                    style={forecourt.currDiesel.price ? styles.confirm : styles.confirmDisabled}
                                >
                                    <Text style={styles.reportPrice}>Same Price</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={styles.space}/>
                            <View style={{flex: 2, justifyContent: 'center'}}>
                                <TextInputMask
                                    type={'money'}
                                    options={{
                                        precision: 1,
                                        separator: '.',
                                        unit: '',

                                    }}
                                    style={styles.input}
                                    onChangeText={val => {
                                        dieselInput = val; 
                                        setDieselPrice(dieselInput);
                                    }}
                                    keyboardType='numeric'
                                    value={dieselPrice}
                                    placeholder='120.1'
                                    maxLength={5}
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
                    <View style={{flex:2}}>
                        <Image 
                            source={{uri: forecourt.logo}} 
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.space}></View>

                    <View style={{flex:2}}>
                        <Text style={styles.stationTitle} numberOfLines={2}>{forecourt.name ? forecourt.name : 'FUEL STATION'}</Text>
                        <Text>{shortenAddress(forecourt)}</Text>
                        <StarRatingOverall 
                            ratings={forecourt.ratingScore} 
                            reviews={forecourt.reviews.length}
                        />
                    </View>

                </View>

                <View style={styles.space}></View>

                <View style={styles.middle}>
                    <Text
                        style={styles.petrolTitle}
                    >Petrol
                    </Text>
                    <View style={{flex: 3}}>
                        <Text style={styles.price}>{forecourt.currPetrol.price ? forecourt.currPetrol.price : '--.-' }</Text>
                    </View>
                    <View style={{flex: 3}}>
                        <Text style={styles.updated}>{petrolElapsedTime}</Text>
                        <Text style={styles.updated}>{forecourt.currPetrol.user ? 'by ' + forecourt.currPetrol.user : null}</Text>
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
                        <Text style={styles.price}>{forecourt.currDiesel.price ? forecourt.currDiesel.price : '--.-' }</Text>
                    </View>
                    <View style={{flex: 3}}>
                        <Text style={styles.updated}>{dieselElapsedTime}</Text>
                        <Text style={styles.updated}>{forecourt.currDiesel.user ? 'by ' + forecourt.currDiesel.user : null}</Text>
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
                        />
                        <Text style={styles.reportersTitle}>Top Reporters</Text>
                        <FontAwesome
                            name="star"
                            color={Colors.shadeGreen}
                            size={40}
                        />
                    </View>
                    {topPetrolReporters().map((val, index) => {
                        return(
                            <View style={{flexDirection: 'row', flex:1}}>
                                <View style={{flex:1}}>
                                    <FontAwesome5
                                        name="medal"
                                        color={index==0 ? 'gold' : index==1 ? 'silver' : '#C9AE5D'}
                                        size={30}
                                    />
                                </View>
                                <View style={{flex:8}}>
                                    <Text style={styles.reportersText}>{val}</Text>
                                </View>
                                
                            </View>
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
        marginTop: Platform.OS === 'ios' ? hp('20%') : hp('10%'),
        marginBottom: Platform.OS === 'ios' ? hp('40%') : hp('10%'),
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 5,
        alignSelf: 'center',
        padding: 10
    },
    header: {
        height: hp('25%'),
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        flexDirection:'row',
        justifyContent: 'center'
    },
    middle: {
        height: hp('10%'),
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
        height: hp('25%'),
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
        fontSize: wp('4.5%')
    },
    confirm: {
        width: '100%',
        height: '55%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('4.5%'),
        justifyContent: 'center'
    },
    confirmDisabled: {
        width: '100%',
        height: '55%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('4.5%'),
        justifyContent: 'center',
        opacity: 0.1
    },
    confirmModal: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('4.5%'),
        justifyContent: 'center'
    },
    confirmModalDisabled: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('4.5%'),
        justifyContent: 'center',
        opacity: 0.1
    },
    stationTitle: {
        fontSize: wp('7.0%'),
        fontWeight: 'bold',
        color: Colors.green
    },
    petrolTitle: {
        fontSize: wp('8.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        flex: 4
    },
    reportersTitle: {
        fontSize: wp('8.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        padding: 5,
        paddingBottom: 10
    },
    petrolModalTitle: {
        fontSize: wp('8.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        alignSelf: 'center',
        flex: 3
    },
    reportersText: {
        fontSize: wp('5.5%')
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    space: {
        padding: wp('1.0%')    
    },
    price: {
        fontSize: wp('5.5%'),
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    priceModal: {
        fontSize: wp('6.0%'),
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    updated: {
        color: 'grey',
        fontSize: wp('2.5%')
    },
    reportPrice: {
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: wp('3.5%'),
    },
    logo: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    }
});