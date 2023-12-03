// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCYtz0ifl3Eh-B_zSoOz1jXmLLmEYVbc1o',
	authDomain: 'chessfight-5257b.firebaseapp.com',
	projectId: 'chessfight-5257b',
	storageBucket: 'chessfight-5257b.appspot.com',
	messagingSenderId: '209197342648',
	appId: '1:209197342648:web:6cc69043fa5a956c0db94d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const firestore = getFirestore(auth);

export { auth, app };
