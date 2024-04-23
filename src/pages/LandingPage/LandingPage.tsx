import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.tsx';
import './LandingPage.css';
import React from 'react';
import SignInWithGoogle from '../../components/SignInWith/SignInWithGoogle.tsx';
import SignInWithGithub from '../../components/SignInWith/SignInWithGithub.tsx';
import SignInWithFacebook from '../../components/SignInWith/SignInWithFacebook.tsx';

function CreateAccountModalContent() {
	const [formData, setFormData] = useState({
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
		if (
			formData.username.length < 3 ||
			formData.password.length < 3 ||
			formData.confirmpassword.length < 3 ||
			formData.password !== formData.confirmpassword
		) {
			setError(
				'Make sure your passwords match. Also maybe the user name is taken. IDK Good luck',
			);
			e.preventDefault();
			return false;
		}
	};

	return (
		<div>
			<div className='title'>Create Account</div>
			<div>
				<form
					action='/api/users/new'
					onSubmit={handleSubmit}
					className='login-container'
					method='POST'
				>
					<input
						type='text'
						name='username'
						placeholder='username'
						value={formData.username}
						onChange={handleChange}
					/>
					<input
						type='password'
						name='password'
						placeholder='password'
						value={formData.password}
						onChange={handleChange}
					/>
					<input
						type='password'
						name='confirmpassword'
						placeholder='confirm  password'
						value={formData.confirmpassword}
						onChange={handleChange}
					/>
					{error && <p className='error-message'>{error}</p>}
					<button type='submit'>Create Account</button>
				</form>
			</div>
			<hr />

			<div style={{ padding: '5px 10px 10px 10px' }}>
				Already have an account? <a href='/login'>click here to login</a>
			</div>
		</div>
	);
}
function LoginModalContent(props: { tryagain?: boolean }) {
	const [formData, setFormData] = useState({
		username: 'ted',
		password: '123',
	});
	const [error, setError] = useState(
		props.tryagain ? 'incorrect username or password' : '',
	);

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
		return true;
	};

	return (
		<div>
			<div className='title'>Login</div>
			<form
				action={`/api/login`}
				onSubmit={validate}
				method='POST'
				className='login-container'
			>
				<input
					type='text'
					name='username'
					placeholder='username'
					value={formData.username}
					onChange={handleChange}
				/>
				<input
					type='password'
					name='password'
					placeholder='password'
					value={formData.password}
					onChange={handleChange}
				/>
				{error && <p className='error-message'>{error}</p>}
				<button type='submit'>Login</button>
			</form>

			<div className='orlogin'>or login with one of these</div>
			<div className='signInWithIcons'>
				<SignInWithGoogle />
				<SignInWithGithub />
				<SignInWithFacebook />
			</div>
			<hr />

			<div style={{ padding: '5px 10px 10px 10px' }}>
				Don't have a chessfight account yet? <a href='/join'>sign up here</a>
			</div>
		</div>
	);
}

function LandingPage(props: { signup?: boolean; tryagain?: boolean }) {
	return (
		<div className={'background'}>
			{/* popover with login info */}
			<div className='welcomePopover'>
				{props.signup ? (
					<CreateAccountModalContent />
				) : (
					<LoginModalContent tryagain={props.tryagain} />
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
	return <Board position={fen || ''} />;
}

export default LandingPage;
