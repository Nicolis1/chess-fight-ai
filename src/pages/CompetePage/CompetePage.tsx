import React, { useState } from 'react';
import { useEffect } from 'react';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
	Tournament,
	challengeBot,
	fetchChallenges,
	fetchTournaments,
} from '../../data/api/challenges.ts';
import { BotData, fetchBots, fetchChallengable } from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';
import './CompetePage.css';
import { Tooltip } from 'react-tooltip';
import TournamentElement from '../../components/TournamentElement/TournamentElement.tsx';
import StartChallenge from '../../components/ChallengeElement/StartChallenge.tsx';

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [challengableBots, setChallengableBots] = useState<BotData[]>([]);
	const [myBots, setMyBots] = useState<BotData[]>([]);
	const [recentChallenges, setRecentChallenges] = useState<Tournament[]>([]);
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
			fetchChallenges().then((challenges) => {
				if (!!challenges) {
					setRecentChallenges(challenges);
					console.log(challenges);
				}
			});
		})();
	}, [dispatch]);

	const tournamentComponents = tournaments.map(
		(tournament: Tournament, index) => {
			return (
				<TournamentElement
					key={tournament.challengeId}
					eligibleBots={myBots}
					{...tournament}
				/>
			);
		},
	);
	const recentChallengeComponents = recentChallenges.map((challenge) => {
		return (
			<>
				{challenge.participants.map((p) => (
					<>
						{p.name}
						{p.ownerName}
					</>
				))}
				<br />
				{new Date(challenge.scheduled * 1000).toDateString()}
			</>
		);
	});
	const botComponents = challengableBots.map((bot) => {
		if (!bot.name || !bot.ownerName || !bot.code) {
			return null;
		}
		return (
			<StartChallenge
				key={bot.id}
				name={`${bot.name?.substring(0, 15)}${
					bot.name?.length > 15 ? '...' : ''
				}`}
				id={bot.id}
				owner={bot.ownerName}
				code={bot.code}
				eligibleBots={myBots}
				onChallenge={(botForChallenge) => {
					if (botForChallenge?.id && bot?.id) {
						challengeBot(botForChallenge.id, bot.id).then((resp) => {
							console.log('challenge completed: ', resp);
						});
					}
				}}
			/>
		);
	});

	return (
		<div className='challengePage'>
			<h1>Upcoming Tournaments!</h1>
			<div className='tournamentWrapper'>{tournamentComponents}</div>
			<hr />

			<h1>Challenges</h1>
			<div className='challengeSection'>
				<div className='startChallenge'>
					<div className='sectionTitle'>Test Your Mettle</div>
					<div className='challengeWrapper'>
						<Tooltip id='challenge-bot-button' />
						<div className='challenges'>{botComponents}</div>
					</div>
				</div>
				<div>
					<h3>Your Challenges</h3>
					{recentChallengeComponents}
				</div>
				<div>
					<h3>All Challenges</h3>
					<ul>
						<li />
						<li />
						<li />
						<li />
						<li />
					</ul>
				</div>
			</div>
		</div>
	);
}
export default CompetePage;
