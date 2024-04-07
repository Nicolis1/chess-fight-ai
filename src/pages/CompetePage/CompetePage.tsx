import React from 'react';
import { useEffect } from 'react';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveUser } from '../../data/utils.ts';

function CompetePage() {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			if (activeUser == null) {
				fetchActiveUser().then((activeUserData) => {
					if (!activeUserData) {
						document.location = '/login';
					} else {
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
	}, [activeUser, dispatch]);

	return <div>Competitions will go here!</div>;
}
export default CompetePage;
