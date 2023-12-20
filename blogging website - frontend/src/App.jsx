import Navbar from './components/navbar.component';
import { Routes, Route } from 'react-router-dom';
import UserAuthForm from './pages/userAuthForm.page';
import { Toaster } from 'react-hot-toast';
import { createContext, useEffect, useState } from 'react';
import { lookInSession } from './common/session';

// Context
export const UserContext = createContext({});
const App = () => {
	const [userAuth, setUserAuth] = useState({});

	useEffect(() => {
		let userInSession = lookInSession('user');
		userInSession
			? setUserAuth(JSON.parse(userInSession))
			: setUserAuth({ access_token: null });
	}, []);

	return (
		<>
			<UserContext.Provider value={{ userAuth, setUserAuth }}>
				<Toaster />
				<Routes>
					{/* Parent */}
					<Route path="/" element={<Navbar />}>
						{/* Children */}
						<Route path="signin" element={<UserAuthForm type="signin" />} />
						<Route path="signup" element={<UserAuthForm type="signup" />} />
					</Route>
				</Routes>
			</UserContext.Provider>
		</>
	);
};

export default App;
