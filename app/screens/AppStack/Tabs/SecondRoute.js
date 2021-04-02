
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { submitReview } from '../../../firebase/FirebaseMethods';
import { AirbnbRating } from 'react-native-ratings';
import { Colors } from '../../../../styles/Colors';

export const SecondRoute = ({forecourt}) => {
    //States
    const [rating, setRating] = useState(null);

    if(forecourt) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
                {rating ? 
                    <Text>Submitted</Text>
                : 
                <View style={styles.middle}>
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
                }
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
        height: '10%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 4},
        shadowOpacity: 0.2,
        alignItems: 'center'
    },
})