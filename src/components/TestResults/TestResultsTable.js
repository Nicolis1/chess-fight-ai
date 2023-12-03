import { React, useState, useCallback } from 'react';
import './TestResult.css';

function TestResult(props) {
	const [showDetails, setShowDetails] = useState(false);
	let outcome = null;
	if (props.data.winner == 'w') {
		outcome = 'White';
	} else if (props.data.winner == 'b') {
		outcome = 'Black';
	} else {
		outcome = 'Draw';
	}

	const playMoves = useCallback(() => {
		props.playMoves(props.data.moves);
	}, [props.data.moves, props.playMoves]);

	return (
		<div className='testResult'>
			<div className='resultContainer'>
				<div>
					<span className={outcome}>{outcome}</span> in{' '}
					{`${props.data.turns} moves`}
				</div>
				<a
					className='detailsLink'
					onClick={() => {
						setShowDetails(!showDetails);
					}}
				>
					details
				</a>
			</div>
			{showDetails && (
				<div>
					<a className='playMoves' onClick={playMoves}>
						Play Moves
					</a>
					<div>{props.data.moves}</div>
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
		return (
			<div>
				<div className='resultsTitle'>Results</div>
				{resultComponents}
			</div>
		);
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
