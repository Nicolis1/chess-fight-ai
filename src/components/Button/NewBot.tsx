import { useDispatch } from 'react-redux';
import Button from './Button.tsx';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import React from 'react';
import { newBot } from '../../data/api/bots.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function NewBot() {
	const dispatch = useDispatch();
	return (
		<button
			className='custom-button'
			onClick={async () => {
				const bot = await newBot();
				if (bot) dispatch(setActiveCodeData(bot));
			}}
		>
			New Bot
			<FontAwesomeIcon icon={faPlus} />
		</button>
	);
}
