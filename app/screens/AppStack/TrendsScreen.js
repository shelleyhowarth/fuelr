import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { LineChart } from "react-native-chart-kit";
import Firebase from '../../firebase/Firebase';
import { Colors } from '../../../styles/Colors';
import Spinner from 'react-native-loading-spinner-overlay';

const TrendsScreen = () => {
    const db = Firebase.firestore();

    //States
    const [twentyPetrol, loadingTwentyPetrol, errorTwentyPetrol] = useDocumentDataOnce(db.collection('national-prices').doc('20petrol'));
    const [twentyDiesel, loadingTwentyDiesel, errorTwentyDiesel] = useDocumentDataOnce(db.collection('national-prices').doc('20diesel'));
    const [twentyOnePetrol, loadingTwentyOnePetrol, errorTwentyOnePetrol] = useDocumentDataOnce(db.collection('national-prices').doc('21petrol'));
    const [twentyOneDiesel, loadingTwentyOneDiesel, errorTwentyOneDiesel] = useDocumentDataOnce(db.collection('national-prices').doc('21diesel'));
    const [data, setData] = useState();
    const [spinner, setSpinner] = useState(true);

    //Other variables
    const { width, height } = Dimensions.get("window");
    const chartConfig = {
        backgroundGradientFrom: Colors.midGreen,
        backgroundGradientTo: Colors.midGreen,
        color: ( opacity = 1 ) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5
    }

    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let dieselTwentyArr = [];
    let petrolTwentyArr = [];

    useEffect( () => {

        if(!loadingTwentyPetrol && !loadingTwentyDiesel) {
            for(let i = 0; i < months.length; i++) {

                for(let key of Object.keys(twentyPetrol)) {
                    if(key.includes(months[i])) {
                        petrolTwentyArr.push(twentyPetrol[key]);
                    }
                }

                for(let key of Object.keys(twentyDiesel)) {
                    if(key.includes(months[i])) {
                        dieselTwentyArr.push(twentyDiesel[key]);
                    }
                }
            }

            setData({
                labels: months,
                datasets: [
                    {
                        data: petrolTwentyArr,
                        strokeWidth: 2 // optional
                    },
                    {
                        data: dieselTwentyArr,
                        strokeWidth: 2
                    }
                ],
            });

            setSpinner(false);
        }


              
    }, [twentyPetrol, twentyDiesel, data])

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Getting price data...'}
                textStyle={styles.spinnerTextStyle}
            />

            { data ? 
                <LineChart
                    data={data}
                    width={width}
                    height={220}
                    chartConfig={chartConfig}
                />           
            : null}

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
    spinnerTextStyle: {
        color: '#FFF'
    },
});

export default TrendsScreen;