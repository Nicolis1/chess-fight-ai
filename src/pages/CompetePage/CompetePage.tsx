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
import RecentChallenge from '../../components/ChallengeElement/RecentChallenge.tsx';

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
			<RecentChallenge key={challenge.challengeId} challenge={challenge} />
		);
	});
	const botComponents = challengableBots.map((bot) => {
		if (!bot.name || !bot.ownerName || !bot.code) {
			return null;
		}
		return (
			<StartChallenge
				key={bot.id}
				name={bot.name}
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
			<Tooltip id='challenge-page' />
			<div className='tournamentWrapper'>{tournamentComponents}</div>
			<div className='challengeSection'>
				<div className='challenge-subsection'>
					<div className='sectionTitle'>Test Your Mettle</div>
					<div className='challengeWrapper'>{botComponents}</div>
				</div>
				<div className='challenge-subsection'>
					<div className='sectionTitle'>Your Recent Challenges</div>
					<div className='challengeWrapper'>
						<div className='header'>
							<span style={{ float: 'left' }}>your bot</span>
							<span style={{ float: 'right' }}>opponent</span>
						</div>
						{recentChallengeComponents}
					</div>
				</div>
				<div className='challenge-subsection'>
					<div className='sectionTitle'>All Recent Challenges</div>
					<div className='challengeWrapper'>{recentChallengeComponents}</div>
				</div>
			</div>
		</div>
	);
}
export default CompetePage;
