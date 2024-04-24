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

export function ResultsPill(props: {
	wins: number;
	losses: number;
	draws: number;
}) {
	let { wins, losses, draws } = props;
	let total = wins + losses + draws;
	return (
		<div className='pillContainer'>
			<span
				className='wins'
				style={{
					width: `${(wins / total) * 100}%`,
					backgroundColor: '#03C04A',
					borderTopLeftRadius: '10px',
					borderBottomLeftRadius: '10px',
					borderTopRightRadius: losses > 0 || draws > 0 ? '0' : '10px',
					borderBottomRightRadius: losses > 0 || draws > 0 ? '0' : '10px',
				}}
			/>
			<span
				className='draws'
				style={{
					width: `${(draws / total) * 100}%`,
					backgroundColor: '#DE970B',
					borderTopLeftRadius: wins > 0 ? '0' : '10px',
					borderBottomLeftRadius: wins > 0 ? '0' : '10px',
					borderTopRightRadius: losses > 0 ? '0' : '10px',
					borderBottomRightRadius: losses > 0 ? '0' : '10px',
				}}
			/>
			<span
				className='losses'
				style={{
					width: `${(losses / total) * 100}%`,
					backgroundColor: '#C61A09',
					borderTopLeftRadius: wins > 0 || draws > 0 ? '0' : '10px',
					borderBottomLeftRadius: wins > 0 || draws > 0 ? '0' : '10px',
					borderTopRightRadius: '10px',
					borderBottomRightRadius: '10px',
				}}
			/>
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

	const getBotNameFromId = useCallback(
		(id: string) => {
			if (props.challengeData?.challenge.participants[0].id == id) {
				return props.challengeData?.challenge.participants[0].name;
			} else {
				return props.challengeData?.challenge.participants[1].name;
			}
		},
		[props],
	);

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
				className='modalContainer resultsContainer wide'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className='modalTitle'>
					<div className='resultTitle'>
						<span>Results</span>
						<ResultsPill
							wins={props.challengeData.player1Wins}
							losses={props.challengeData.player2Wins}
							draws={props.challengeData.draws}
						/>
					</div>
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
								text = `Won by ${getBotNameFromId(
									result.winner,
								)} in ${turns} turns`;
							} else {
								text = `Draw after ${turns} turns`;
							}
							return (
								<div
									key={`${index}result`}
									className={
										result === selectedResult ? 'selected result' : 'result'
									}
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
						{selectedResult && (
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
						)}
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
