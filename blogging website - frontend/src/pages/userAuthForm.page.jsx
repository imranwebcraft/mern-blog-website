import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import { Link } from 'react-router-dom';

const UserAuthForm = ({ type }) => {
	return (
		<section className="h-cover flex justify-center items-center">
			<form className="w-[80%] max-w-[400px]">
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
				<button className="btn-dark center mt-14">
					{type == 'signup' ? 'Sign Up' : 'Sign In'}
				</button>

				<div className="relative w-[100%] flex items-center gap-2 my-12 opacity-20 uppercase text-black">
					<hr className="w-1/2 border-black" />
					<p>or</p>
					<hr className="w-1/2 border-black" />
				</div>

				<button className="btn-dark center flex items-center justify-center gap-2 w-[90%]">
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
							Sign Up
						</Link>
					</p>
				)}
			</form>
		</section>
	);
};

export default UserAuthForm;
