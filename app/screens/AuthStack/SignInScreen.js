import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, TextInput, StatusBar } from 'react-native';
import { Colors } from '../../../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import { signIn } from '../../firebase/FirebaseMethods';
import * as firebase from 'firebase';



const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        email: '',
        passowrd: '',
        handleEmailChange: false,
        secureTextEntry: true
    });

    const textInputChange = (value) => {
        if(value.length !== 0 ) {
            setData({
                ...data,
                email: value,
                handleEmailChange: true
            });
        } else {
            setData({
                ...data,
                email: value,
                handleEmailChange: false
            });
        }
    }

    const handlePasswordChange = (value) => {
        setData({
            ...data,
            password: value,
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry

        });
    }

    useEffect(
        () => {
         firebase.auth().onAuthStateChanged((user) => {
           if (user) {
             navigation.replace('Home');
           }
         });
       }
     );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.green} barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.textHeader}>Welcome!</Text>
            </View>
            <Animatable.View 
                style={styles.footer}
                animation="fadeInUpBig"
            >
                <Text style={styles.textFooter}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={Colors.green}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your email address"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText = {(value) => textInputChange(value)}
                    />
                    {data.handleEmailChange ? 
                    <Animatable.View
                        animation="bounceIn"
                    >
                        <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                        />
                    </Animatable.View>
                    : null}
                </View>
                <Text style={[styles.textFooter, {
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={Colors.green}
                        size={20}
                    />      
                    <TextInput
                        placeholder="Your password"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText = {(value) => handlePasswordChange(value)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                        <Feather
                            name="eye-off"
                            color="grey"
                            size={20}
                        />
                        :
                        <Feather
                            name="eye"
                            color="grey"
                            size={20}
                        />                      
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={() => signIn(data.email, data.password)}
                        style={styles.signUp}
                    >
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Sign in</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={styles.signUp}
                    >
                        <Text style={[styles.textSign, {color: Colors.green}]}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.green
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 30
    },

    textHeader: {
        color: Colors.lightGreen,
        fontWeight: 'bold',
        fontSize: 30
    },

    textFooter: {
        color: 'grey',
        fontSize: 18
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5
    },

    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a"
    },

    button: {
        alignItems: 'center',
        marginTop: 50
    },

    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderRadius:  10,
        flexDirection: 'row',
        alignItems: 'center'
    },

    textSign: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.lightGreen
    },

    signUp: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderRadius:  10,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.green,
        borderWidth: 1,
        marginTop: 15
    }
});