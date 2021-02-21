import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Colors } from '../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

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
                    source={require('../assets/logo.png')} 
                    style={styles.logo}
                    resizeMode="stretch"
                />
                <Text style={styles.textHeader}>Fuelr</Text>
            </Animatable.View>
            <Animatable.View 
                style={styles.footer}
                animation="fadeInUpBig"
            >
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
            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGreen
    },

    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textHeader: {
        fontSize: 50,
        fontWeight: 'bold',
        color: Colors.green,
        marginTop: 10
    },

    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },

    logo: {
        width: height_logo,
        height: height_logo
    },

    title: {
        color: Colors.green,
        fontSize: 30,
        fontWeight: 'bold'
    },

    text: {
        color: 'grey',
        marginTop: 5,
        fontSize: 20
    },

    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },

    signIn: {
        width: 150,
        height: 40,
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