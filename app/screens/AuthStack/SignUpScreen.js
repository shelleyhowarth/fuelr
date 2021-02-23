import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, TextInput, StatusBar } from 'react-native';
import { Colors } from '../../../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';


const SignUpScreen = ({navigation}) => {
    const [data, setData] = React.useState({
        name: '',
        username: '',
        email: '',
        passowrd: '',
        confirmPassword: '',
        handleEmailChange: false,
        handleNameChange: false,
        handleUsernameChange: false,
        secureTextEntry: true,
        checkSecureTextEntry: true 
    });

    const emailInputChange = (value) => {
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

    const nameInputChange = (value) => {
        if(value.length !== 0 ) {
            setData({
                ...data,
                name: value,
                handleNameChange: true
            });
        } else {
            setData({
                ...data,
                name: value,
                handleNameChange: false
            });
        }
    }

    const usernameInputChange = (value) => {
        if(value.length !== 0 ) {
            setData({
                ...data,
                username: value,
                handleUsernameChange: true
            });
        } else {
            setData({
                ...data,
                username: value,
                handleUsernameChange: false
            });
        }
    }

    const handlePasswordChange = (value) => {
        setData({
            ...data,
            password: value,
        });
    }

    const handleConfirmPasswordChange = (value) => {
        setData({
            ...data,
            confirmPassword: value,
        });
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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.green} barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.textHeader}>Create an account</Text>
            </View>
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
                        onChangeText = {(value) => usernameInputChange(value)}
                    />
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
                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.signUp}
                    >
                        <LinearGradient
                            colors={[Colors.midGreen, Colors.green]}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Sign in</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
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