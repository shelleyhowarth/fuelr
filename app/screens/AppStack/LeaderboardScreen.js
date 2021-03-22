import React, { useEffect } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';
import Leaderboard from 'react-native-leaderboard';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';

const db = Firebase.firestore();

const LeaderboardScreen = () => {
    const [users, loading, error] = useCollectionDataOnce(db.collection('users'));

    useEffect ( () => {
        if(!loading) {
            console.log(users);
        }
    })

    return (
        <View style={styles.container}>
            <Leaderboard 
                data={users} 
                sortBy='points' 
                labelBy='username'
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20
    }
});

export default LeaderboardScreen;