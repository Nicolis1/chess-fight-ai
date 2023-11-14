import React from 'react';
import './Board.css';

import { Chessboard } from 'kokopu-react';

export default function Board(props) {
	return (
		<div className='board'>
			<Chessboard
				position={props.position.fen()}
				turnVisible={props.extrasVisible || false}
				coordinateVisible={props.extrasVisible || false}
				squareSize={500}
			/>
		</div>
	);
}
