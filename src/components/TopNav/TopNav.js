import { React } from 'react';
import './TopNav.css';
import Button from '../Button/Button';
import SignoutButton from '../Button/SignoutButton';

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

			<SignoutButton />
		</div>
	);
}
