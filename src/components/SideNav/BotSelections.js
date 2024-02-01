import { React, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { setActiveCodeID } from '../../data/features/activeCodeSlice';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import { useSelector } from 'react-redux';

export default function BotSelections(props) {
	const [user] = useAuthState(auth);
	const dispatch = useDispatch();
	const activeCodeID = useSelector((state) => state.activeCode.value);

	const [myBots, setMyBots] = useState([]);

	useEffect(() => {
		(async () => {
			if (user) {
				try {
					const colelctionRef = collection(
						firestore,
						'users',
						user.uid,
						'bots',
					);
					const querySnap = await getDocs(colelctionRef);
					if (!querySnap.empty) {
						const bots = [];
						querySnap.forEach((doc) => {
							bots.push(doc.data());
						});
						setMyBots(bots);
					} else {
						// docSnap.data() will be undefined in this case
						console.log('No such document!');
					}
				} catch (error) {
					console.error(error);
					alert(error.message);
				}
			}
		})();
	}, [user, activeCodeID]);

	return (
		<>
			<h1>Bots</h1>
			{myBots.map((bot) => {
				return (
					<Button
						key={bot.botID}
						onClick={() => {
							dispatch(setActiveCodeID(bot.botID));
						}}
						icon='icon-pencil'
					>
						{bot.name}
					</Button>
				);
			})}
		</>
	);
}
