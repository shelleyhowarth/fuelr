import React, { useEffect, useState } from 'react';
import {View, StyleSheet, RefreshControl, Text, Dimensions, StatusBar, Switch} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';
import Leaderboard from 'react-native-leaderboard';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import * as firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';


const db = Firebase.firestore();
const { width, height } = Dimensions.get("window");


const LeaderboardScreen = () => {
    const currentUser = firebase.auth().currentUser.uid;

    //States
    const [users, loadingUsers, errorUsers] = useCollectionDataOnce(db.collection('users'));
    const [forecourts, loadingForecourts, errorForecourts] = useCollectionDataOnce(db.collection('forecourts'));
    const [forecourtView, setForecourtView] = useState(false);
    const [result, setResult] = useState();
    const [points, setPoints] = useState();
    const [spinner, setSpinner] = useState(true);

    const toggleSwitch = () => setForecourtView(previousState => !previousState);

    useEffect ( () => {
        if(!loadingUsers) {
            users.sort((a, b) => (a.points < b.points) ? 1 : -1);
            setResult(getPos());
            setPoints(getPoints());
            setSpinner(false);

        }

        if(!loadingForecourts) {
            forecourts.forEach( obj => {
                    obj.petrolPrice = obj.currPetrol.price;
                    if(!obj.name.length) {
                        obj.name += "N/A " +  obj.address.split(" ").pop();
                    } else {
                        obj.name += " " + obj.address.split(" ").pop();
                    }
            });
            setSpinner(false);

        }

    }, [users, forecourts])

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
                visible={spinner}
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

                {!loadingForecourts ?
                    <Animatable.View style={{flex: 5}} animation="bounceInUp">
                        <Leaderboard 
                            data={forecourts} 
                            sortBy="petrolPrice"
                            sort={ () => forecourts.sort((a, b) => (a.petrolPrice > b.petrolPrice) ? 1 : -1)}
                            labelBy='name'
                            oddRowColor={'white'}
                            evenRowColor={'#97dba6'}
                        />
                    </Animatable.View>
                : null}

            </View>
            : 
            <View>
                {! loadingUsers ? 
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
});

export default LeaderboardScreen;