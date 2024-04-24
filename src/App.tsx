import './App.css';
import LandingPage from './pages/LandingPage/LandingPage.tsx';
import EditorPage from './pages/EditorPage/EditorPage.tsx';
import TopNav from './components/TopNav/TopNav.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import CompetePage from './pages/CompetePage/CompetePage.tsx';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <LandingPage />,
		},
		{
			path: '/join',
			element: <LandingPage signup={true} />,
		},
		{
			path: '/login',
			element: <LandingPage />,
		},
		{
			path: '/login/tryagain',
			element: <LandingPage tryagain={true} />,
		},
		{
			path: '/compete',
			element: (
				<div className='appContainer'>
					<TopNav />
					<CompetePage />
				</div>
			),
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
		{ path: '*', element: <LandingPage /> },
	]);

	return (
		<>
			<RouterProvider fallbackElement={<LandingPage />} router={router} />
		</>
	);
}

export default App;
