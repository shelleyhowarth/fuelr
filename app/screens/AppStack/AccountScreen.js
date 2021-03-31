import React, { useEffect } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, WebView} from 'react-native';
import { signOut, listFiles } from '../../firebase/FirebaseMethods';

const AccountScreen = () => {

    useEffect( () => {
        
    }, [])

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
