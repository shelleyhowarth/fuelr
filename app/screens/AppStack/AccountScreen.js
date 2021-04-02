import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, WebView} from 'react-native';
import { signOut, listFiles } from '../../firebase/FirebaseMethods'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase'
import Firebase from '../../firebase/Firebase'


const AccountScreen = () => {
    //Consts
    const db = Firebase.firestore();
    const currentUser = Firebase.auth().currentUser;

    //States
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
    
    const [reviewCount, setReviewCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);
    const [username, setUsername] = useState();

    //UseEffect
    useEffect( () => {
        console.log(currentUser.uid);
        
        if(user) {
            setUsername(user.username);
            console.log(username);
        }
        
        if(forecourts) {
            console.log(forecourts[0]);
        }
    }, [username, forecourts])

    //Return
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => signOut()}
            >
                <Text>Sign out</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
});

export default AccountScreen;
