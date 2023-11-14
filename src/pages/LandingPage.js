import './LandingPage.css';
import { React, useEffect, useState } from 'react';
import { Position } from 'kokopu';
import Board from '../components/board/Board';

function LandingPage() {
	return (
		<div className={'background'}>
			{/* this will be a chessboard playing an automated game blurred */}
			<BackgroundGame />
			{/* popover with login info */}
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
			} else {
				position.reset();
			}
			setPosition(new Position(position.fen()));
		}, 900);
	}, []);
	return <Board position={position} extrasVisible={false} />;
}

export default LandingPage;
