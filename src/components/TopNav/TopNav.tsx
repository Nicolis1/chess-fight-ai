import './TopNav.css';
import Button from '../Button/Button.tsx';
import SignoutButton from '../Button/SignoutButton.tsx';
import React from 'react';

export default function SideNav(props) {
	return (
		<div className='topNav'>
			<div className='main-content'>
				<div className='home'>
					<Button icon='icon-home' />
				</div>

				<Button>compete</Button>
				<Button>create</Button>
			</div>

			<SignoutButton withText={undefined} />
		</div>
	);
}
