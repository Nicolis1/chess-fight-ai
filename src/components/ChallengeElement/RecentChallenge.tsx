import React from 'react';
import './Challenge.css';
import { Tournament } from '../../data/api/challenges.ts';
import { useSelector } from 'react-redux';
import { ActiveState } from '../../data/stores/dataStore.ts';

export type ChallengeData = {
	challenge: Tournament;
	player1Wins: number;
	player2Wins: number;
	draws: number;
	player1Id: string;
	player2Id: string;
};

function RecentChallenge(props: {
	challenge: Tournament;
	forAllChallenges?: boolean;
	onExpand: (challengeData: ChallengeData) => void;
}) {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);

	let opponentName = '';
	let opponentId = '';
	let playerName = '';
	let playerId = '';
	if (props.challenge.participants.length < 2) {
		return null;
	}

	if (props.forAllChallenges) {
		playerName = props.challenge.participants[0].name;
		playerId = props.challenge.participants[0].id;
		opponentName = props.challenge.participants[1].name;
		opponentId = props.challenge.participants[1].id;
	} else {
		for (let participant of props.challenge.participants) {
			if (participant.ownerName === activeUser?.username) {
				playerName = participant.name;
				playerId = participant.id;
			} else {
				opponentName = participant.name;
				opponentId = participant.id;
			}
		}
	}

	let playerWins = 0;
	let oppWins = 0;
	let draws = 0;

	for (let result of props.challenge.matchData) {
		if (result.winner == playerId) {
			playerWins++;
		} else if (result.winner == opponentId) {
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
				props.onExpand({
					challenge: props.challenge,
					player1Id: playerId,
					player2Id: opponentId,
					player1Wins: playerWins,
					player2Wins: oppWins,
					draws,
				});
			}}
		>
			<div className={playerClassString}>{playerName}</div>
			vs
			<div className={opponentClassString}>{opponentName}</div>
		</div>
	);
}

export default RecentChallenge;
