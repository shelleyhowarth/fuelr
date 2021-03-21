import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, TextInput, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CheckBox } from 'react-native-elements'
import { Colors } from '../../../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import { registration } from '../../firebase/FirebaseMethods';
import Firebase from '../../firebase/Firebase';
import "firebase/firestore";
import Geocoder from 'react-native-geocoding';



const SignUpScreen = ({navigation}) => {
    const db = Firebase.firestore();
    Geocoder.init("AIzaSyAGAjEMb5VCAXaBmQistQ2kxraQm421Sq8");

    const [isSelected, setSelection] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [forecourtExists, setForecourtExists] = useState(false);


    const [data, setData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        handleEmailChange: false,
        handleNameChange: false,
        handleUsernameChange: false,
        secureTextEntry: true,
        checkSecureTextEntry: true,
        nameError: null,
        emailError: null,
        usernameError: null,
        passwordError: null,
        confirmPasswordError: null,
    });

    const emailInputChange = (value) => {
        if(value.length !== 0 ) {
            setData({
                ...data,
                email: value,
                handleEmailChange: true,
                emailError: null
            });
        } else {
            setData({
                ...data,
                email: value,
                handleEmailChange: false,
                emailError: "Email required"
            });
        }
    }

    const nameInputChange = (value) => {
        if(value.length !== 0 ) {
            setData({
                ...data,
                name: value,
                handleNameChange: true,
                nameError: null
            });
        } else {
            setData({
                ...data,
                name: value,
                handleNameChange: false,
                nameError: "Name required"
            });
        }
    }

    const usernameInputChange = (value) => {
        setUsernameTaken(false);
        checkUsernames(value);

        if(usernameTaken === true) {
            setData({
                ...data,
                username: value,
                handleUsernameChange: false,
                usernameError: "Username taken"
            });
        } else if(value.length !== 0) {
            setData({
                ...data,
                username: value,
                handleUsernameChange: true,
                usernameError: null
            });
        } else if(!value.length) {
            setData({
                ...data,
                username: value,
                handleUsernameChange: false,
                usernameError: "Username required"
            });
        }
    }

    const handlePasswordChange = (value) => {
        if(value.length == 0) {
            setData({
                ...data,
                password: value,
                passwordError: "Password required"
            });
        } else if(value.length < 6) {
            setData({
                ...data,
                password: value,
                passwordError: "Password must be 6 characters or more"
            });
        } else if(value.length >=6) {
            setData({
                ...data,
                password: value,
                passwordError: null
            });
        }

    }

    const handleConfirmPasswordChange = (value) => {
        if(value !== data.password) {
            setData({
                ...data,
                confirmPassword: value,
                confirmPasswordError: "Passwords do not match"
            });
        } else {
            setData({
                ...data,
                confirmPassword: value,
                confirmPasswordError: null
            });
        }
    }


    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry

        });
    }

    const updateCheckSecureTextEntry = () => {
        setData({
            ...data,
            checkSecureTextEntry: !data.checkSecureTextEntry

        });
    }

    const forecourtInputChange = async(eircode) => {
        Geocoder.init("AIzaSyAGAjEMb5VCAXaBmQistQ2kxraQm421Sq8");
        eircode += "+ire";

        await Geocoder.from(eircode)
          .then(json => {
              var lat = json.results[0].geometry.location.lat;
              var lng = json.results[0].geometry.location.lng;
      
              db.collection('forecourts').get()
                .then(querySnapshot => {
                  querySnapshot.docs.forEach(doc => {
                    if(lat === doc.data().latitude && lng === doc.data().longitude) {
                      setForecourtExists(true);
                    }
                  });
                });
          })
          .catch(error => console.warn(error));
    }

    const checkUsernames = async (username) => {
        try {
            await db.collection("users").get()
            .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    if(doc.data().username == username) {
                        setUsernameTaken(true);
                    }
                })
            })
        } catch(e) {
            console.log(e);
        }
      }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.green} barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.textHeader}>Create an account</Text>
            </View>
            <KeyboardAwareScrollView>
            <Animatable.View 
                style={styles.footer}
                animation="fadeInUpBig"
            >
                <Text style={styles.textFooter}>Full name</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={Colors.green}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your name"
                        style={styles.textInput}
                        autoCapitalize="words"
                        onChangeText = {(value) => nameInputChange(value)}
                    />

                    {data.nameError ?
                        <Text style={{color: 'red'}}>{data.nameError}</Text>
                    : null}

                    {data.handleNameChange ? 
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
                    marginTop: 30
                }]}>Username</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={Colors.green}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your username"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText = {(value) => value !== '' ? usernameInputChange(value) : null}
                    />

                    {data.usernameError ? 
                    <Text style={{color: 'red'}}> {data.usernameError} </Text>
                    : null}

                    {data.handleUsernameChange ? 
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
                    marginTop: 30
                }]}>Email</Text>
                <View style={styles.action}>
                    <Feather
                        name="mail"
                        color={Colors.green}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your email address"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText = {(value) => emailInputChange(value)}
                    />

                    {data.emailError ?
                        <Text style={{color: 'red'}}>{data.emailError}</Text>
                    : null}

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
                    marginTop: 30
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

                    {data.passwordError ?
                        <Text style={{color: 'red'}}>{data.passwordError}</Text>
                    : null}

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
                <Text style={[styles.textFooter, {
                    marginTop: 30
                    }]}>Confirm Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={Colors.green}
                        size={20}
                    />      
                    <TextInput
                        placeholder="Confirm your password"
                        secureTextEntry={data.checkSecureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText = {(value) => handleConfirmPasswordChange(value)}
                    />

                    {data.confirmPasswordError ?
                        <Text style={{color: 'red'}}>{data.confirmPasswordError}</Text>
                    : null}

                    <TouchableOpacity
                        onPress={updateCheckSecureTextEntry}
                    >
                        {data.checkSecureTextEntry ?
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
                <View style={styles.checkbox}>
                    <Text style={styles.textFooter}>Are you a forecourt owner?
                    </Text>
                    <CheckBox
                        checked={isSelected}
                        onPress={ () => setSelection(!isSelected) }
                        checkedColor= {Colors.green}
                    />
                </View>
                { isSelected ?
                    <View>
                        <Text style={[styles.textFooter, {
                            marginTop: 30
                        }]}>Forecourt Eircode</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color={Colors.green}
                                size={20}
                            />
                            <TextInput
                                placeholder="Forecourt Eircode"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText = {(value) => forecourtInputChange(value)}
                            />
        
                            {data.usernameError ? 
                            <Text style={{color: 'red'}}> {data.usernameError} </Text>
                            : null}
        
                            {data.handleUsernameChange ? 
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
                    </View>

                : null}



                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={() => {
                            registration(data.email, data.password, data.name, data.username);
                        }}
                        style={styles.signUp}
                    >
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Sign up</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default SignUpScreen;

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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
    },

    checkbox: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});