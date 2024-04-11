import { useState, useCallback } from 'react';
import './TestResult.css';
import React from 'react';

function TestResult(props: {
	data: Result;
	playerId: string;
	playMoves: Function;
}) {
	const [showDetails, setShowDetails] = useState(false);
	let outcome: string | null = null;
	if (props.data.reachedMoveLimit || props.data.draw) {
		outcome = 'Draw';
	} else if (props.data.winner === props.playerId) {
		outcome = 'Win';
	} else {
		outcome = 'Loss';
	}

	const playMoves = useCallback(() => {
		props.playMoves(props.data.moves);
	}, [props]);

	let playerPieces = 'white';
	if (props.data.whitePieces !== props.playerId) {
		playerPieces = 'black';
	}

	return (
		<div className='testResult'>
			<div className='resultContainer'>
				<div>
					<span className={outcome}>{outcome}</span> in
					{`${props.data.turns} moves`}
				</div>
				<button
					className='detailsLink'
					onClick={() => {
						setShowDetails(!showDetails);
					}}
				>
					details
				</button>
			</div>
			{showDetails && (
				<div>
					<div>
						with the {playerPieces} pieces
						<button className='playMoves' onClick={playMoves}>
							Play Moves
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
export type Result = {
	draw: boolean;
	moves: string[];
	turns: number;
	whitePieces: string;
	winner: string | null;
	reachedMoveLimit: boolean;
};
export default function TestResults(props: {
	results: Result[] | null;
	playMoves: Function;
	playerId: string;
}) {
	if (!props.results) return null;
	let resultComponents = props.results.map((result, index) => {
		return (
			<TestResult
				key={'result' + index}
				data={result}
				playMoves={props.playMoves}
				playerId={props.playerId}
			/>
		);
	});
	return <div>{resultComponents}</div>;
}
