import { configureStore } from '@reduxjs/toolkit';

import activeCodeReducer from '../features/activeCodeSlice.ts';
import activeUserReducer from '../features/activeUserSlice.ts';
import activePageReducer from '../features/activePageSlice.ts';

const store = configureStore({
	reducer: {
		activeCode: activeCodeReducer,
		activeUser: activeUserReducer,
		activePage: activePageReducer,
	},
});
export default store;
export type ActiveState = ReturnType<typeof store.getState>;
