import React from 'react';

import { useDispatch } from 'react-redux';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Button.css';

export default function SignoutButton({ withText }) {
	const dispatch = useDispatch();
	// TODO implement loading and error states for signout
	return (
		<button
			className='custom-button'
			onClick={async () => {
				try {
					const resp = await fetch('/api/logout', {
						method: 'POST',
						mode: 'no-cors',
					});
					if (resp.status === 200) {
						dispatch(setActiveUser(null));
						document.location = '/login';
					}
				} catch (error) {
					alert(error.message);
				}
			}}
		>
			{withText === true && <>Sign Out</>}
			<FontAwesomeIcon icon={faRightFromBracket} />
		</button>
	);
}
