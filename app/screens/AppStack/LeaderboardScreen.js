import React, { useEffect, useState } from 'react';
import {View, StyleSheet, RefreshControl, Text, Dimensions, StatusBar, Switch} from 'react-native';
import { signOut, updateForecourts } from '../../firebase/FirebaseMethods';
import Leaderboard from 'react-native-leaderboard';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';


const db = Firebase.firestore();
const { width, height } = Dimensions.get("window");


const LeaderboardScreen = () => {
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
    const [result, setResult] = useState();
    const [points, setPoints] = useState();
    const [forecourtsFiltered, setForecourtsFiltered] = useState([]);

    //Vars
    let temp = [];

    useEffect ( () => {

        if(!loadingUsers) {
            users.sort((a, b) => (a.points < b.points) ? 1 : -1);
            setResult(getPos());
            setPoints(getPoints());
        }

        if(!loadingForecourts && forecourts.length > 0) {
            temp = forecourts;
            temp = temp.filter((forecourt) => forecourt.currPetrol.price);

            for(let i = 0; i < temp.length; i++) {
                temp[i].petrolPrice = temp[i].currPetrol.price;
                if(!temp[i].name.length) {
                    temp[i].name = "FUEL STATION " + temp[i].address.split(" ").pop()
                } else if(temp[i].name.includes(temp[i].address.split(" ").pop())) {
                    break;
                }
                else {
                    temp[i].name += " " + temp[i].address.split(" ").pop();
                }
            }
            setForecourtsFiltered(temp);
        }

    }, [users, forecourts])

    //Methods
    const toggleSwitch = () => setForecourtView(previousState => !previousState);

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
                                    <Text style={styles.titleText}>Forecourt</Text>
                                </View>
                                <View style={styles.textView}>
                                    <FontAwesome
                                        name="trophy"
                                        color={Colors.green}
                                        size={80}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.titleText}>Leaderboard</Text>
                                </View>
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
                                        size={100}
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
                    </Animatable.View>
                : null}
            </View>}

            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={forecourtView ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={forecourtView}
                style={styles.switch}
            />

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
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.green,
        textAlign: 'center',
        
    },
    titleText: {
        fontSize: 30,
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
    spinnerTextStyle: {
        color: '#FFF'
    },
    noPrices: {
        fontSize: 25,
        position: 'absolute',
        alignSelf: 'center',
        paddingTop: 10
    }
});

export default LeaderboardScreen;