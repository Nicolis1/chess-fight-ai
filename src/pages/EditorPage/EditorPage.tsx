import { useCallback, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav.tsx';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Board from '../../components/board/Board.tsx';
import { Chess } from 'chess.js';
import { simulateGames } from '../../data/utils.ts';
import TestResults from '../../components/TestResults/TestResultsTable.tsx';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import {
	BotData,
	fetchBots,
	newBot,
	postBotChallenable,
} from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';
import { Result } from '../../components/ResultsPill/ResultsPill.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCopy,
	faFloppyDisk,
	faKhanda,
	faPeace,
	faPlay,
} from '@fortawesome/free-solid-svg-icons';
import BotSelectionModal, {
	ChallengeEvent,
} from '../../components/BotSelectionModal/BotSelectionModal.tsx';

function EditorPage() {
	const activeCodeData = useSelector(
		(state: ActiveState) => state.activeCode.value,
	);
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [results, setResults] = useState<Result[] | null>(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

	const [botData, setBotData] = useState<BotData | null>(null);
	const [selectedTestOpponentData, setSelectedTestOpponentData] =
		useState<BotData | null>(null);
	const [editingTitle, setEditingTitle] = useState(false);
	const [hoveringTitle, setHoveringTitle] = useState(false);
	const [displaySelectionModal, setDisplaySelectionModal] =
		useState<boolean>(false);
	const [allBots, setAllBots] = useState<BotData[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
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
			// todo this fetchbots function is called 6 times on editor load, add a debouncer to the api calls.
			fetchBots().then((bots) => {
				if (activeCodeData) {
					setBotData(activeCodeData);
				} else if (bots.length > 0) {
					dispatch(setActiveCodeData(bots[0]));
				} else {
					newBot().then((bot) => {
						if (bot) dispatch(setActiveCodeData(bot));
					});
				}
				if (bots.length > 0) {
					setAllBots(bots);
					setSelectedTestOpponentData(bots[0]);
				}
			});
		})();
	}, [dispatch, activeUser, activeCodeData]);

	const onChange = (code: string) => {
		if (botData?.id) setBotData({ ...botData, code });
	};

	const runCode = () => {
		if (botData && botData.code != null) {
			setCalculating(true);
			simulateGames(activeCodeData, selectedTestOpponentData)
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

	const playMoves = (moves) => {
		const movesClone = [...moves];
		if (intervalID != null) {
			clearInterval(intervalID);
		}
		let game = new Chess();
		// quick delay before starting to readjust focus visually
		setDisplayFen(game.fen());

		setTimeout(() => {
			const id = setInterval(() => {
				if (movesClone.length > 0) {
					game.move(movesClone.shift());
				} else {
					clearInterval(id);
				}
				setDisplayFen(game.fen());
			}, 150);
			setIntervalID(id);
		}, 500);
	};
	return (
		<div className='container'>
			<Tooltip id='editor-button' />
			<SideNav />
			<div className='editorSection'>
				<BotSelectionModal
					onSelect={(selectedBotData) => {
						if (selectedBotData) {
							setSelectedTestOpponentData(selectedBotData);
							runCode();
						}
					}}
					bots={allBots}
					displayModal={displaySelectionModal}
					hideModal={hideBotSelectionModalCallback}
					forEvent={ChallengeEvent.Challenge}
				></BotSelectionModal>
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
									className='icon-pencil'
								/>
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
							<FontAwesomeIcon icon={faPlay} />
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
					</div>
				</div>
				<div id='editorWrapper'>
					<CodeMirror
						value={botData?.code}
						extensions={[javascript({ jsx: false })]}
						onChange={onChange}
						height='900px'
					/>
				</div>
			</div>
			<div className='debugger'>
				<div className='gameVisualization'>
					{<Board position={displayFen}></Board>}
				</div>
				<div className='testOutput'>
					<div className='title'>
						<h1 id='opponentBotTitle'>
							Test Vs. {selectedTestOpponentData?.name}
						</h1>
					</div>
					{calculating && 'calculating'}
					{results != null && activeCodeData && (
						<TestResults
							results={results}
							playMoves={playMoves}
							playerId={activeCodeData.id}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default EditorPage;
