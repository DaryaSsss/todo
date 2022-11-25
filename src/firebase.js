// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDf2JY5urDAE1gJxBWjHszThPHtq3Htijg',
  authDomain: 'todo-edb3a.firebaseapp.com',
  projectId: 'todo-edb3a',
  storageBucket: 'todo-edb3a.appspot.com',
  messagingSenderId: '587501702911',
  appId: '1:587501702911:web:f4cb36961b64ea9a7ac6ca',
  measurementId: 'G-GLPVPYLLKH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
