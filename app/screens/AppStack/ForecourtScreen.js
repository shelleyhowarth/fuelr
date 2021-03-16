import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { signOut } from '../../firebase/FirebaseMethods';
import { getForecourt } from '../../firebase/FirebaseMethods';


const ForecourtScreen = ({route, navigation}) => {

    const [coordinate, setCoordinate] = useState(route.params);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [forecourt, setForecourt] = useState(null);

    useEffect(() => {
        setLongitude(coordinate.longitude);
        setLatitude(coordinate.latitude);
        //handleForecourt(longitude, latitude);
    })

    const handleForecourt = async(lng, lat) => {
        await setForecourt(getForecourt(lng, lat));
        console.log("forecourt" + forecourt);
    }
    
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