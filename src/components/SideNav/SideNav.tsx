import { useCallback, useEffect, useState } from 'react';
import './SideNav.css';
import Button from '../Button/Button.tsx';
import SignoutButton from '../Button/SignoutButton.tsx';
import NewBot from '../Button/NewBot.tsx';

import { useSelector } from 'react-redux';
import BotSelections from './BotSelections.tsx';
import React from 'react';
import { ActiveState } from '../../data/stores/dataStore.ts';

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
			<div className='container'>
				{!collapsed && (
					<div className='sideNavContent'>
						<div>
							<BotSelections />
						</div>
						<div className='actionButtons'>
							<NewBot />
							<SignoutButton withText={true} />
						</div>
					</div>
				)}
				<div className='toggleButton'>
					<Button
						icon={collapsed ? 'icon-arrow-right' : 'icon-arrow-left'}
						onClick={toggleCollapse}
					></Button>
				</div>
			</div>
		</div>
	);
}
