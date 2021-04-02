
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { submitReview } from '../../../firebase/FirebaseMethods';
import { AirbnbRating } from 'react-native-ratings';
import { Colors } from '../../../../styles/Colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 

export const SecondRoute = ({forecourt}) => {
    //States
    const [rating, setRating] = useState();

    if(forecourt) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
                <View style={styles.middle}>
                    <Text style={styles.title}>What would you rate this forecourt?</Text>
                    {!rating ? 
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
                    : 
                        <Text style={styles.title}>Submitted!</Text> 
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
        marginTop: hp('10.0%'),
        height: hp('30.0%'),
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    title: {
        color: Colors.green,
        fontSize: wp('5.0%'),
        fontWeight: 'bold'
    }
})