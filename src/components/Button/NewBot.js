import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';

import Button from './Button';
import { STARTER_CODE2 } from '../../data/utils';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { setActiveCodeID } from '../../data/features/activeCodeSlice';

export default function NewBot() {
	const [user] = useAuthState(auth);
	const dispatch = useDispatch();
	return (
		<Button
			icon={'icon-plus'}
			onClick={async () => {
				try {
					// TODO, restric permissions on firestore
					const botID = uuidv4();
					const documentName = `${user.uid}\\${botID}`;
					await setDoc(doc(firestore, 'bots', documentName), {
						name: 'Untitled',
						owner: user.uid,
						code: STARTER_CODE2,
						botID: botID,
					});
					dispatch(setActiveCodeID(documentName));
				} catch (error) {
					alert(error.message);
				}
			}}
		/>
	);
}
