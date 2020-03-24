import Firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBUJcDErch9h-kV1Yyw-umdYo8ZV72e910",
    authDomain: "aloneapp-d893b.firebaseapp.com",
    databaseURL: "https://aloneapp-d893b.firebaseio.com",
    projectId: "aloneapp-d893b",
    storageBucket: "aloneapp-d893b.appspot.com",
    messagingSenderId: "510155392667",
    appId: "1:510155392667:web:f55e8fbb2fccc7e9afa83e"
};

const appConfig = Firebase.initializeApp(firebaseConfig);
export const db = appConfig.database();
export const auth = Firebase.auth();
export const time = Firebase.database.ServerValue.TIMESTAMP
