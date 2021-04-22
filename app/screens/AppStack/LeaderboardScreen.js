import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, Dimensions, StatusBar} from 'react-native';
import { Switch } from 'react-native-switch';
import Leaderboard from 'react-native-leaderboard';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 
import * as Location from 'expo-location';
const db = Firebase.firestore();
const { width, height } = Dimensions.get("window");


const LeaderboardScreen = ({navigation}) => {
    //Consts
    const currentUser = firebase.auth().currentUser.uid;

    //States
    const [users, loadingUsers, errorUsers] = useCollectionData(
        db.collection('users'),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );
    const [forecourts, loadingForecourts, errorForecourts] = useCollectionData(
        db.collection('forecourts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );
    const [forecourtView, setForecourtView] = useState(false);
    const [diesel, setDiesel] = useState(false)
    const [result, setResult] = useState();
    const [points, setPoints] = useState();
    const [forecourtsFiltered, setForecourtsFiltered] = useState([]);
    const [region, setRegion] = useState();

    //Vars
    let temp = [];

    useEffect ( () => {
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

        //When users have loaded in
        if(!loadingUsers) {
            users.sort((a, b) => (a.points < b.points) ? 1 : -1);
            setResult(getPos());
            setPoints(getPoints());
        }

        //When forecourts have loaded in and petrol is selected
        if(!loadingForecourts && !diesel) {
            temp = forecourts;
            temp = temp.filter((forecourt) => forecourt.currPetrol.price);

            for(let i = 0; i < temp.length; i++) {
                temp[i].petrolPrice = temp[i].currPetrol.price;

                if(!temp[i].name.length) {
                    temp[i].name = "FUEL STATION " + temp[i].address.split(" ").pop()
                } else if(temp[i].name.includes(temp[i].address.split(" ").pop())) {
                    null;
                }
                else {
                    temp[i].name += " " + temp[i].address.split(" ").pop();
                }
            }
            setForecourtsFiltered(temp);

            //When forecourts have loaded in and diesel is selected
        } else if(!loadingForecourts && diesel) {
            temp = forecourts;
            temp = temp.filter((forecourt) => forecourt.currDiesel.price);

            for(let i = 0; i < temp.length; i++) {

                temp[i].petrolPrice = temp[i].currDiesel.price;
                if(!temp[i].name.length) {
                    temp[i].name = "FUEL STATION " + temp[i].address.split(" ").pop()
                } else if(temp[i].name.includes(temp[i].address.split(" ").pop())) {
                    null;
                }
                else {
                    temp[i].name += " " + temp[i].address.split(" ").pop();
                }
            }
            setForecourtsFiltered(temp);
        }

    }, [users, forecourts, diesel, region])

    //Methods
    const toggleSwitch = () => setForecourtView(previousState => !previousState);
    const toggleSwitch2 = () => setDiesel(previousState => !previousState);

    const getPos = () => {
        let result;
        let place = users.findIndex(obj => obj.id === currentUser)+1;
        let first = "st";
        let second = "nd";
        let third = "rd";
        let fourth = "th";

        switch(place%10) {
            case 1:
                result = place+first;
                break;
            case 2:
                result = place+second;
                break;
            case 3:
                result=place+third;
                break;
            default:
                result = place+fourth;
                break;
        }
        return result;
    }

    const getPoints = () => {
        let obj = users.filter(obj => {
            return obj.id === currentUser;
        })
        obj = obj[0];
        obj = obj.points + " pts";
        return obj;
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'white'} barStyle="dark-content"/>
            <Spinner
                visible={loadingUsers}
                textContent={'Getting leaderboard data...'}
                textStyle={styles.spinnerTextStyle}
            />

            { forecourtView ?
            <View>
                    <Animatable.View style={styles.topView} animation="bounceIn">
                            <View style={{flexDirection:'row', justifyContent: 'space-between', marginHorizontal: '5%'}}>
                                <View style={styles.textView}>
                                    <Text style={styles.forecourtTitle}>Forecourt</Text>
                                </View>
                                <View style={styles.textView}>
                                    <FontAwesome
                                        name="trophy"
                                        color={Colors.green}
                                        size={hp('15.0%')}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.forecourtTitle}>Leaderboard</Text>
                                </View>
                            </View>
                            <View style={styles.switchTop}>
                                <Switch
                                    activeText={'Diesel'}
                                    inActiveText={'Petrol'}
                                    backgroundActive={Colors.midGreen}
                                    backgroundInactive={Colors.green}
                                    changeValueImmediately={true}
                                    switchLeftPx={3} 
                                    switchRightPx={3}
                                    switchWidthMultiplier={3}
                                    onValueChange={toggleSwitch2}
                                    value={diesel}
                                />
                            </View>                    
                    </Animatable.View>

                {!loadingForecourts && forecourtsFiltered ?
                    <Animatable.View style={{flex: 5}} animation="bounceInUp">
                        <Leaderboard 
                            data={forecourtsFiltered} 
                            sortBy="petrolPrice"
                            sort={ () => forecourtsFiltered.sort((a, b) => (a.petrolPrice > b.petrolPrice) ? 1 : -1)}
                            labelBy='name'
                            oddRowColor={'white'}
                            evenRowColor={'#97dba6'}
                            onRowPress={ (item) => {
                                if(region) {
                                    navigation.navigate('ForecourtScreen', {
                                        id: item.id,
                                        coords: {
                                            lat: region.latitude,
                                            lng: region.longitude
                                        }
                                    })}   
                                }

                            }
                        />
                        <Text style={styles.noPrices}>{forecourtsFiltered.length == 0 ? "No fuel prices have been reported yet!" : null}</Text>
                    </Animatable.View>
                : null}

            </View>
            : 
            <View>
                {!loadingUsers ? 
                    <Animatable.View style={styles.topView} animation="bounceIn">
                            <View style={{flexDirection:'row', justifyContent: 'space-between', marginHorizontal: '10%'}}>
                                <View style={styles.textView}>
                                    <Text style={styles.placeText}>{result}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <FontAwesome
                                        name="trophy"
                                        color={Colors.green}
                                        size={hp('15.0%')}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.placeText}>{points}</Text>
                                </View>
                            </View>
                    </Animatable.View>
                : null}
                {!loadingUsers ? 
                    <Animatable.View style={{flex: 5}} animation="bounceInUp">
                        <Leaderboard 
                            data={users} 
                            sortBy='points'
                            labelBy='username'
                            oddRowColor={'white'}
                            evenRowColor={'#97dba6'}
                        />
                        <Text style={styles.noPrices}>{users.length == 0 ? "There are no users yet!" : null}</Text>
                    </Animatable.View>
                : null}
            </View>}

            <View style={styles.switch}>
                <Switch
                    activeText={'Forecourt'}
                    inActiveText={'User'}
                    backgroundActive={Colors.midGreen}
                    backgroundInactive={Colors.green}
                    changeValueImmediately={true}
                    switchLeftPx={3} 
                    switchRightPx={3}
                    switchWidthMultiplier={3}
                    onValueChange={toggleSwitch}
                    value={forecourtView}
                />
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20
    },
    placeText: {
        fontSize: wp('8.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        textAlign: 'center',
    },
    titleText: {
        fontSize: wp('6.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        textAlign: 'center',
    },
    forecourtTitle: {
        fontSize: wp('6.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        textAlign: 'center',
    },
    textView: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    icon: {
        shadowColor: Colors.lightGreen,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 10
    },
    topView: {
        flex: 2, 
        backgroundColor: 'white', 
        justifyContent: 'center', 
        width: width
    },
    switch: {
        bottom: 50
    },
    switchTop: {
        alignSelf: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    noPrices: {
        fontSize: wp('7.0%'),
        position: 'absolute',
        alignSelf: 'center',
        paddingTop: 10
    }
});

export default LeaderboardScreen;