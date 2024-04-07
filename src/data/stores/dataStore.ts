import { configureStore } from '@reduxjs/toolkit';

import activeCodeReducer from '../features/activeCodeSlice.ts';
import activeUserReducer from '../features/activeUserSlice.ts';
 const store = configureStore({
	reducer: {
		activeCode: activeCodeReducer,
		activeUser: activeUserReducer,
	},
});
export default store;
export type ActiveState = ReturnType<typeof store.getState>
 