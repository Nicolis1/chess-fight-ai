import './App.css';
import { PAGES } from './data/features/activePageSlice';
import LandingPage from './pages/LandingPage/LandingPage';
import EditorPage from './pages/EditorPage/EditorPage';
import TopNav from './components/TopNav/TopNav';

import { useSelector } from 'react-redux';
function App() {
	const activePageIdentifier = useSelector((state) => state.activePage.value);
	let ActivePage = null;

	switch (activePageIdentifier) {
		case PAGES.LandingPage:
			ActivePage = LandingPage;
			break;
		case PAGES.EditorPage:
			ActivePage = EditorPage;
			break;
		default:
			//todo replace with 404 page
			ActivePage = LandingPage;
	}

	return (
		<div className='app'>
			<TopNav />
			<ActivePage />
		</div>
	);
}

export default App;
