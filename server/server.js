import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// Schema below
import User from './Schema/User.js';

// Firebase admin
import serviceAccount from './react-blog-website-1b700-firebase-adminsdk-rv7hd-63c3026a3e.json' assert { type: 'json' };
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// Port
const port = process.env.PORT || 5000;

// Server Variable
const server = express();
server.use(express.json());
server.use(cors());

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // for password

const generateUsername = async (email) => {
	let username = email.split('@')[0];
	const usernameExist = await User.exists({
		'personal_info.username': username,
	});
	return usernameExist ? username + nanoid().substring(0, 5) : username;
};

const formatDatatoSend = (user) => {
	// Create a token and send token to the frontend
	const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
	return {
		access_token: token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		fullname: user.personal_info.fullname,
	};
};

// Route
server.post('/signup', (req, res) => {
	const { fullname, email, password } = req.body;

	// Validationg data from frontend
	if (fullname.length < 3) {
		return res
			.status(403)
			.json({ message: 'full name must be at least 3 characters' });
	}
	if (!email.length) {
		return res.status(403).json({ message: 'Please provide an email address' });
	}
	if (!emailRegex.test(email)) {
		return res.status(403).json({ message: 'Invalid Email' });
	}
	if (!passwordRegex.test(password)) {
		return res.status(403).json({
			message:
				'Password must be at least 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letter.',
		});
	}

	// Encrypt the password and save user to the database
	bcrypt.hash(password, 10, async (err, hashed_password) => {
		let username = await generateUsername(email);
		const user = new User({
			personal_info: {
				fullname,
				email,
				password: hashed_password,
				username,
			},
		});

		await user
			.save()
			.then((user) => {
				return res.status(200).json(formatDatatoSend(user));
			})
			.catch((err) => {
				// Check  duplication
				if (err.code == 11000) {
					return res.status(500).json({ message: 'Email already exist' });
				}
				return res.status(500).json({ error: err.message });
			});
	});
});

server.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({
			'personal_info.email': email,
		});

		if (!user) {
			return res.status(404).json({ error: 'Email not found' });
		}

		if (!user.google_auth) {
			// Check the pass
			bcrypt.compare(password, user.personal_info.password, (err, result) => {
				if (err) {
					return res.status(403).json({
						error: 'error occur while login, please try again after sometimes',
					});
				}
				if (!result) {
					return res.status(200).json({ status: 'Incorrect Password' });
				}
				if (result) {
					return res.status(200).json(formatDatatoSend(user));
				}
			});
		} else {
			return res
				.status(200)
				.json({ error: 'Account create using google auth' });
		}
	} catch (err) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

server.post('/google-auth', async (req, res) => {
	let { access_token } = req.body;
	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodedUser) => {
			const { name, email, picture } = decodedUser;

			// Search if any user exist with this email address who sign in with email and password
			let user = await User.findOne({ 'personal_info.email': email })
				.select(
					'personal_info.fullname personal_info.username personal_info.profile_img google_auth'
				)
				.then((u) => {
					return u || null;
				})
				.catch((err) => {
					console.log(err.message);
				});

			//khuje paici + google auth false, thats mean se email pass diye account korcilo tai take email pass diye log in korte bola holo
			if (user) {
				if (!user.google_auth) {
					return res
						.status(403)
						.json({ error: 'please sign in with email and password' });
				}
				// Se fresh user, new google auth diye sign in korar chesta kortece, so go proceed
			} else {
				//Sign Up
				// Genarate a username for this user
				let username = await generateUsername(email);
				user = new User({
					personal_info: {
						fullname: name,
						email,
						username,
						profile_img: picture.replace('s96-c', 's384-c'),
					},
					google_auth: true,
				});

				user
					.save()
					.then((savedUser) => {
						user = savedUser;
					})
					.catch((err) => {
						err.message;
					});
			}
			return res.status(200).json(formatDatatoSend(user));
		})
		.catch((err) =>
			res
				.status(500)
				.json({ error: 'Unable to verify the access token by firebase' })
		);
});

server.get('/', (req, res) => {
	res.send('Hello World!');
});
// all route
server.all('*', (req, res, next) => {
	const error = new Error(
		`The requested url (${req.originalUrl}) is not available`
	);
	error.status = 404;
	next(error);
});

server.use((err, req, res, next) => {
	res.status(404).json({ error: err.message });
});

// Listen
server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Connect to the database
const main = async () => {
	await mongoose.connect(process.env.DB_LOCATION);
	console.log('Connected to the database');
};

main();
