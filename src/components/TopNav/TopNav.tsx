import { useSelector } from 'react-redux';
import './TopNav.css';
import React from 'react';
import { ActiveState } from '../../data/stores/dataStore.ts';
import SignoutButton from '../Button/SignoutButton.tsx';

export default function TopNav(props) {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	return (
		<div className='topNav'>
			<div className='main-content'>
				<div className='home'>
					<a href='/index'>
						<span className='icon-home' />
					</a>
				</div>

				<a href='/compete'>compete</a>
				<a href='/editor'>create</a>
			</div>
			<div className='rightContent'>
				<span className='userIndicator'>
					{activeUser?.username && activeUser.username}
				</span>
				<SignoutButton withText={false} />
			</div>
		</div>
	);
}
