// src/config/firebase.ts
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Signin
// Make sure this is the correct WEB client ID.
GoogleSignin.configure({
  webClientId: '12349245542-knvf25lgvdn9deviu45lmp2o1ou50r4m.apps.googleusercontent.com',
});

const firebaseAuth = getAuth();
const firestoreDb = getFirestore();

export { firebaseAuth, firestoreDb, GoogleSignin, statusCodes };
