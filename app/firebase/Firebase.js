import * as firebase from 'firebase';

firebaseConfig = {
    apiKey: "AIzaSyCF3fMACz3A1SYhaSg2yehXGFchNGPvjvc",
    authDomain: "fuelr-22721.firebaseapp.com",
    databaseURL: "https://fuelr-22721.firebaseio.com",
    projectId: "fuelr-22721",
    storageBucket: "fuelr-22721.appspot.com",
    messagingSenderId: "458991083503",
    appId: "1:458991083503:web:d5bfe178f415b6d95fa01a",
    measurementId: "G-NN5W4SSTBC"
}

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;