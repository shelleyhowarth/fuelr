import React, { useEffect, useState, useRef } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, WebView, Alert, StatusBar} from 'react-native';
import { signOut, listFiles, submitFeedback, deleteAccount } from '../../firebase/FirebaseMethods'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 

const AccountScreen = () => {
    //Consts
    const db = Firebase.firestore();
    const currentUser = Firebase.auth().currentUser;

    //States
    const [reportCount, setReportCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [forecourts, loadingForecourts, errorForecourts] = useCollectionData(
        db.collection('forecourts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );
    const [user, loadingUser, errorUser] = useDocumentData(
        db.collection('users').doc(currentUser.uid),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );
    //const textInputRef = useRef();

    //let feedback = "";
    let reportCountTemp = 0;
    let reviewCountTemp = 0;


    //UseEffect
    useEffect( () => {
        if(forecourts && user) {
            counter();
        }

    }, [forecourts, user, reportCount, reviewCount])

    //Methods
    const counter = () => {
            forecourts.forEach((forecourt) => {
                forecourt.petrol.forEach((obj)=> {
                    if(obj.user === user.username) {
                        reportCountTemp++;
                    }
                })
    
                forecourt.diesel.forEach((obj)=> {
                    if(obj.user === user.username) {
                        reportCountTemp++;
                    }
                })
            })
    
            setReportCount(reportCountTemp);
    
            forecourts.forEach((forecourt) => {
                forecourt.reviews.forEach((obj)=> {
                    if(obj.user === user.username) {
                        reviewCountTemp++;
                    }
                })
            })
            setReviewCount(reviewCountTemp);
    }

    //Return
    return (
        <View style={styles.container}>
            {/*
            <Text style={styles.title}>Feedback</Text>
            <TextInput
                style={styles.input}
                multiline={true}
                onChangeText={(val) => feedback = val}
                //value={feedback}
                //ref={textInputRef}
            />
            <TouchableOpacity onPress={() => submitFeedback()}>
                <LinearGradient
                    colors={[Colors.midGreen, Colors.green]}
                    style={styles.confirm}
                >
                    <Text style={styles.reportPrice}>Submit Feedback</Text>
                </LinearGradient>
            </TouchableOpacity>
            */}
            <View style={styles.middle}>
                {user ? 
                    <View styles={{width: '100%', height: '100%', justifyContent: 'space-evenly'}}>
                        <Text style={styles.title}>{user.username}</Text>
                        <Text style={styles.info}>Name: {user.name}</Text>
                        <Text style={styles.info}>Email: {user.email}</Text>
                        <Text style={styles.info}>Points: {user.points}</Text>

                    </View>
                : null}
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.middleHalf}>
                    {user ? 
                        <View styles={{width: '100%', height: '100%', justifyContent: 'space-evenly'}}>
                            <Text style={styles.title}>Reviews</Text>
                            <Text style={styles.titleInfo}>{reviewCount}</Text>
                        </View>
                    : null}
                </View>
                <View style={{padding: wp('2.0%')}}></View>
                <View style={styles.middleHalf}>
                    {user ? 
                        <View styles={{width: '100%', height: '100%', justifyContent: 'space-evenly'}}>
                            <Text style={styles.title}>Prices</Text>
                            <Text style={styles.titleInfo}>{reportCount}</Text>
                        </View>
                    : null}
                </View>
            </View>

            <TouchableOpacity onPress={() => signOut()}>
                <LinearGradient
                    colors={[Colors.midGreen, Colors.green]}
                    style={styles.confirm}
                >
                    <Text style={styles.reportPrice}>Sign Out</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                Alert.alert(
                "Warning",
                `Are you sure you want to delete your account? This action cannot be undone.`,
                [
                  {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => {
                    deleteAccount();
                  }}
                ]
              )}
              }>
                <LinearGradient
                    colors={['red', 'red']}
                    style={styles.confirm}
                >
                    <Text style={styles.reportPrice}>Delete Account</Text>
                </LinearGradient>
            </TouchableOpacity>
            <StatusBar backgroundColor={'white'} barStyle="dark-content"/>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.lightGreen,
      alignItems: 'center',
      //justifyContent: 'center',
    },
    confirm: {
        width: wp('90%'),
        height: hp('10.0%'),
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('5.0%'),
        justifyContent: 'center',
        marginVertical: wp('5.0%')
    },
    reportPrice: {
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: wp('4.5%'),
    },
    input: {
        width: wp('75.0%'),
        height: hp('35.0%'),
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: Colors.green,
        marginBottom: hp('2.0%')
    },
    title: {
        color: Colors.green,
        fontSize: wp('10.0%'),
        fontWeight: 'bold'
    },
    titleInfo: {
        color: 'grey',
        fontSize: wp('15.0%'),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    info: {
        color: 'grey',
        fontSize: wp('5.0%')
    },
    middle: {
        marginTop: hp('5.0%'),
        height: hp('20.0%'),
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        //alignItems: 'center',
    },
    middleHalf: {
        marginTop: hp('5.0%'),
        height: hp('20.0%'),
        width: '45%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        alignItems: 'center',
    },
});

export default AccountScreen;
