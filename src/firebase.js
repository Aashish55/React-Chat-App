import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'

var firebaseConfig = {
  apiKey: "AIzaSyB5vRJGbNIQePmcdmhHmEqxf-J3kOA4qyg",
  authDomain: "react-slack-clone-a0f67.firebaseapp.com",
  databaseURL: "https://react-slack-clone-a0f67.firebaseio.com",
  projectId: "react-slack-clone-a0f67",
  storageBucket: "react-slack-clone-a0f67.appspot.com",
  messagingSenderId: "546395354086",
  appId: "1:546395354086:web:3b9f13743183d21a539c27",
  measurementId: "G-TX40Z1J4ED"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

export default firebase;