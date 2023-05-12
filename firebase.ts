import firebase from 'firebase'

const firebaseConfig = {
    apiKey: 'AIzaSyDtrP1ejCWrogjOM4HqqpSZ5VSYbvN_cC0',
    authDomain: 'chatapp-2-bb820.firebaseapp.com',
    projectId: 'chatapp-2-bb820',
    storageBucket: 'chatapp-2-bb820.appspot.com',
    messagingSenderId: '307406872798',
    appId: '1:307406872798:web:052951289a6f15218d224f'
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };