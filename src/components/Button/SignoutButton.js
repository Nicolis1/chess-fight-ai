import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { PAGES, setPage } from '../../data/features/activePageSlice';
import Button from './Button';
export default function SignoutButton() {
	const [signOut, loading, error] = useSignOut(auth);
	const dispatch = useDispatch();
	return (
		<Button
			icon={'icon-logout'}
			onClick={async () => {
				try {
					const success = await signOut();
					if (success) {
						alert('You are sign out');
						dispatch(setPage(PAGES.LandingPage));
					}
				} catch (error) {
					alert(error.message);
				}
			}}
		/>
	);
}
