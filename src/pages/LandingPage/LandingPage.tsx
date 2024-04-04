import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.tsx';
import './LandingPage.css';
import { useDispatch } from 'react-redux';
import React from 'react';

function CreateAccountModalContent({ toggleDisplayLogin }) {
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		confirmpassword: '',
	});
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation (you may want to add more complex validation)
		if (
			formData.username.length < 3 ||
			formData.email.length < 3 ||
			formData.password.length < 3 ||
			formData.confirmpassword.length < 3 ||
			formData.password !== formData.confirmpassword
		) {
			setError('Please enter email, username, and password.');
			return;
		}

		try {
			// todo, create new user
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
		username: 'ted',
		password: '123',
	});
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const validate = (e) => {
		if (!formData.username || !formData.password) {
			setError('please enter email and password');
			e.preventDefault();
			return false;
		}
		// dispatch(setPage(PAGES.EditorPage));
		return true;
	};

	return (
		<div>
			<h2>Login</h2>
			{error && <p className='error-message'>{error}</p>}
			<div>
				<form
					action={`/login`}
					onSubmit={validate}
					method='POST'
					className='login-container'
				>
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
	const [displayLogin, setDisplayLogin] = useState(true);
	const dispatch = useDispatch();

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
	let [fen, setFen] = useState<string | null>(null);

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
