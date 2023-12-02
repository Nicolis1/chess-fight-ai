import { configureStore } from '@reduxjs/toolkit';

import activePageReducer from '../features/activePageSlice';
import activeCodeReducer from '../features/activeCodeSlice';

export default configureStore({
	reducer: {
		activePage: activePageReducer,
		activeCode: activeCodeReducer,
	},
});
