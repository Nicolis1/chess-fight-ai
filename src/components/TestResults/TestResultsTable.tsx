import { useState, useCallback } from 'react';
import './TestResult.css';
import React from 'react';

function TestResult(props) {
	const [showDetails, setShowDetails] = useState(false);
	let outcome: string | null = null;
	if (props.data.reachedMoveLimit || props.data.draw) {
		outcome = 'Draw';
	} else if (props.data.winner === true) {
		outcome = 'Win';
	} else {
		outcome = 'Loss';
	}

	const playMoves = useCallback(() => {
		props.playMoves(props.data.moves);
	}, [props]);

	return (
		<div className='testResult'>
			<div className='resultContainer'>
				<div>
					<span className={outcome}>{outcome}</span> in{' '}
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
						with the {props.data.playerColor === 'w' ? 'white' : 'black'} pieces{' '}
						<button className='playMoves' onClick={playMoves}>
							Play Moves
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default function TestResults(props) {
	if (props.response?.success) {
		let resultComponents = props.response.results.map((result, index) => {
			return (
				<TestResult
					key={'result' + index}
					data={result}
					playMoves={props.playMoves}
				/>
			);
		});
		return <div>{resultComponents}</div>;
	} else {
		// there was an error
		return (
			<div>
				<div className='resultsTitle'>Results</div>
				{JSON.stringify(props.response.error)}
			</div>
		);
	}
}
