import { useDispatch } from 'react-redux';
import Button from './Button.tsx';
import { STARTER_CODE2 } from '../../data/utils';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import React from 'react';

export default function NewBot(props) {
	const dispatch = useDispatch();
	return (
		<Button
			icon={'icon-plus'}
			onClick={async () => {
				try {
					console.log(`/bots/new`);
					await fetch(`/bots/new`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ code: STARTER_CODE2 }),
					}).then(async (resp) => {
						console.log(resp);
						const response = JSON.parse(await resp.json());
						dispatch(
							setActiveCodeData({
								id: response.bot_id,
								name: response.name,
								code: response.code,
							}),
						);
					});
				} catch (error) {
					console.error(error);
				}
			}}
		>
			New Bot
		</Button>
	);
}
