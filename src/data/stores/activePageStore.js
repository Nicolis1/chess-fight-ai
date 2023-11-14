import { configureStore } from '@reduxjs/toolkit';

import activePageReducer from '../features/activePageSlice';

export default configureStore({
	reducer: {
		activePage: activePageReducer,
	},
});
