import { React, useCallback, useEffect, useState } from 'react';
import './SideNav.css';
import Button from '../Button/Button';
import SignoutButton from '../Button/SignoutButton';
import { useSelector } from 'react-redux';
import BotSelections from './BotSelections';

export default function SideNav(props) {
	const [collapsed, setCollapsed] = useState(true);
	const toggleCollapse = useCallback(() => {
		setCollapsed(!collapsed);
	});
	const activeCodeID = useSelector((state) => state.activeCode.value);

	useEffect(() => {
		//closes the nav whenever the active bot has changed
		setCollapsed(true);
	}, [activeCodeID]);
	return (
		<div className={collapsed ? 'sideNav collapsed' : 'sideNav expanded'}>
			<div className='container'>
				{!collapsed && (
					<div className='sideNavContent'>
						<div className='actionButtons'>
							<SignoutButton />
						</div>
						<BotSelections />
					</div>
				)}

				<Button
					icon={collapsed ? 'icon-arrow-right' : 'icon-arrow-left'}
					onClick={toggleCollapse}
				></Button>
			</div>
		</div>
	);
}
