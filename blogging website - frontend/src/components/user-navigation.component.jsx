import { Link } from 'react-router-dom';
import AnimationWraper from '../common/page-animation';
import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { removeFromSession } from '../common/session';

const UserNavigation = () => {
	const { userAuth, setUserAuth } = useContext(UserContext);
	const { username } = userAuth;
	const [userNavPanel, setUserNavPanel] = useState(false);

	const signOutUser = () => {
		removeFromSession('user');
		setUserAuth({ access_token: null });
	};

	return (
		<AnimationWraper transition={{ duration: 0.2 }}>
			<div className=" bg-white absolute right-0 z-50 border border-grey w-60  duration-200">
				<Link to="/editor" className=" link flex gap-2 md:hidden pl-8 py-4">
					<i className="fi fi-rr-edit text-xl"></i>
					<p>Write</p>
				</Link>
				<Link to={`/user/${username}`} className=" link  pl-8 py-4">
					Profile
				</Link>
				<Link to="/dashboard" className=" link  pl-8 py-4">
					Dashboard
				</Link>
				<Link to="/settings/edit-profile" className="link pl-8 py-4">
					Settings
				</Link>

				<span className="absolute border border-t-0 border-grey hover:bg-grey w-full">
					<button className=" pl-8 text-left py-4" onClick={signOutUser}>
						<h1 className=" font-bold text-xl my-1">Sign Out</h1>
						<p className=" text-dark-grey">@{username}</p>
					</button>
				</span>
			</div>
		</AnimationWraper>
	);
};

export default UserNavigation;
