import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Image, TouchableOpacity, StatusBar, ScrollView, Animated } from 'react-native';
import { Colors } from '../../../styles/Colors';

import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen';

const SplashScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.lightGreen} barStyle="dark-content"/>
            <Animatable.View 
                style={styles.header}
                animation="bounceIn"
                duration={1500}
            >
                <Image 
                    source={require('../../../assets/logo.png')} 
                    style={styles.logo}
                    resizeMode="stretch"
                />
                <Text style={styles.textHeader}>Fuelr</Text>
            </Animatable.View>
            <Animated.ScrollView 
                animation="fadeInUpBig"
                style={{flex:1}}
            >
                <View style={styles.footer}>
                    <Text style={styles.title}>Getting the lowest price fuel for you!</Text>
                    <Text style={styles.text}>Sign in with account</Text>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                            <LinearGradient
                                colors={[Colors.midGreen, Colors.green]}
                                style={styles.signIn}
                            >
                                <Text style={styles.textSign}>Get Started</Text>
                                <MaterialIcons
                                    name="navigate-next"
                                    color="#fff"
                                    size={20}
                                >
                                </MaterialIcons>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

            </Animated.ScrollView>
        </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: Colors.lightGreen
    },

    textHeader: {
        fontSize: wp('10.0%'),
        fontWeight: 'bold',
        color: Colors.green,
        marginTop: 10
    },

    footer: {
        flex: 1,

        paddingVertical: wp('10.0%'),
        paddingHorizontal: wp('10.0'),
    },

    logo: {
        width: height_logo,
        height: height_logo
    },

    title: {
        color: Colors.green,
        fontSize: wp('10.0%'),
        fontWeight: 'bold'
    },

    text: {
        color: 'grey',
        marginTop: 5,
        fontSize: wp('5.0%')
    },

    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },

    signIn: {
        width: wp('45.0%'),
        height: hp('7.0%'),
        justifyContent: 'center',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }

});