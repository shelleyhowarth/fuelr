import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { updatePrice } from '../../firebase/FirebaseMethods';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { TextInput } from 'react-native-gesture-handler';

const db = Firebase.firestore();

const ForecourtScreen = ({route, navigation}) => {

    const [forecourt, loading, error] = useDocumentDataOnce(db.collection('forecourts').doc(route.params.id));
    const [price, setPrice] = useState();

    useEffect(() => {
        console.log(forecourt);
        console.log(price);
    }, [forecourt, price])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
            >
                <Text>Go Back</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
            />
            <TouchableOpacity
                onPress={() => {
                    console.log('price: ' + price)
                    console.log('forecourt' + forecourt)
                    updatePrice(forecourt.id, price)
                }}
            >
                <Text>Update Price</Text>
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
    },
    input: {
        width: '40%',
        borderWidth: 1,
      },
});

export default ForecourtScreen;