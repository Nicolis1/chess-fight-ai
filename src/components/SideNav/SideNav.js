import { React, useCallback, useState } from 'react';
import './SideNav.css';
import Button from '../Button/Button';
import SignoutButton from '../Button/SignoutButton';
import NewBot from '../Button/NewBot';

export default function SideNav(props) {
	const [collapsed, setCollapsed] = useState(true);
	const toggleCollapse = useCallback(() => {
		setCollapsed(!collapsed);
	});
	return (
		<div className={collapsed ? 'sideNav collapsed' : 'sideNav expanded'}>
			<div className='container'>
				{!collapsed && (
					<div className='navEntries'>
						<SignoutButton />
						<NewBot />
					</div>
				)}
				<Button
					icon={collapsed ? 'icon-arrow-right' : 'icon-arrow-left'}
					onClick={toggleCollapse}
				/>
			</div>
		</div>
	);
}
