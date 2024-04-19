import { useCallback, useEffect, useState } from 'react';
import './SideNav.css';
import SignoutButton from '../Button/SignoutButton.tsx';
import NewBot from '../Button/NewBot.tsx';

import { useSelector } from 'react-redux';
import BotSelections from './BotSelections.tsx';
import React from 'react';
import { ActiveState } from '../../data/stores/dataStore.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { deleteAccount } from '../../data/api/users.ts';

export default function SideNav(props) {
	const [collapsed, setCollapsed] = useState(true);
	const toggleCollapse = useCallback(() => {
		setCollapsed(!collapsed);
	}, [collapsed]);
	const activeCodeID = useSelector(
		(state: ActiveState) => state.activeCode.value,
	);

	useEffect(() => {
		//closes the nav whenever the active bot has changed
		setCollapsed(true);
	}, [activeCodeID]);
	return (
		<div className={collapsed ? 'sideNav collapsed' : 'sideNav expanded'}>
			<div className='sidenav-container'>
				{!collapsed && (
					<div className='sideNavContent'>
						<div>
							<BotSelections />
						</div>
						<div className='actionButtons'>
							<NewBot />
							<SignoutButton withText={true} />
							<button
								className='custom-button'
								onClick={() => {
									if (
										confirm(
											'Are you sure you want to permanently delete your account?',
										)
									) {
										deleteAccount();
									}
								}}
							>
								Delete Account
								<FontAwesomeIcon icon={faTrash} />
							</button>
						</div>
					</div>
				)}
				<button onClick={toggleCollapse} className='toggleButton'>
					<span>
						{collapsed ? (
							<FontAwesomeIcon icon={faChevronRight} />
						) : (
							<FontAwesomeIcon icon={faChevronLeft} />
						)}
					</span>
				</button>
			</div>
		</div>
	);
}
