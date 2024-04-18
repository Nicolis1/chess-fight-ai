import React, { useCallback, useState } from 'react';
import { BotData } from '../../data/api/bots';
import './Modals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRight,
	faChevronLeft,
	faChevronRight,
	faClose,
	faPause,
	faPlay,
} from '@fortawesome/free-solid-svg-icons';
import BotVisualizationModal from './BotVisualizationModal.tsx';
import { Result } from '../../data/api/challenges.ts';
import { ChallengeData } from '../ChallengeElement/RecentChallenge.tsx';
import Board from '../board/Board.tsx';
import { Chess } from 'chess.js';

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

function ResultsModal(props: {
	displayModal: boolean;
	hideModal: Function;
	challengeData: ChallengeData | null;
}) {
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);
	const [selectedResult, setSelectedResult] = useState<Result | null>(null);
	const [currentMoveNumber, setCurrentMove] = useState<number>(-1);

	const playOneMove = useCallback(() => {
		if (
			!selectedResult ||
			currentMoveNumber >= selectedResult.moves.length - 1
		) {
			return;
		}
		const game = new Chess(displayFen);
		game.move(selectedResult.moves[currentMoveNumber + 1]);
		setCurrentMove(currentMoveNumber + 1);
		setDisplayFen(game.fen());
	}, [displayFen, currentMoveNumber, selectedResult]);

	const backupMove = useCallback(() => {
		let targetMove = currentMoveNumber - 1;
		if (targetMove < -1 || !selectedResult) {
			return;
		} else if (targetMove == 0) {
			setDisplayFen(new Chess().fen());
		}
		const game = new Chess();
		for (let i = 0; i <= targetMove; i++) {
			game.move(selectedResult.moves[i]);
		}
		setDisplayFen(game.fen());
		setCurrentMove(targetMove);
	}, [selectedResult, currentMoveNumber]);

	const playRemainingMoves = useCallback(() => {
		if (!selectedResult) {
			return;
		}
		if (intervalID != null) {
			clearInterval(intervalID);
		}
		const moves = selectedResult.moves;
		let localMoveNumber = currentMoveNumber;
		const game = new Chess(displayFen);
		const id = setInterval(() => {
			if (localMoveNumber >= moves.length - 1) {
				clearInterval(id);
				setIntervalID(null);
				return;
			}
			localMoveNumber++;
			game.move(moves[localMoveNumber]);
			setDisplayFen(game.fen());
			setCurrentMove(localMoveNumber);
		}, 150);
		setIntervalID(id);
	}, [intervalID, playOneMove, displayFen, currentMoveNumber, selectedResult]);

	const closeModal = useCallback(() => {
		props.hideModal();
		if (intervalID) {
			clearInterval(intervalID);
		}
		setSelectedResult(null);
		let game = new Chess();
		setDisplayFen(game.fen());
		setCurrentMove(-1);
	}, [intervalID]);

	if (!props.displayModal) {
		return null;
	}
	if (!props.challengeData) {
		return null;
	}

	return (
		<div
			className='blurrer'
			onClick={(e) => {
				closeModal();
				e.stopPropagation();
			}}
		>
			<div
				className='modalContainer resultsContainer'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className='modalTitle'>
					<h2>Results</h2>
					<button
						className='close'
						onClick={() => {
							closeModal();
						}}
					>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</div>
				<div className='wrapper'>
					<div className='results'>
						{props.challengeData.challenge.matchData.map((result, index) => {
							let text = '';
							let turns = Math.ceil(result.moves.length / 2);
							if (result.winner) {
								text = `Won by ${result.winner} in ${turns} turns`;
							} else {
								text = `Draw after ${turns} turns`;
							}
							return (
								<div
									key={`${index}result`}
									onClick={() => {
										setSelectedResult(result);
										if (intervalID) {
											clearInterval(intervalID);
										}
										let game = new Chess();
										setDisplayFen(game.fen());
										setCurrentMove(-1);
									}}
								>
									{text}
								</div>
							);
						})}
					</div>
					<div className='gameVisualization'>
						{<Board position={displayFen}></Board>}
						<div className='controlButtons'>
							<button onClick={backupMove}>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							{intervalID != null ? (
								<button
									onClick={() => {
										clearInterval(intervalID);
										setIntervalID(null);
									}}
								>
									<FontAwesomeIcon icon={faPause} />
								</button>
							) : (
								<button
									onClick={(e) => {
										playRemainingMoves();
										e.stopPropagation();
									}}
								>
									<FontAwesomeIcon icon={faPlay} />
								</button>
							)}

							<button onClick={playOneMove}>
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
						<div className='resultsMoves'>
							{selectedResult?.moves.map((move, index) => {
								return (
									<span
										key={`${move}${index}`}
										className={
											index === currentMoveNumber ? 'move current' : 'move'
										}
									>
										{move}
									</span>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ResultsModal;
