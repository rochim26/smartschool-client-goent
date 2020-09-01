// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.19.1/firebase-analytics.js"></script>

// <script>
// Your web app's Firebase configuration
import firebaseApp from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCpV9ZGHrdQmhZ0kBDixKzkjci6h7Zibd4",
  authDomain: "smartschool-ad6d1.firebaseapp.com",
  databaseURL: "https://smartschool-ad6d1.firebaseio.com",
  projectId: "smartschool-ad6d1",
  storageBucket: "smartschool-ad6d1.appspot.com",
  messagingSenderId: "765375879976",
  appId: "1:765375879976:web:c2e5dbc2d56e846e144e1d",
  measurementId: "G-ZDXNCKGF6H",
};
// Initialize Firebase
if (!firebaseApp.apps.length) {
  firebaseApp.initializeApp(firebaseConfig);
}

export default firebaseApp;
// </script>
