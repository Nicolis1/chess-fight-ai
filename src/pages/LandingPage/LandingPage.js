import { React, useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board';
import './LandingPage.css';
import { useDispatch } from 'react-redux';
import { PAGES, setPage } from '../../data/features/activePageSlice';

function LandingPage() {
	const dispatch = useDispatch();
	return (
		<div className={'background'}>
			{/* popover with login info */}
			<div className='welcomePopover'>
				<div className='title'>Welcome to ChessFight</div>
				<p>
					Here you can develop your own chess AI and upload it to play games
					against others.
				</p>
				<p>
					You can access the API{' '}
					<a href='https://www.npmjs.com/package/chess.js' target='_blank'>
						here
					</a>{' '}
					to learn about the tools available to you for designing your AI.
				</p>

				<p>You'll need to make an account to upload or save your AI.</p>
				<button
					onClick={() => {
						dispatch(setPage(PAGES.EditorPage));
					}}
				>
					Get Started
				</button>
				<p>
					<a href='#'>Already have an account? Click here to login.</a>
				</p>
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
		setInterval(() => {
			if (!chess.isGameOver() && !chess.isInsufficientMaterial()) {
				const legalMoves = chess.moves();
				chess.move(legalMoves[Math.floor(Math.random() * legalMoves.length)]);
			} else {
				chess.reset();
			}
			setFen(chess.fen());
		}, 900);
	}, []);
	return <Board position={fen} />;
}

export default LandingPage;
