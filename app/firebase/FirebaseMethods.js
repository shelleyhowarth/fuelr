import Firebase from '../firebase/Firebase';
import "firebase/firestore";
import {Alert} from "react-native";
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'
import 'firebase/firestore';


const db = Firebase.firestore();

export async function registration(email, password, name, username) {
  try {
    const currentUser = Firebase.auth().currentUser;
    await Firebase.auth().createUserWithEmailAndPassword(email, password);

    db.collection("users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        name: name,
        username: username,
        forecourtOwner: false,
        points: 0,
        id: currentUser.uid
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
            amenities: {
              atm: false,
              deli: false,
              bathroom: false,
              electricCharging: false,
              payAtPump: false,
              acceptsCard: false,
              convenienceStore: false,
              carWash: false,
              airAndWater: false,
              vacuum: false,
              wifi: false,
              alcohol: false
            }
          }
          db.collection('forecourts').doc(doc.data().id).update(obj).then(console.log('success')).catch(e => console.log(e));
      })
    })
    .catch(e => console.log(e));
  }

export async function updatePetrolPrice(id, priceInput) {
  const currentUser = Firebase.auth().currentUser.uid;
  let username;

  await db.collection('users').doc(currentUser).get()
    .then(querySnapshot => {
      username = querySnapshot.data().username;
    })
    .then( async() =>   
      await db.collection('forecourts').doc(id).update({
        currPetrol: {
          price: priceInput,
          timestamp: Date.now(),
          user: username
        },
        petrol: firebase.firestore.FieldValue.arrayUnion({
          price: priceInput,
          timestamp: Date.now(),
          user: username
        })
      })
    )
    .then(addPoints(10, currentUser))
}

export async function updateDieselPrice(id, priceInput) {
  const currentUser = Firebase.auth().currentUser.uid;
  let username;

  await db.collection('users').doc(currentUser).get()
    .then(querySnapshot => {
      username = querySnapshot.data().username;
    })
    .then( async() => 
      await db.collection('forecourts').doc(id).update({
        currDiesel: {
          price: priceInput,
          timestamp: Date.now(),
          user: username
        },
        diesel: firebase.firestore.FieldValue.arrayUnion({
          price: priceInput,
          timestamp: Date.now(),
          user: username
        })
      })
    )
    .then(addPoints(10, currentUser))
}

export async function submitReview(id, score) {
  const currentUser = Firebase.auth().currentUser.uid;
  let totalScore = 0;
  let count = 0;
  let username;
  
  await db.collection('users').doc(currentUser).get()
    .then(querySnapshot => {
      username = querySnapshot.data().username;
      console.log(Date.now());
    })
 
  await db.collection('forecourts').doc(id).update({
        reviews: firebase.firestore.FieldValue.arrayUnion({
          rating: score,
          timestamp: Date.now(),
          user: username
        })
      })
    .catch(e => console.log(e))
    .then(
      await db.collection('forecourts').doc(id).get()
        .then( querySnapshot => {
          querySnapshot.data().reviews.map((reviews, index) => {
            totalScore += reviews.rating;
            count++;
          });

          totalScore = totalScore/count;

          querySnapshot.ref.update({
            ratingScore: totalScore
          })
        })
    )
    .then(addPoints(15, currentUser))
}

export async function addPoints(points, id) {
  let currentPoints;
  await db.collection('users').doc(id).get()
    .then(querySnapshot => {
      currentPoints = querySnapshot.data().points
      currentPoints += points;
    });

  await db.collection('users').doc(id).update({
    points: currentPoints
  })
    .then(Alert.alert(`Congratulations! You gained ${points} points.`));
}