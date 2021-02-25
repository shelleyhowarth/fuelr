import Firebase from '../firebase/Firebase';
import "firebase/firestore";
import {Alert} from "react-native";

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
        username: username
      });
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

export async function loggingOut() {
  try {
    await Firebase.auth().signOut();
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