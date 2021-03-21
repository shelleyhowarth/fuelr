import Firebase from '../firebase/Firebase';
import "firebase/firestore";
import {Alert} from "react-native";
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'
import 'firebase/firestore';


const db = Firebase.firestore();

export async function registration(email, password, name, username) {
  try {
    await Firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = Firebase.auth().currentUser;

    db.collection("users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        name: name,
        username: username,
        forecourtOwner: false
      });
      Alert.alert("Account successfully created")
  } catch (err) {
    Alert.alert("An error occured", err.message);
  }
}

export async function signIn(email, password) {
  try {
   await Firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
      Alert.alert("Successful sign in")
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function signOut() {
  try {
    await Firebase.auth().signOut();
    if(Firebase.auth().currentUser) {
    }
    Alert.alert("Signed out")
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function checkUsernames(username, usernameTaken) {
  try {
      await db.collection("users").get()
      .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
              if(doc.data().username == username) {
                  Alert.alert("Taken");
                  usernameTaken = true;
              }
          })
      })
  } catch(e) {
      console.log(e);
  }
}

export async function forecourtInputChange(value)  {
  eircode += "+ire";

  await Geocoder.from(eircode)
    .then(json => {
        var lat = json.results[0].geometry.location.lat;
        var lng = json.results[0].geometry.location.lng;

        db.collection('forecourts').get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
              if(lat === doc.data().latitude && lng === doc.data().longitude) {
                setForecourtExists(true);
              }
            });
          });
    })
    .catch(error => console.warn(error));
}

export async function getForecourt(lng, lat) {
  let obj = {}
  await db.collection('forecourts').get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        if(lat === doc.data().latitude && lng === doc.data().longitude) {
          console.log(doc.data())
          obj = doc.data();
        }
      })
    })
  
  return obj;
}

export async function updateForecourts() {
  let obj = {}
  await db.collection('forecourts').get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
          obj = {
            ...doc.data(),
            id: doc.id
          }
          doc.ref.update(obj);
        })
      });
}

export async function updatePetrolPrice(id, priceInput) {
  await db.collection('forecourts').doc(id).update({
    currPetrol: {
      price: priceInput,
      timestamp: Date.now(),
      user: 'shelleyhowarth'
    },
    petrol: firebase.firestore.FieldValue.arrayUnion({
      price: priceInput,
      timestamp: Date.now(),
      user: 'shelleyhowarth'
    })
  });

}

export async function updateDieselPrice(id, priceInput) {
  await db.collection('forecourts').doc(id).update({
    currDiesel: {
      price: priceInput,
      timestamp: Date.now(),
      user: 'shelleyhowarth'
    },
    diesel: firebase.firestore.FieldValue.arrayUnion({
      price: priceInput,
      timestamp: Date.now(),
      user: 'shelleyhowarth'
    })
  });
}

export async function submitReview(id, score) {
  /*
  await db.collection('forecourts').doc(id).update({
    reviews: firebase.firestore.FieldValue.arrayUnion({
      rating: score,
      timestamp: Date.now(),
      user: 'shelleyhowarth'
    })
  });
  */
  let totalScore = 0;
  let count = 0;
  await db.collection('forecourts').doc(id).get()
    .then(querySnapshot => {
      querySnapshot.data().reviews.map((reviews, index) => {
        totalScore += reviews.rating;
        count++;
      });
      totalScore = totalScore/count;
      querySnapshot.ref.update({
        ratingScore: totalScore
      })
    });
}

export async function getAllForecourts() {
  await db.collection('forecourts').onSnapshot( (snapshot) => {
    let markers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Promise.all(markers);
  });
}
