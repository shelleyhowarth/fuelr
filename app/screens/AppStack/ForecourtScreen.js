import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { TextInput } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import moment from 'moment';
import { Colors } from '../../../styles/Colors';
import { LineChart } from "react-native-chart-kit";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from '../../components/StarRating';
import { FirstRoute } from './Tabs/FirstRoute';
import { SecondRoute } from './Tabs/SecondRoute';
import { ThirdRoute } from './Tabs/ThirdRoute';


const ForecourtScreen = ({route, navigation}) => {
    //Consts
    const db = Firebase.firestore();
    const [forecourt, loading, error] = useDocumentData(
        db.collection('forecourts').doc(route.params.id),
        {
            snapshotListenOptions: { includeMetadataChanges: true},
        }
    );
    const currentUser = Firebase.auth().currentUser;
    const layout = useWindowDimensions();


    //States
    const [spinner, setSpinner] = useState(true);
    const [rating, setRating] = useState(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'price', title: 'price' },
      { key: 'review', title: 'review' },
      { key: 'trends', title: 'trends'}
    ]);
    const [data, setData] = useState();

    //Other variables
    let petrolData = [];
    let petrolTimes = [];
    let dieselData = [];
    let dieselTimes = [];
    const chartConfig = {
        backgroundGradientFrom: Colors.midGreen,
        backgroundGradientTo: Colors.midGreen,
        color: ( opacity = 1 ) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5
    }

    useEffect(() => {
        if(!loading) {
            forecourt.petrol.map((val, index) => {
                petrolData.push(val.price);
                petrolTimes.push(moment(val.timestamp).format('MMM Do'));
            });

            forecourt.diesel.map((val, index) => {
                dieselData.push(val.price);
                dieselTimes.push(moment(val.timestamp).format('MMM Do'));
            });

            if(forecourt.petrol.length > 1) {
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
            setSpinner(false);
        }
    }, [forecourt])

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


    const renderScene = ({route}) => {
        switch (route.key) {
            case 'price':
                if(forecourt) {
                    return <FirstRoute forecourt={forecourt} navigation={navigation}/>;
                } else {
                    return <Spinner
                                visible={spinner}
                                textContent={'Loading...'}
                                textStyle={styles.spinnerTextStyle}
                            />
                }
            case 'review':
                if(forecourt) {
                    return <SecondRoute forecourt={forecourt} />;
                } else {
                    return <Spinner
                                visible={spinner}
                                textContent={'Loading...'}
                                textStyle={styles.spinnerTextStyle}
                            />
                }
            default:
                return null;
        };
    }


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
    tab: {
        marginTop: '10%',
        color: Colors.lightGreen
    }
});

export default ForecourtScreen;