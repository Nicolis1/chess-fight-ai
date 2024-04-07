import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveUserState {
	value: User | null;
}
export type User = {
	id?: string | undefined;
	username?:null
};
const initialState: ActiveUserState = { value: null };
export const activeUserSlice = createSlice({
	name: 'setActiveUser',
	initialState,
	reducers: {
		setActiveUser: (state, action: PayloadAction<User|null>) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;
