import logo from '../imgs/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className="navbar relative">
			<Link to="/" className="w-10 flex-none">
				<img src={logo} alt="website logo" className="w-full" />
			</Link>
			<div className="absolute md:relative md:block top-full left-0 md:inset-0 w-full md:w-auto border-b md:border-0 border-grey mt-0.5 md:mt-0 py-4 px-[5vw] md:px-0">
				<input
					type="text"
					placeholder="Search"
					className="w-full md:w-auto bg-grey p-4 pl-6 md:pl-12 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey"
				/>
				<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
			</div>
		</nav>
	);
};

export default Navbar;
