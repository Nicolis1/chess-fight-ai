import { React, useCallback, useState } from 'react';
import './SideNav.css';
import Button from '../Button/Button';

export default function SideNav(props) {
	const [collapsed, setCollapsed] = useState(true);
	const toggleCollapse = useCallback(() => {
		setCollapsed(!collapsed);
	});
	return (
		<div className={collapsed ? 'sideNav collapsed' : 'sideNav expanded'}>
			<div className='container'>
				{!collapsed && <div className='navEntries'></div>}
				<Button
					icon={collapsed ? 'icon-arrow-right' : 'icon-arrow-left'}
					onClick={toggleCollapse}
				/>
			</div>
		</div>
	);
}
