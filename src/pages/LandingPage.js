import './LandingPage.css';
import { React, useEffect, useState } from 'react';
import { Position } from 'kokopu';
import Board from '../components/board/Board';

function LandingPage() {
	return (
		<div className={'background'}>
			{/* popover with login info */}
			<div className='welcomePopover'></div>
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
					new Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'),
				);
			}
		}, 900);
	}, []);
	return <Board position={position} extrasVisible={false} />;
}

export default LandingPage;
