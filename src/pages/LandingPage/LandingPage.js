import { React, useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board';
import './LandingPage.css';
import { useDispatch } from 'react-redux';
import { PAGES, setPage } from '../../data/features/activePageSlice';
import { auth } from '../../firebase/firebase';
import {
	useAuthState,
	useCreateUserWithEmailAndPassword,
	useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';

function CreateAccountModalContent({ toggleDisplayLogin }) {
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		confirmpassword: '',
	});
	const [error, setError] = useState('');

	const [createUserWithEmailAndPassword, authError] =
		useCreateUserWithEmailAndPassword(auth);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation (you may want to add more complex validation)
		if (
			!formData.username.length > 3 ||
			!formData.email.length > 3 ||
			!formData.password.length > 6 ||
			!formData.confirmpassword.length > 6 ||
			formData.password !== formData.confirmpassword
		) {
			setError('Please enter email, username, and password.');
			return;
		}

		try {
			const newUser = await createUserWithEmailAndPassword(
				formData.email,
				formData.password,
			);
			if (newUser) {
				console.log('User registered successfully!');
				dispatch(setPage(PAGES.EditorPage));
			} else {
				setError(authError.message);
				alert(authError.message);
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
			<h2>Create Account</h2>
			{error && <p className='error-message'>{error}</p>}
			<div>
				<form onSubmit={handleSubmit} className='login-container'>
					<label>
						Email:
						<input
							type='text'
							name='email'
							value={formData.email}
							onChange={handleChange}
						/>
					</label>
					<label>
						Username:
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
						/>
					</label>
					<label>
						Password:
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
						/>
					</label>
					<label>
						Confirm Password:
						<input
							type='password'
							name='confirmpassword'
							value={formData.confirmpassword}
							onChange={handleChange}
						/>
					</label>
					<button type='submit'>Create Account</button>
				</form>
			</div>

			<p>
				<button
					onClick={() => {
						toggleDisplayLogin();
					}}
				>
					Already have an account? Click here to login.
				</button>
			</p>
		</div>
	);
}
function LoginModalContent({ toggleDisplayLogin }) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	const [signInWithEmailAndPassword, authError] =
		useSignInWithEmailAndPassword(auth);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData);
		// Basic validation (you may want to add more complex validation)
		if (!formData.email || !formData.password) {
			setError('please enter email and password');
		}

		const user = await signInWithEmailAndPassword(
			formData.email,
			formData.password,
		);
		console.log(user);
		if (user) {
			dispatch(setPage(PAGES.EditorPage));
			return;
		} else {
			setError(authError.message);
			alert(authError.message);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{error && <p className='error-message'>{error}</p>}
			<div>
				<form onSubmit={handleSubmit} className='login-container'>
					<label>
						Email:
						<input
							type='text'
							name='email'
							value={formData.email}
							onChange={handleChange}
						/>
					</label>
					<label>
						Password:
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
						/>
					</label>
					<button type='submit'>Login</button>
				</form>
			</div>

			<p>
				<button
					onClick={() => {
						toggleDisplayLogin();
					}}
				>
					Don't have an account yet? Click here to make one.
				</button>
			</p>
		</div>
	);
}

function LandingPage() {
	const [displayLogin, setDisplayLogin] = useState(false);
	const dispatch = useDispatch();
	const [user] = useAuthState(auth);
	useEffect(() => {
		if (user) {
			dispatch(setPage(PAGES.EditorPage));
		}
	}, [dispatch, user]);

	return (
		<div className={'background'}>
			{/* popover with login info */}
			<div className='welcomePopover'>
				<div className='title'>Welcome to ChessFight</div>

				{displayLogin ? (
					<LoginModalContent
						toggleDisplayLogin={() => {
							setDisplayLogin(!displayLogin);
						}}
					/>
				) : (
					<CreateAccountModalContent
						toggleDisplayLogin={() => {
							setDisplayLogin(!displayLogin);
						}}
					/>
				)}
			</div>
			{/* this will be a chessboard playing an automated game blurred */}
			<div className='gameBoard'>
				<BackgroundGame />
			</div>
		</div>
	);
}

function BackgroundGame() {
	let [fen, setFen] = useState(null);

	useEffect(() => {
		const chess = new Chess();
		setFen(chess.fen());
		const intervalID = setInterval(() => {
			if (!chess.isGameOver() && !chess.isInsufficientMaterial()) {
				const legalMoves = chess.moves();
				chess.move(legalMoves[Math.floor(Math.random() * legalMoves.length)]);
			} else {
				chess.reset();
			}
			setFen(chess.fen());
		}, 900);

		return () => {
			clearInterval(intervalID);
		};
	}, []);
	return <Board position={fen} />;
}

export default LandingPage;
