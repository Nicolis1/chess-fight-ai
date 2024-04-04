import React from 'react';
import Button from './Button.tsx';

export default function SignoutButton({ withText }) {
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
						document.location = '/index';
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
