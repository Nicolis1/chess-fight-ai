import { useSelector } from 'react-redux';
import './TopNav.css';
import React from 'react';
import { ActiveState } from '../../data/stores/dataStore.ts';
import SignoutButton from '../Button/SignoutButton.tsx';
import { Page } from '../../data/features/activePageSlice.ts';

export default function TopNav(props) {
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const activePage = useSelector(
		(state: ActiveState) => state.activePage.value,
	);
	return (
		<div className='topNav'>
			<div className='main-content'>
				<div className='home'>
					<a href='/index'>
						<span className='icon-home' />
					</a>
				</div>

				<a
					href='/compete'
					id={activePage == Page.CHALLENGES ? 'active-page' : ''}
				>
					compete
				</a>
				<a href='/editor' id={activePage == Page.EDITOR ? 'active-page' : ''}>
					create
				</a>
			</div>
			<div className='rightContent'>
				<span className='userIndicator'>
					{activeUser?.username && activeUser.username}
				</span>
				<div className='signout'>
					<SignoutButton withText={false} />
				</div>
			</div>
		</div>
	);
}
