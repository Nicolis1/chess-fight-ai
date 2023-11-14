import { createSlice } from '@reduxjs/toolkit';

export const PAGES = {
	LandingPage: 'LANDING_PAGE',
	EditorPage: 'EDITOR_PAGE',
};

export const counterSlice = createSlice({
	name: 'page',
	initialState: {
		value: PAGES.LandingPage,
	},
	reducers: {
		setPage: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setPage } = counterSlice.actions;

export default counterSlice.reducer;
