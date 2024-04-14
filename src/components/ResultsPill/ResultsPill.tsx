import React from 'react';
import './ResultsPill.css';
export type Result = {
	draw: boolean;
	moves: string[];
	turns: number;
	whitePieces: string;
	winner: string | null;
	reachedMoveLimit: boolean;
};

function ResultsPill(props: { results: Result[]; protagonist: string }) {
	let wins = 0;
	let draws = 0;
	let losses = 0;
	props.results.forEach((result) => {
		if (result.winner === props.protagonist) {
			wins++;
		} else if (!result.winner) {
			draws++;
		} else {
			losses++;
		}
	});
	return (
		<div className='pillContainer'>
			<div className='pillCenterer'>
				<span
					className='wins'
					style={{
						width: `${(wins / props.results.length) * 100}%`,
						backgroundColor: 'green',
						borderTopLeftRadius: '10px',
						borderBottomLeftRadius: '10px',
						borderTopRightRadius: losses > 0 || draws > 0 ? '0' : '10px',
						borderBottomRightRadius: losses > 0 || draws > 0 ? '0' : '10px',
					}}
				/>
				<span
					className='draws'
					style={{
						width: `${(draws / props.results.length) * 100}%`,
						backgroundColor: 'yellow',
						borderTopLeftRadius: wins > 0 ? '0' : '10px',
						borderBottomLeftRadius: wins > 0 ? '0' : '10px',
						borderTopRightRadius: losses > 0 ? '0' : '10px',
						borderBottomRightRadius: losses > 0 ? '0' : '10px',
					}}
				/>
				<span
					className='losses'
					style={{
						width: `${(losses / props.results.length) * 100}%`,
						backgroundColor: 'red',
						borderTopLeftRadius: wins > 0 || draws > 0 ? '0' : '10px',
						borderBottomLeftRadius: wins > 0 || draws > 0 ? '0' : '10px',
						borderTopRightRadius: '10px',
						borderBottomRightRadius: '10px',
					}}
				/>
			</div>
		</div>
	);
}

export default ResultsPill;
