import { React, useEffect, useState } from 'react';
import { Position } from 'kokopu';
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
					<a
						href='https://kokopu.yo35.org/docs/4.8.0/pages/tutorials/01_getting_started.html'
						target='_blank'
					>
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
			<BackgroundGame />
		</div>
	);
}

function BackgroundGame() {
	let [position, setPosition] = useState(new Position());
	useEffect(() => {
		setInterval(() => {
			if (position.hasMove()) {
				const legalMoves = position.moves();
				position.play(
					legalMoves[Math.floor(Math.random() * legalMoves.length)],
				);
				setPosition(new Position(position.fen()));
			} else {
				setPosition(
					// new game FEN
					new Position(),
				);
			}
		}, 900);
	}, []);
	return <Board position={position} extrasVisible={false} />;
}

export default LandingPage;
