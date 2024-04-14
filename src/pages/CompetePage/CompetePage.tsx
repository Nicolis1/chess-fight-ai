import React, { useState } from 'react';
import { useEffect } from 'react';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
	Tournament,
	challengeBot,
	fetchTournaments,
	joinTournament,
} from '../../data/api/challenges.ts';
import { BotData, fetchBots, fetchChallengable } from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';
import './CompetePage.css';
import Button from '../../components/Button/Button.tsx';
import { Tooltip } from 'react-tooltip';
import TestResults from '../../components/TestResults/TestResultsTable.tsx';
import Board from '../../components/board/Board.tsx';
import { Chess } from 'chess.js';
import BotSelectionModal, {
	ChallengeEvent,
} from '../../components/BotSelectionModal/BotSelectionModal.tsx';
import { Result } from '../../components/ResultsPill/ResultsPill.tsx';

function TournamentElement(props: Tournament & { eligibleBots: BotData[] }) {
	const [displayModal, setDisplayModal] = useState(false);
	const [participants, setParticipants] = useState(props.participants);
	console.log('cid ', props.challengeId);
	console.log('participants ', props.participants);
	return (
		<div key={props.challengeId} className='tournament'>
			<div>
				<BotSelectionModal
					forEvent={ChallengeEvent.Tournament}
					displayModal={displayModal}
					bots={props.eligibleBots}
					onSelect={(selectedBot) => {
						setParticipants([selectedBot, ...participants]);
						joinTournament(selectedBot.id, props.challengeId);
					}}
					hideModal={() => {
						setDisplayModal(false);
					}}
				/>
				<div className='title'>{props.name}</div>

				<div>{new Date(props.scheduled * 1000).toDateString()}</div>
				<div>{participants.length} participants so far</div>
				<div>
					{participants.slice(0, 3).map((participant) => {
						return (
							<div className='participant'>
								{participant.name} by {participant.ownerName}
							</div>
						);
					})}
					{participants.length > 3 && '...'}
				</div>
			</div>
			<Button
				icon='icon-arrow-right'
				onClick={() => {
					setDisplayModal(true);
				}}
			>
				Join
			</Button>
		</div>
	);
}
function ChallengeElement(props: {
	id?: string;
	name?: string;
	owner?: string;
	code?: string;
	onChallenge: Function;
	eligibleBots: BotData[];
}) {
	const [displayModal, setDisplayModal] = useState(false);

	return (
		<div key={props.id} className='challenge'>
			<BotSelectionModal
				forEvent={ChallengeEvent.Challenge}
				displayModal={displayModal}
				bots={props.eligibleBots}
				onSelect={(selectedBot) => {
					props.onChallenge(selectedBot);
				}}
				hideModal={() => {
					setDisplayModal(false);
				}}
			/>
			<span>
				{props.name} by {props.owner}
			</span>
			<Button
				onClick={() => {
					setDisplayModal(true);
				}}
				icon='icon-target'
				tooltipID='challenge-bot-button'
				tooltipContent="Select a bot you've created to challenge this one"
			>
				Challenge
			</Button>
		</div>
	);
}

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
	const [challengableBots, setChallengableBots] = useState<BotData[] | null>(
		null,
	);
	const [myBots, setMyBots] = useState<BotData[] | null>(null);
	const [botIdForChallenge, setBotIdForChallenge] = useState<string>('');
	const [results, setResults] = useState<Result[] | null>(null);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			if (activeUser == null) {
				fetchActiveUser().then((activeUserData) => {
					if (activeUserData) {
						dispatch(
							setActiveUser({
								id: activeUserData.id,
								username: activeUserData.username,
							}),
						);
					}
				});
			}
			fetchTournaments().then((tournaments) => {
				setTournaments(tournaments);
			});
			fetchChallengable().then((bots) => {
				setChallengableBots(bots);
			});

			fetchBots().then((bots) => {
				if (bots.length > 0) {
					setMyBots(bots);
				}
			});
		})();
	}, [dispatch]);

	const tournamentComponents = (tournaments || []).map(
		(tournament: Tournament, index) => {
			return (
				<TournamentElement
					key={tournament.challengeId}
					eligibleBots={myBots || []}
					{...tournament}
				/>
			);
		},
	);
	const botComponents = (challengableBots || []).map((bot) => {
		if (!bot.name || !bot.ownerName || !bot.code) {
			return null;
		}
		return (
			<ChallengeElement
				key={bot.id}
				name={`${bot.name?.substring(0, 15)}${
					bot.name?.length > 15 ? '...' : ''
				}`}
				id={bot.id}
				owner={bot.ownerName}
				code={bot.code}
				eligibleBots={myBots || []}
				onChallenge={(botForChallenge) => {
					if (botForChallenge?.id && bot?.id) {
						challengeBot(botForChallenge.id, bot.id).then((resp) => {
							setResults(resp);
							setBotIdForChallenge(botForChallenge.id);
						});
					}
				}}
			/>
		);
	});

	const playMoves = (moves) => {
		const movesClone = [...moves];
		if (intervalID != null) {
			clearInterval(intervalID);
		}
		let game = new Chess();
		// quick delay before starting to readjust focus visually
		setDisplayFen(game.fen());

		setTimeout(() => {
			const id = setInterval(() => {
				if (movesClone.length > 0) {
					game.move(movesClone.shift());
				} else {
					clearInterval(id);
				}
				setDisplayFen(game.fen());
			}, 150);
			setIntervalID(id);
		}, 500);
	};

	return (
		<div className='challengePage'>
			<h1>Upcoming Tournaments!</h1>
			<div className='tournamentWrapper'>{tournamentComponents}</div>
			<hr />
			<h1>Challenge these bots directly</h1>
			<Tooltip id='challenge-bot-button' />
			<div className='challengeWrapper'>{botComponents}</div>

			<div className='gameVisualization'>
				{<Board position={displayFen}></Board>}
			</div>
			{results && !!botIdForChallenge && (
				<TestResults
					results={results}
					playMoves={playMoves}
					playerId={botIdForChallenge}
				/>
			)}
		</div>
	);
}
export default CompetePage;
