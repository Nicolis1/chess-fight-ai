import React from 'react';
import './Board.css';

import { Chessboard } from 'react-chessboard';

export default function Board(props: { position: string }) {
	return (
		<div className='board'>
			<Chessboard
				position={props.position}
				animationDuration={0}
				areArrowsAllowed={false}
				arePiecesDraggable={false}
				arePremovesAllowed={false}
				clearPremovesOnRightClick={false}
				showBoardNotation={false}
				snapToCursor={false}
			/>
		</div>
	);
}
