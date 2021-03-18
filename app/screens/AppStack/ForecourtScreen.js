import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';

const db = Firebase.firestore();

const ForecourtScreen = ({route, navigation}) => {

    const [forecourt, loading, error] = useDocumentDataOnce(db.collection('forecourts').doc(route.params.id));

    useEffect(() => {
        console.log(forecourt);
    }, [forecourt])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <Text>Go Back</Text>
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

export default ForecourtScreen;