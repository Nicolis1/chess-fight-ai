import { createSlice } from '@reduxjs/toolkit';

export const activeCodeSlice = createSlice({
	name: 'activeCode',
	initialState: {
		value:
			// comment for formatting
			`function getNextMove(position){
    return position.moves()[0];
}`,
	},
	reducers: {
		updateActiveCode: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setPage } = activeCodeSlice.actions;

export default activeCodeSlice.reducer;
