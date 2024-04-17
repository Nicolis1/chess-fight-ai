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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [challengableBots, setChallengableBots] = useState<BotData[]>([]);
	const [myBots, setMyBots] = useState<BotData[]>([]);
	const [myRecentChallenges, setMyRecentChallenges] = useState<Tournament[]>(
		[],
	);
	const [allRecentChallenges, setAllRecentChallenges] = useState<Tournament[]>(
		[],
	);
	const [inFlightChallenges, setInFlightChallenges] = useState<
		{
			opponent: BotData;
		}[]
	>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const tournaments = fetchTournaments();
			const challengeable = fetchChallengable();
			const myBots = fetchBots();
			const challenges = fetchChallenges();
			const allChallenges = fetchChallenges(true);
			setTournaments(await tournaments);
			setChallengableBots(await challengeable);
			setMyBots(await myBots);
			setMyRecentChallenges(await challenges);
			setAllRecentChallenges(await allChallenges);

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
		})();
	}, [dispatch, inFlightChallenges]);

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
	const allRecentChallengeComponents = allRecentChallenges.map((challenge) => {
		return (
			<RecentChallenge
				key={challenge.challengeId}
				challenge={challenge}
				forAllChallenges={true}
			/>
		);
	});
	const recentChallengeComponents = myRecentChallenges.map((challenge) => {
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
				botData={bot}
				eligibleBots={myBots}
				disabled={!!inFlightChallenges.length}
				onChallenge={(botForChallenge) => {
					if (botForChallenge?.id && bot?.id) {
						setInFlightChallenges([...inFlightChallenges, { opponent: bot }]);
						challengeBot(botForChallenge.id, bot.id)
							.then((resp) => {
								console.log('challenge completed: ', resp);
							})
							.finally(() => {
								setInFlightChallenges([]);
							});
					}
				}}
			/>
		);
	});
	const inFlightChallengesComponents = inFlightChallenges.map((challenge) => {
		return (
			<div key={challenge.opponent.id} className='pending challenge'>
				<span>Pending challenge against {challenge.opponent.name}</span>
				<div className='spinner'>
					<FontAwesomeIcon icon={faSpinner} />
				</div>
			</div>
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
						{inFlightChallengesComponents}
						{recentChallengeComponents}
					</div>
				</div>
				<div className='challenge-subsection'>
					<div className='sectionTitle'>All Recent Challenges</div>
					<div className='challengeWrapper'>{allRecentChallengeComponents}</div>
				</div>
			</div>
		</div>
	);
}
export default CompetePage;
