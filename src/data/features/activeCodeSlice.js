import { createSlice } from '@reduxjs/toolkit';

export const activeCodeSlice = createSlice({
	name: 'activeCode',
	initialState: {
		value: null,
	},
	reducers: {
		setActiveCodeID: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setActiveCodeID } = activeCodeSlice.actions;

export default activeCodeSlice.reducer;
