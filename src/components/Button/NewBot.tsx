import { useDispatch } from 'react-redux';
import Button from './Button.tsx';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import React from 'react';
import { newBot } from '../../data/api/bots.ts';

export default function NewBot(props) {
	const dispatch = useDispatch();
	return (
		<Button
			icon={'icon-plus'}
			onClick={async () => {
				const bot = await newBot();
				if (bot) dispatch(setActiveCodeData(bot));
			}}
		>
			New Bot
		</Button>
	);
}
