import { configureStore } from '@reduxjs/toolkit';

import activeCodeReducer from '../features/activeCodeSlice.ts';

 const store = configureStore({
	reducer: {
		activeCode: activeCodeReducer,
	},
});
export default store;
export type ActiveCodeState = ReturnType<typeof store.getState>
 