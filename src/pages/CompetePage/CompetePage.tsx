import React, { useState } from 'react';
import { useEffect } from 'react';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
	Tournament,
	fetchActiveUser,
	fetchTournaments,
} from '../../data/utils.ts';

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
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

			if (tournaments == null) {
				fetchTournaments().then((tournaments) => {
					setTournaments(tournaments);
				});
			}
		})();
	}, [activeUser, dispatch, tournaments]);

	const tournamentComponents = (tournaments || []).map((tournament) => {
		return (
			<div>
				{tournament.scheduled} <br /> {tournament.challengeId} <br />
				{tournament.matchData.length} <br /> {tournament.participants.length}
			</div>
		);
	});
	return (
		<div>
			Competitions will go here!
			{tournamentComponents}
		</div>
	);
}
export default CompetePage;
