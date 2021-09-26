import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAlpJ9au6IS9XI4D7BOrzBHHslnLXLnZn8",
    authDomain: "letschat-75882.firebaseapp.com",
    projectId: "letschat-75882",
    storageBucket: "letschat-75882.appspot.com", 
    messagingSenderId: "13763700692",
    appId: "1:13763700692:web:ff83bec02f6683b4d49841"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = app.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {db, auth, provider};