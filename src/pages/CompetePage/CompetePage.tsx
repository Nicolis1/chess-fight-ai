import React, { useState } from 'react';
import { useEffect } from 'react';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Tournament, fetchTournaments } from '../../data/api/challenges.ts';
import { BotData, fetchChallengable } from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
	const [challengableBots, setChallengableBots] = useState<BotData[] | null>(
		null,
	);

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
		})();
	}, [dispatch]);

	const tournamentComponents = (tournaments || []).map((tournament) => {
		return (
			<div key={tournament.challengeId}>
				{tournament.scheduled} <br /> {tournament.challengeId} <br />
				{tournament.matchData.length} <br /> {tournament.participants.length}
			</div>
		);
	});
	const botComponents = (challengableBots || []).map((bot) => {
		return (
			<div key={bot.id}>
				<br />
				{bot.name}
			</div>
		);
	});
	return (
		<div>
			Competitions will go here!
			{tournamentComponents}
			<hr />
			{botComponents}
		</div>
	);
}
export default CompetePage;
