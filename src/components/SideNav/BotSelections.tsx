import { useEffect, useState } from 'react';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button.tsx';
import { useSelector } from 'react-redux';
import React from 'react';
import { ActiveState } from '../../data/stores/dataStore.ts';
import { BotData, fetchBots } from '../../data/api/bots.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function BotSelections(props) {
	const dispatch = useDispatch();
	const activeCode = useSelector(
		(state: ActiveState) => state.activeCode.value,
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
					<button
						key={bot.id}
						className='custom-button'
						onClick={(e) => {
							if (bot.id !== activeCode?.id) dispatch(setActiveCodeData(bot));
						}}
						onContextMenu={(e) => {
							console.log('right clicked');
							e.preventDefault();
						}}
					>
						{bot.name}
						<FontAwesomeIcon icon={faPencil} />
					</button>
				);
			})}
		</>
	);
}
