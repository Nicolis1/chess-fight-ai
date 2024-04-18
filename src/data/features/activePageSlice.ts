import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActivePageState {
	value: Page;
}
export enum Page {
	EDITOR,
	CHALLENGES,
	OTHER,
}
const initialState: ActivePageState = { value: Page.OTHER };
export const activePageSlice = createSlice({
	name: 'setActivePage',
	initialState,
	reducers: {
		setActivePage: (state, action: PayloadAction<Page>) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setActivePage } = activePageSlice.actions;
export default activePageSlice.reducer;
