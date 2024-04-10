import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BotData } from '../api/bots.ts';
interface ActiveCodeState {
	value: BotData | null;
}

const initialState: ActiveCodeState = { value: null };
export const activeCodeDataSlice = createSlice({
	name: 'setActiveCodeData',
	initialState,
	reducers: {
		setActiveCodeData: (state, action: PayloadAction<BotData>) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setActiveCodeData } = activeCodeDataSlice.actions;
export default activeCodeDataSlice.reducer;
