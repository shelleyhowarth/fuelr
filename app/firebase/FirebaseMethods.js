import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";
import React from 'react';

const db = firebase.firestore();


export async function registration(email, password, name, username) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    console.log(currentUser.uid);

    db.collection("users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        name: name,
        username: username,
        forecourtOwner: false
      });

  } catch (err) {
    Alert.alert("An error occured", err.message);
  }
}

export async function signIn(email, password) {
  try {
   await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
      Alert.alert("Successful sign in")
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function checkUsernames(username) {
    try {
        db.collection("users").get()
        .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                if(doc.data().username == username) {
                    Alert.alert("Username already exists")
                    return false;
                }
            })
        })
        return true;
    } catch(e) {
        console.log(e);
    }
}