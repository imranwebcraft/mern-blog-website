import { forwardRef, useContext, useRef } from 'react';
import AnimationWraper from '../common/page-animation';
import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // for password

const UserAuthForm = ({ type }) => {
	const authForm = useRef();
	const { userAuth, setUserAuth } = useContext(UserContext);
	const navigate = useNavigate();

	const userAuthThroughServer = (serverRoute, formData) => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then((res) => {
				console.log(res.data);
				// if ((res.data.status = 'Incorrect Password')) {
				// 	return toast.error('Incorrect Password');
				// }
				storeInSession('user', JSON.stringify(res.data));
				setUserAuth(res.data);
				navigate('/');
			})
			.catch((err) => {
				toast.error(err.response.data.message);
			});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const serverRoute = type == 'signin' ? '/signin' : '/signup';

		const form = new FormData(authForm.current);
		// Get form data in an object
		let formData = {};
		// ES6
		// form.forEach((value, key) => {
		// 	formData[key] = value;
		// });

		// Regular JS
		for (let [key, value] of form) {
			formData[key] = value;
		}

		const { fullname, email, password } = formData;
		// Validation

		if (type == 'signup') {
			if (fullname.length < 3) {
				return toast.error('full name must be at least 3 characters');
			}
		}
		if (!email.length) {
			return toast.error('Please provide an email address');
		}
		if (!emailRegex.test(email)) {
			return toast.error('Invalid Email');
		}
		if (!passwordRegex.test(password)) {
			return toast.error(
				'Password must be at least 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letter.'
			);
		}
		userAuthThroughServer(serverRoute, formData);
	};

	const handleGoogleAuth = (e) => {
		e.preventDefault();
		authWithGoogle()
			.then((user) => {
				let serverRoute = '/google-auth';
				const formData = { access_token: user.accessToken };
				userAuthThroughServer(serverRoute, formData);
			})
			.catch((err) => {
				console.log('Something went wrong');
			});
	};

	return (
		<AnimationWraper keyValue={type}>
			<section className="h-cover flex justify-center items-center">
				<form ref={authForm} className="w-[80%] max-w-[400px]">
					{/* Form Heading */}
					<h1 className=" text-4xl font-gelasio capitalize text-center mb-24">
						{type == 'signin' ? 'Welcome Back' : 'Join Us Today'}
					</h1>
					{/* Actual Form */}
					{type != 'signin' ? (
						<InputBox
							name="fullname"
							type="text"
							placeholder="fullname"
							id="fullname"
							icon="fi-rr-user"
						/>
					) : (
						''
					)}
					<InputBox
						name="email"
						placeholder="email"
						type="email"
						id="email"
						icon="fi-rr-envelope"
					></InputBox>
					<InputBox
						name="password"
						placeholder="password"
						type="password"
						id="password"
						icon="fi-rr-lock"
					></InputBox>
					<button
						onClick={handleSubmit}
						type="submit"
						className="btn-dark center mt-14"
					>
						{type == 'signup' ? 'Sign Up' : 'Sign In'}
					</button>

					<div className="relative w-[100%] flex items-center gap-2 my-12 opacity-20 uppercase text-black">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>

					<button
						onClick={handleGoogleAuth}
						className="btn-dark center flex items-center justify-center gap-2 w-[90%]"
					>
						<img src={googleIcon} alt="googleIcon" className="w-5" />
						Continue with google
					</button>

					{type == 'signup' ? (
						<p className=" text-dark-grey mt-6 text-center">
							Already have an account?
							<Link to="/signin" className=" text-black text-xl underline ml-1">
								Sign In
							</Link>
						</p>
					) : (
						<p className=" text-dark-grey mt-6 text-center">
							Don't have an account?
							<Link to="/signup" className=" text-black text-xl underline ml-1">
								Join Us Today
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWraper>
	);
};

export default UserAuthForm;
