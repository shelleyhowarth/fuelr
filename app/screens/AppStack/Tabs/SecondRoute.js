
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { submitReview } from '../../../firebase/FirebaseMethods';
import { AirbnbRating } from 'react-native-ratings';
import { Colors } from '../../../../styles/Colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 
import Firebase from '../../../firebase/Firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export const SecondRoute = ({forecourt}) => {
    //Consts
    const currentUser = Firebase.auth().currentUser.uid;
    const db = Firebase.firestore();

    //States
    const [rating, setRating] = useState();
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [user, loadingUser, errorUser] = useDocumentData(
        db.collection('users').doc(currentUser),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );

    //Methods
    const checkIfReviewExists = () => {
        forecourt.reviews.forEach( (review) => {
            if(review.user === user.username) {
                setAlreadyReviewed(true);
            }
        })
        console.log("Exists");
    }

    //UseEffect
    useEffect( () => {
        //Check if user has already rated forecourt
        if(user) {
            checkIfReviewExists();
        }
    }, [user, rating])
    

    //Return
    if(forecourt) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
                <View style={styles.middle}>
                    {!alreadyReviewed ? 
                        <View>
                            <Text style={styles.title}>What would you rate this forecourt?</Text>
                            <AirbnbRating
                                count={5}
                                reviews={["Terrible", "Bad", "OK", "Good", "Excellent"]}
                                defaultRating={1}
                                onFinishRating={ (val) => {
                                    setTimeout(() => {  
                                        setRating(val);
                                        submitReview(forecourt.id, val); 
                                    }, 1000);
                                    
                                }}
                            />
                        </View>
                    : 
                        <Text style={styles.title}>You have already rated this forecourt.</Text> 
                    }
                </View>
                <StatusBar backgroundColor={Colors.green} barStyle="dark-content"/>
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
        height: hp('30.0%'),
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 20

    },
    title: {
        color: Colors.green,
        fontSize: wp('5.0%'),
        fontWeight: 'bold'
    }
})