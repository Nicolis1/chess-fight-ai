import React from 'react';
import './Challenge.css';
import { Tournament } from '../../data/api/challenges.ts';
import { useSelector } from 'react-redux';
import { ActiveState } from '../../data/stores/dataStore.ts';
import { Result } from '../ResultsPill/ResultsPill.tsx';

function RecentChallenge(props: { challenge: Tournament }) {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	// the first participant is typically the active user, but this is not documented behavior, so doing this to verify
	let opponentName = '';
	let playerName = '';
	for (let participant of props.challenge.participants) {
		if (participant.ownerName === activeUser?.username) {
			playerName = participant.name;
		} else {
			opponentName = participant.name;
		}
	}
	let playerWins = 0;
	let oppWins = 0;
	let draws = 0;
	for (let result of props.challenge.matchData) {
		if (result.winner == activeUser?.id) {
			playerWins++;
		} else if (result.winner != null) {
			oppWins++;
		} else {
			draws++;
		}
	}

	let playerClassString = 'botName playerName';
	let opponentClassString = 'botName opponentName';
	if (playerWins == oppWins) {
		playerClassString += ' draw';
		opponentClassString += ' draw';
	} else if (playerWins > oppWins) {
		playerClassString += ' winner';
		opponentClassString += ' loser';
	} else {
		playerClassString += ' loser';
		opponentClassString += ' winner';
	}

	return (
		<div
			key={props.challenge.challengeId}
			className='recent challenge'
			onClick={() => {
				console.log('here');
			}}
		>
			<div className={playerClassString}>{playerName}</div>
			vs
			<div className={opponentClassString}>{opponentName}</div>
		</div>
	);
}

export default RecentChallenge;
