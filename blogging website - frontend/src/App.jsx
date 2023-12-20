import Navbar from './components/navbar.component';
import { Routes, Route } from 'react-router-dom';
import UserAuthForm from './pages/userAuthForm.page';
import { Toaster } from 'react-hot-toast';
const App = () => {
	return (
		<>
			<Toaster />
			<Routes>
				{/* Parent */}
				<Route path="/" element={<Navbar />}>
					{/* Children */}
					<Route path="signin" element={<UserAuthForm type="signin" />} />
					<Route path="signup" element={<UserAuthForm type="signup" />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;
