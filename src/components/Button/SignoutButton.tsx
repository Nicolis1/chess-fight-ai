import React from 'react';
import Button from './Button.tsx';
import { useDispatch } from 'react-redux';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';

export default function SignoutButton({ withText }) {
	const dispatch = useDispatch();
	// TODO implement loading and error states for signout
	return (
		<Button
			icon={'icon-logout'}
			onClick={async () => {
				try {
					const resp = await fetch('/logout', {
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
		</Button>
	);
}
