import firebase from "firebase"

export interface DocType extends firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> {}

export interface DataType extends firebase.firestore.DocumentData {}