import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';


const TrendsScreen = () => {
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

export default TrendsScreen;