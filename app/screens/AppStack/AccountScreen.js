import React, { useEffect, useState, useRef } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, WebView, Alert, StatusBar, ScrollView} from 'react-native';
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
import AppleHeader from "react-native-apple-header";
import ColorfulCard from "react-native-colorful-card";

const AccountScreen = () => {
    //Consts
    const db = Firebase.firestore();
    const currentUser = Firebase.auth().currentUser;

    //States
    const [reportCount, setReportCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [amenityCount, setAmenityCount] = useState(0);
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

    let reportCountTemp = 0;
    let reviewCountTemp = 0;
    let amenityCountTemp = 0;


    //UseEffect
    useEffect( () => {
        if(forecourts && user) {
            counter();
        }

    }, [forecourts, user, reportCount, reviewCount, amenityCount])

    //Methods

    //Count reviews, price reports, and amenity updates
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

            forecourts.forEach((forecourt) => {
                forecourt.amenities.forEach((obj)=> {
                    if(obj.user === user.username) {
                        amenityCountTemp++;
                    }
                })
            })
            setAmenityCount(amenityCountTemp);
    }

    //Return
    return (
        <ScrollView contentContainertyle={styles.container}>
            <AppleHeader
                dateTitle={ "DASHBOARD" }
                largeTitle={ user ? user.name : null}
                containerStyle={{marginTop: hp('4.5%')}}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <ColorfulCard
                    title="Reviews Left"
                    titleTextStyle={{fontSize: wp('5.0%')}}
                    valueTextStyle={{fontSize: wp('15.0%')}}
                    value={reviewCount}
                    style={{ backgroundColor: Colors.green }}
                />
                <ColorfulCard
                    title="Price Reports"
                    titleTextStyle={{fontSize: wp('5.0%')}}
                    valueTextStyle={{fontSize: wp('15.0%')}}
                    value={reportCount}
                    style={{ backgroundColor: Colors.midGreen }}
                />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 10}}>
                <ColorfulCard
                    title="Amenity Updates"
                    titleTextStyle={{fontSize: wp('5.0%')}}
                    valueTextStyle={{fontSize: wp('15.0%')}}
                    value={amenityCount}
                    style={{ backgroundColor: Colors.midGreen }}
                />
                <ColorfulCard
                    title="Points Earned"
                    titleTextStyle={{fontSize: wp('5.0%')}}
                    valueTextStyle={{fontSize: wp('15.0%')}}
                    value={user ? user.points : null}
                    style={{ backgroundColor: Colors.green }}
                />
            </View>

            <View style={{alignItems: 'center'}}>
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
            </View>

            <StatusBar barStyle="dark-content"/>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.lightGreen,
      alignItems: 'center',
    },
    confirm: {
        width: wp('90%'),
        height: hp('10.0%'),
        borderWidth: 1,
        borderRadius: 20,
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
    middleTitle: {
        color: Colors.green,
        fontSize: wp('5.5%'),
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
        width: '100%',
        marginTop: hp('5.0%'),
        height: hp('20.0%'),
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
        flex: 3
    },
});

export default AccountScreen;
