import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCZMfiVbHtw3o98EzuqVARhLg8vP7c4o7E',
	authDomain: 'react-blog-website-1b700.firebaseapp.com',
	projectId: 'react-blog-website-1b700',
	storageBucket: 'react-blog-website-1b700.appspot.com',
	messagingSenderId: '726908227344',
	appId: '1:726908227344:web:6adecf7325677fadd81f95',
};

const app = initializeApp(firebaseConfig);

//Google auth
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export const authWithGoogle = async () => {
	let user = null;
	await signInWithPopup(auth, provider)
		.then((result) => {
			user = result.user;
			console.log(user);
		})
		.catch((error) => {
			console.log(error);
		});
	return user;
};
