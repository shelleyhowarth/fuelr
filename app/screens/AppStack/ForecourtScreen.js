import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, useWindowDimensions, Switch, Alert, StatusBar, Image, Keyboard} from 'react-native';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Firebase from '../../firebase/Firebase';
import { TabView, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import { Colors } from '../../../styles/Colors';
import { LineChart } from "react-native-chart-kit";
import Spinner from 'react-native-loading-spinner-overlay';
import { FirstRoute } from './Tabs/FirstRoute';
import { SecondRoute } from './Tabs/SecondRoute';
import { FourthRoute } from './Tabs/FourthRoute';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from 'react-native-responsive-screen'; 

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
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'price', title: 'Overview' },
      { key: 'review', title: 'Reviews' },
      { key: 'amenities', title: 'Amenities'}
    ]);
    const [data, setData] = useState();
    const [coords, setCoords] = useState(route.params.coords);

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

    //UseEffect
    useEffect(() => {
        //Turn off loading screen when forecourt has loaded
        if(!loading) {
            setSpinner(false);
        }
    }, [forecourt])

    //Switch case for displaying each tab screen
    const renderScene = ({route}) => {
        switch (route.key) {
            case 'price':
                if(forecourt) {
                    return <FirstRoute coords={coords} forecourt={forecourt} navigation={navigation}/>;
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
            case 'amenities':
                if(forecourt) {
                    return <FourthRoute forecourt={forecourt} />
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
            renderTabBar = { (props) => (
                <TabBar
                {...props}
                renderLabel={({ route, color }) => (
                  <Text style={{ color: 'white', margin: 8 }}>
                    {route.title}
                  </Text>
                )}
                style={{backgroundColor: Colors.green, paddingTop: Platform.OS === 'ios' ? hp('3.0%') : null}}
              />
            )}
        />
        
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