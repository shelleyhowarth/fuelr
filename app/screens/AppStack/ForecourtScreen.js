import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar} from 'react-native';
import { submitReview, updatePetrolPrice, updateDieselPrice } from '../../firebase/FirebaseMethods';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { TextInput } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { TabView, SceneMap } from 'react-native-tab-view';
import moment from 'moment';
import { Colors } from '../../../styles/Colors';
import { LineChart } from "react-native-chart-kit";

const ForecourtScreen = ({route, navigation}) => {
    const db = Firebase.firestore();
    const [forecourt, loading, error] = useDocumentDataOnce(db.collection('forecourts').doc(route.params.id));

    //States
    const [petrolPrice, setPetrolPrice] = useState();
    const [dieselPrice, setDieselPrice] = useState();
    const [elapsedTime, setElapsedTime] = useState();
    const [rating, setRating] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'price', title: 'price' },
      { key: 'review', title: 'review' },
      { key: 'trends', title: 'trends'}
    ]);
    const [data, setData] = useState();

    //Other variables
    const layout = useWindowDimensions();
    let petrolInput;
    let dieselInput;
    let petrolData = [];
    let petrolTimes = [];
    const chartConfig = {
        backgroundGradientFrom: Colors.midGreen,
        backgroundGradientTo: Colors.midGreen,
        color: ( opacity = 1 ) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5
    }

    useEffect(() => {
        if(!loading) {
            setElapsedTime(moment.utc(forecourt.currPetrol.timestamp).local().startOf('seconds').fromNow());
            forecourt.petrol.map((val, index) => {
                //console.log(val);
                petrolData.push(val.price);
                petrolTimes.push(moment(val.timestamp).format('MMM Do'));
            });

            setData({
                labels: petrolTimes,
                datasets: [
                  {
                    data: petrolData,
                    strokeWidth: 2 // optional
                  }
                ],
              });

        }
    }, [forecourt])

    const onPetrolSubmit = () => {
        if(Math.abs(forecourt.currPetrol.price - petrolInput) >= 5) {
            Alert.alert(
                "Warning",
                `This is a significant increase/decrease from the current price (${forecourt.currPetrol.price}) - are you sure it's correct?`,
                [
                  {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => {
                    setPetrolPrice(petrolInput);
                    updatePetrolPrice(forecourt.id, petrolInput);
                  }}
                ]
              );
        }
    }

    const onDieselSubmit = () => {
        if(Math.abs(forecourt.currDiesel.price - dieselInput) >= 5) {
            Alert.alert(
                "Warning",
                `This is a significant increase/decrease from the current price (${forecourt.currDiesel.price}) - are you sure it's correct?`,
                [
                  {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => {
                    setPetrolPrice(dieselInput);
                    updatePetrolPrice(forecourt.id, dieselInput);
                  }}
                ]
              );
        }
    }

    const FirstRoute = () => (
        <View style={{ flex: 1, backgroundColor: Colors.lightGreen,}} >
            <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text
                        style={styles.title}
                    >Go Back</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                onChangeText={val => petrolInput = val}
                keyboardType='numeric'
            />
            <TouchableOpacity
                onPress={() => onPetrolSubmit()}
            >
                <Text
                    style={styles.title}
                >Update petrol price
                </Text>
            </TouchableOpacity>
            {!loading? 
                <View>
                    <Text>Updated: {elapsedTime}</Text>
                    <Text>Updated by: {forecourt.currPetrol.user}</Text>
                    <Text>{forecourt.address}</Text>
                </View>
            : null}

            <TextInput
                style={styles.input}
                onChangeText={val => dieselInput = val}
                keyboardType='numeric'
            />
            <TouchableOpacity
                onPress={() => onDieselSubmit}
            >
                <Text
                    style={styles.title}
                >Update diesel price</Text>
            </TouchableOpacity>
        </View>
    );

    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
            {rating ? 
                <Text>Submitted</Text>
            : 
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Excellent"]}
                    defaultRating={1}
                    onFinishRating={ (val) => {
                        setTimeout(() => {  
                            setRating(val);
                            submitReview(forecourt.id, val); 
                        }, 1000);
                        
                    }}
                />
            }
            <StatusBar backgroundColor={Colors.green} barStyle="dark-content"/>

        </View>
    );

    const ThirdRoute = () => (
        <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
            { data ? 
                <LineChart
                    data={data}
                    width={layout.width}
                    height={220}
                    chartConfig={chartConfig}
                />
            : null}
        </View>
    );

    const renderScene = SceneMap({
        price: FirstRoute,
        review: SecondRoute,
        trends: ThirdRoute
    });


    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width, height: layout.height }}
            style={styles.tab}
        />
        
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
    tab: {
        marginTop: '10%',
        color: Colors.lightGreen
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5
    }
});

export default ForecourtScreen;