import React, { useEffect, useState, useRef } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, WebView} from 'react-native';
import { signOut, listFiles, submitFeedback } from '../../firebase/FirebaseMethods'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 
import { TextInput } from 'react-native';

const AccountScreen = () => {
    //Consts
    const db = Firebase.firestore();
    const currentUser = Firebase.auth().currentUser;

    //States
    const [reviewCount, setReviewCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);
    const [username, setUsername] = useState();
    //const textInputRef = useRef();

    let feedback = "";

    //UseEffect

    //Methods
    const submitFeedback = () => {
        //textInputRef.current.clear();
        console.log("feedback: " + feedback.length);
        submitFeedback(feedback);
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
            <TouchableOpacity onPress={() => signOut()}>
                <LinearGradient
                    colors={[Colors.midGreen, Colors.green]}
                    style={styles.confirm}
                >
                    <Text style={styles.reportPrice}>Sign Out</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirm: {
        width: wp('30.0%'),
        height: hp('10.0%'),
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.green,
        fontSize: wp('5.0%'),
        justifyContent: 'center',
        marginBottom: wp('1.0%')
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
        fontSize: wp('5.0%'),
        fontWeight: 'bold'
    }
});

export default AccountScreen;
