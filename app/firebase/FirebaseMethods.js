import Firebase from '../firebase/Firebase';
import "firebase/firestore";
import {Alert} from "react-native";
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'


const db = Firebase.firestore();

//Sign up
export async function registration(email, password, name, username, uri) {
  await Firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(Alert.alert("Account successfully created!"))
    .catch(e => Alert.alert(e.message));
  const currentUser = Firebase.auth().currentUser;

  await db.collection("users")
    .doc(currentUser.uid)
    .set({
      email: currentUser.email,
      name: name,
      username: username,
      forecourtOwner: false,
      points: 0,
      id: currentUser.uid
    });
}

//Delete account
export async function deleteAccount() {
  const user = firebase.auth().currentUser;
  
  await db.collection('users').doc(user.uid).delete()

  user.delete().then(function() {
    Alert.alert("Account deleted")
  }).catch(function(error) {
    Alert.alert(error.message)
  });

}

//Sign in
export async function signIn(email, password) {
  try {
   await Firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

//Sign out
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

//Trigger reset password email
export async function resetPassword(email) {
  Firebase.auth().sendPasswordResetEmail(email)
    .then(() => Alert.alert("Password reset email has been sent!"))
    .catch((error) => Alert.alert(error.message))
}

//When user submits a petrol price report
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

//When a user updates amenities
export async function updateAmenities(id, amenitiesObj) {
  const currentUser = Firebase.auth().currentUser.uid;
  let username;

  await db.collection('users').doc(currentUser).get()
    .then(querySnapshot => {
      username = querySnapshot.data().username;
  })

  let obj = {
    amenities: amenitiesObj,
    user: username,
    timestamp: Date.now()
  }

  await db.collection('forecourts').doc(id).update({
    currAmenities: obj,
    amenities: firebase.firestore.FieldValue.arrayUnion(obj)
  })
  .then(addPoints(10, currentUser))
}

//When user submits a diesel price report
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

//When a user submits a review
export async function submitReview(id, score) {
  const currentUser = Firebase.auth().currentUser.uid;
  let totalScore = 0;
  let count = 0;
  let username;
  
  await db.collection('users').doc(currentUser).get()
    .then(querySnapshot => {
      username = querySnapshot.data().username;
    })
 
  await db.collection('forecourts').doc(id).update({
        reviews: firebase.firestore.FieldValue.arrayUnion({
          rating: score,
          timestamp: Date.now(),
          user: username
        })
      })
    .catch(e => Alert.alert(e.message))
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
    .then(addPoints(10, currentUser))
}

//Adds points to user's profile
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