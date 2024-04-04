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
import { fetchBots } from '../../data/utils.ts';

export default function BotSelections(props) {
	const dispatch = useDispatch();
	const activeCode = useSelector(
		(state: ActiveCodeState) => state.activeCode.value,
	);

	const [myBots, setMyBots] = useState<Array<BotData>>([]);
	useEffect(() => {
		async function getBots() {
			const botsForState = await fetchBots();
			setMyBots(botsForState);
		}
		getBots();
	}, [setMyBots]);
	if (myBots.length === 0) {
		return <p>Loading...</p>;
	}
	return (
		<>
			<h1>Bots</h1>
			{myBots.map((bot) => {
				return (
					<Button
						key={bot.id}
						onClick={() => {
							if (bot.id !== activeCode?.id)
								dispatch(
									setActiveCodeData({
										id: bot.id,
										code: bot.code,
										name: bot.name,
									}),
								);
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