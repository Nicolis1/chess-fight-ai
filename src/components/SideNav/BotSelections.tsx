import { useEffect, useState } from 'react';
import {
	BotData,
	setActiveCodeData,
} from '../../data/features/activeCodeSlice.ts';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button.tsx';
import { useSelector } from 'react-redux';
import React from 'react';
import { ActiveCodeState } from '../../data/stores/dataStore.ts';

export default function BotSelections(props) {
	const dispatch = useDispatch();
	const activeCode = useSelector(
		(state: ActiveCodeState) => state.activeCode.value,
	);

	const [myBots, setMyBots] = useState<Array<BotData>>([]);

	//todo reimplement getting users' bots
	useEffect(() => {});
	return (
		<>
			<h1>Bots</h1>
			{myBots.map((bot) => {
				return (
					<Button
						key={bot.id}
						onClick={() => {
							// dispatch(setActiveCodeData(bot.botID));
						}}
						icon='icon-pencil'
					>
						{bot.name}
					</Button>
				);
			})}
		</>
	);
}
