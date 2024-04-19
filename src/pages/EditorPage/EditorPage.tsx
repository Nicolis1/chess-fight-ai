import { useCallback, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav.tsx';
import Board from '../../components/board/Board.tsx';
import { Chess } from 'chess.js';
import { simulateGames } from '../../data/utils.ts';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import {
	BotData,
	removeBot,
	fetchBots,
	newBot,
	postBotChallenable,
} from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
	faCopy,
	faFloppyDisk,
	faKhanda,
	faPause,
	faPeace,
	faPencil,
	faPlay,
	faRocket,
	faSpinner,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import BotSelectionModal, {
	ChallengeEvent,
} from '../../components/Modals/BotSelectionModal.tsx';
import { Page, setActivePage } from '../../data/features/activePageSlice.ts';
import CodeEditor from '../../components/CodeEditor.tsx';
import { EditorState } from '@codemirror/state';
import { Result } from '../../data/api/challenges.ts';
import { ResultsPill } from '../../components/Modals/ResultsModal.tsx';

function EditorPage() {
	const activeCodeData = useSelector(
		(state: ActiveState) => state.activeCode.value,
	);
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [botData, setBotData] = useState<BotData | null>(null);
	const [selectedTestOpponentData, setSelectedTestOpponentData] =
		useState<BotData | null>(null);
	const [editingTitle, setEditingTitle] = useState(false);
	const [hoveringTitle, setHoveringTitle] = useState(false);
	const [displaySelectionModal, setDisplaySelectionModal] =
		useState<boolean>(false);
	const [allBots, setAllBots] = useState<BotData[] | null>([]);

	const [results, setResults] = useState<Result[] | null>(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);
	const [selectedResult, setSelectedResult] = useState<Result | null>(null);
	const [currentMoveNumber, setCurrentMove] = useState<number>(-1);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			dispatch(setActivePage(Page.EDITOR));

			// todo this fetchbots function is called 6 times on editor load, add a debouncer to the api calls.
			const botsPromise = fetchBots();
			const bots = await botsPromise;
			if (activeCodeData) {
				setBotData(activeCodeData);
			} else if (bots.length > 0) {
				dispatch(setActiveCodeData(bots[0]));
			}
			if (bots.length > 0) {
				setAllBots(bots);
			}
			if (activeUser == null) {
				fetchActiveUser().then((activeUserData) => {
					if (!activeUserData) {
						document.location = '/login';
					} else {
						dispatch(
							setActiveUser({
								id: activeUserData.id,
								username: activeUserData.username,
							}),
						);
					}
				});
			}
		})();
	}, [dispatch, activeCodeData]);
	useEffect(() => {
		setResults(null);
	}, [botData, selectedTestOpponentData]);

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

	const onChange = (code: string) => {
		console.log(botData);
		console.log(botData?.challengable);
		if (botData?.challengable == true) {
			alert(
				'Warning. You can not save edits to public bots. Your changes will be reverted upon reloading',
			);
		}
		if (botData?.id) {
			setBotData({ ...botData, code });
		}
	};

	const getMatchResults = (opponent) => {
		if (botData && botData.code != null) {
			setCalculating(true);
			simulateGames(activeCodeData, opponent)
				.then((response) => {
					setResults(response);
				})
				.finally(() => {
					setCalculating(false);
				});
		} else {
			alert('Nothing to run');
		}
	};
	const submitChanges = async () => {
		if (
			botData &&
			botData.code != null &&
			botData.id != null &&
			botData.name != null
		) {
			fetch('/bots/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					botid: botData.id,
					name: botData.name,
					code: botData.code,
				}),
			});
		} else {
			alert('Nothing to save');
		}
	};
	const displayBotSelectionModalCallback = useCallback(() => {
		setDisplaySelectionModal(true);
		const editor = document.getElementById('editorWrapper');
		if (editor) editor.style.display = 'none';
	}, []);

	const hideBotSelectionModalCallback = useCallback(() => {
		setDisplaySelectionModal(false);
		const editor = document.getElementById('editorWrapper');
		if (editor) editor.style.display = 'block';
	}, []);

	const toggleChallengeable = () => {
		let updatedState = botData?.challengable !== true;

		if (botData?.id) {
			setBotData({ ...botData, challengable: updatedState });

			postBotChallenable(botData?.id, updatedState).then((success) => {
				if (success) {
					dispatch(setActiveCodeData(botData));
				} else {
					// todo better error handling
					alert('error updating bot visibility');
					setBotData({ ...botData, challengable: !updatedState });
				}
			});
		}
	};
	const duplicateBot = useCallback(() => {
		newBot(botData?.code, botData?.name + ' copy').then((bot) => {
			if (bot) {
				dispatch(setActiveCodeData(bot));
				setBotData(bot);
			}
		});
	}, [botData, dispatch]);

	function getBotNameFromId(winner: string) {
		if (!botData) {
			return null;
		}
		if (botData.id === winner) {
			return botData?.name;
		} else {
			return selectedTestOpponentData?.name;
		}
	}
	let wins = 0;
	let losses = 0;
	let draws = 0;
	if (results) {
		results.forEach((result) => {
			if (botData && result.winner == botData.id) {
				wins++;
			} else if (
				selectedTestOpponentData &&
				selectedTestOpponentData?.id == result.winner
			) {
				losses++;
			} else {
				draws++;
			}
		});
	}

	function TitleBar() {
		if (allBots && allBots.length == 0) {
			return (
				<div className='titleBar'>
					<div className='displayTitle'>
						No Bots! Click 'New Bot' in the sidebar to create one
					</div>
				</div>
			);
		}
		return (
			<>
				<div
					className='titleBar'
					onMouseEnter={() => {
						setHoveringTitle(true);
					}}
					onMouseLeave={() => {
						setHoveringTitle(false);
					}}
				>
					{editingTitle ? (
						<input
							className='displayTitle'
							type='text'
							value={botData?.name}
							placeholder='Untitled Bot'
							onChange={(e) => {
								if (botData?.id)
									setBotData({ ...botData, name: e.target.value });
							}}
							onBlur={() => {
								setEditingTitle(false);
							}}
							autoFocus={true}
						/>
					) : (
						<div
							className='displayTitle'
							onClick={() => {
								setEditingTitle(true);
							}}
						>
							{hoveringTitle && (
								<span
									data-tooltip-content={'Edit name'}
									data-tooltip-id={'editor-button'}
								>
									<FontAwesomeIcon icon={faPencil} />
								</span>
							)}
							{!botData && allBots != null && (
								<span className='spinner'>
									<FontAwesomeIcon icon={faSpinner} />
								</span>
							)}
							{botData?.name}
						</div>
					)}

					<div className='editorButtons'>
						<button
							className='custom-button'
							onClick={displayBotSelectionModalCallback}
							data-tooltip-id={'editor-button'}
							data-tooltip-content={'Run'}
						>
							<FontAwesomeIcon icon={faRocket} />
						</button>
						<button
							className='custom-button'
							onClick={submitChanges}
							data-tooltip-id={'editor-button'}
							data-tooltip-content={'Save'}
						>
							<FontAwesomeIcon icon={faFloppyDisk} />
						</button>
						<button
							className='custom-button'
							onClick={toggleChallengeable}
							data-tooltip-id={'editor-button'}
							data-tooltip-content={
								botData?.challengable
									? 'Others can challenge your bot'
									: 'Your bot is private'
							}
						>
							<FontAwesomeIcon
								icon={botData?.challengable ? faKhanda : faPeace}
							/>
						</button>
						<button
							className='custom-button'
							onClick={duplicateBot}
							data-tooltip-id={'editor-button'}
							data-tooltip-content={'Duplicate Bot'}
						>
							<FontAwesomeIcon icon={faCopy} />
						</button>
						<button
							className='custom-button'
							onClick={() => {
								if (botData && allBots) {
									removeBot(botData.id);
									setAllBots(allBots.filter((bot) => bot.id != botData.id));

									for (let bot of allBots) {
										if (bot.id != botData.id) {
											dispatch(setActiveCodeData(bot));
											return;
										}
									}
									setBotData(null);
									dispatch(setActiveCodeData(null));
								}
							}}
							data-tooltip-id={'editor-button'}
							data-tooltip-content={'Delete Bot'}
						>
							<FontAwesomeIcon icon={faTrashCan} />
						</button>
					</div>
				</div>
			</>
		);
	}
	return (
		<div className='editor-container'>
			<Tooltip id='editor-button' />
			<SideNav />
			<div className='editorSection'>
				<BotSelectionModal
					onSelect={(selectedBotData) => {
						if (selectedBotData) {
							setSelectedTestOpponentData(selectedBotData);
							getMatchResults(selectedBotData);
						}
					}}
					bots={allBots || []}
					displayModal={displaySelectionModal}
					hideModal={hideBotSelectionModalCallback}
					forEvent={ChallengeEvent.Challenge}
				></BotSelectionModal>
				<TitleBar />
				<div id='editorWrapper'>
					<CodeEditor
						value={botData?.code}
						onChange={onChange}
						extensions={[]}
					/>
				</div>
			</div>
			<div className='debugger'>
				<div className='gameVisualization'>
					{<Board position={displayFen}></Board>}
				</div>
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
				<div className='testOutput'>
					<div className='title'>
						<h1 id='opponentBotTitle'>
							{results ? (
								<>Test vs. {selectedTestOpponentData?.name}</>
							) : (
								<>Test results will appear here</>
							)}
						</h1>
					</div>
					{calculating && 'calculating'}
					{results && (
						<>
							<ResultsPill wins={wins} losses={losses} draws={draws} />
							<div className='results'>
								{results.map((result, index) => {
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
											{result === selectedResult && (
												<div className='moves'>
													{result.moves.map((move, index) => {
														return (
															<span
																key={`${move}${index}`}
																className={
																	index === currentMoveNumber
																		? 'move current'
																		: 'move'
																}
															>
																{move}
															</span>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default EditorPage;
