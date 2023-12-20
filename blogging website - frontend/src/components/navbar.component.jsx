import { useContext, useState } from 'react';
import logo from '../imgs/logo.png';
import { Link, Outlet } from 'react-router-dom';
import { UserContext } from '../App';
import UserNavigation from './user-navigation.component';

const Navbar = () => {
	const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
	const [userNavPanel, setUserNavPanel] = useState(false);

	const { userAuth } = useContext(UserContext);
	const { access_token, profile_img } = userAuth;

	const handleUserNavPanelClick = () => {
		setUserNavPanel((currentValue) => !currentValue);
	};

	const handleNavPanelBlur = () => {
		setTimeout(() => {
			setUserNavPanel(false);
		}, 100);
	};

	return (
		<>
			<nav className="navbar relative">
				<Link to="/" className="w-10 flex-none">
					<img src={logo} alt="website logo" className="w-full" />
				</Link>
				<div
					className={
						'absolute md:relative md:block top-full left-0 md:inset-0 w-full md:w-auto border-b md:border-0 border-grey mt-0.5 md:mt-0 py-4 px-[5vw] md:px-0 md:show ' +
						(searchBoxVisibility ? 'show' : 'hide')
					}
				>
					<input
						type="text"
						placeholder="Search"
						className="w-full md:w-auto bg-grey p-4 pl-6 md:pl-12 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey"
					/>
					<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
				</div>
				{/* Top Search Bar for Mobile Device */}
				<div className="flex items-center gap-2 ml-auto">
					<button
						onClick={() =>
							setSearchBoxVisibility((currentValue) => !currentValue)
						}
						className=" md:hidden bg-grey w-12 h-12 rounded-full"
					>
						<i className="fi fi-rr-search text-xl flex items-center justify-center"></i>
					</button>
					<Link to="/editor" className="hidden md:flex gap-2 link">
						<i className="fi fi-rr-edit text-xl text-dark-grey flex justify-center items-center w-full h-full"></i>
						<p>Write</p>
					</Link>

					{access_token ? (
						<>
							<Link to="/dashboard/notification">
								<button className=" w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
									<i className="fi fi-rr-bell flex justify-center items-center text-xl"></i>
								</button>
							</Link>

							<div className="relative">
								<button
									onClick={handleUserNavPanelClick}
									onBlur={handleNavPanelBlur}
									className="w-12 h-12 mt-1"
								>
									<img
										src={profile_img}
										alt=""
										className=" h-full w-full object-cover rounded-full"
									/>
								</button>

								{/* User navigation */}
								{userNavPanel ? <UserNavigation /> : ''}
							</div>
						</>
					) : (
						<>
							<Link to="/signin" className="btn-dark py-2">
								Sign In
							</Link>
							<Link to="/signup" className="btn-light py-2 hidden md:flex">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</nav>
			{/* Render children */}
			<Outlet></Outlet>
		</>
	);
};

export default Navbar;
