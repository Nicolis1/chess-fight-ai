import './App.css';
import LandingPage from './pages/LandingPage/LandingPage.tsx';
import EditorPage from './pages/EditorPage/EditorPage.tsx';
import TopNav from './components/TopNav/TopNav.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <LandingPage />,
		},
		{
			path: '/index',
			element: <LandingPage />,
		},
		{
			path: '/editor',
			element: (
				<div className='appContainer'>
					<TopNav />
					<EditorPage />
				</div>
			),
		},
	]);

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
