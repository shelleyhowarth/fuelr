import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';

const db = Firebase.firestore();

const ForecourtScreen = ({route, navigation}) => {

    const [geohash, setGeohash] = useState(route.params);
    const [forecourt, loading, error] = useDocumentDataOnce(db.collection('forecourts').where("geohash", "==", route.params.marker));

    useEffect(() => {
            console.log(forecourt);
            console.log(error);
            console.log(loading);
    }, [forecourt])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    console.log("pressed")
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