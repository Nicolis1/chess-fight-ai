import { useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav.tsx';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Button from '../../components/Button/Button.tsx';
import Board from '../../components/board/Board.tsx';
import { Chess } from 'chess.js';
import { simulateGames } from '../../data/utils.ts';
import TestResults from '../../components/TestResults/TestResultsTable.tsx';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { setActiveCodeData } from '../../data/features/activeCodeSlice.ts';
import type { ActiveState } from '../../data/stores/dataStore.ts';
import { setActiveUser } from '../../data/features/activeUserSlice.ts';
import {
	BotData,
	fetchBots,
	newBot,
	postBotChallenable,
} from '../../data/api/bots.ts';
import { fetchActiveUser } from '../../data/api/users.ts';
function EditorPage() {
	const activeCodeData = useSelector(
		(state: ActiveState) => state.activeCode.value,
	);
	const activeUser = useSelector(
		(state: ActiveState) => state.activeUser.value,
	);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

	const [botData, setBotData] = useState<BotData | null>(null);
	const [selectedTestOpponentData, setSelectedTestOpponentData] =
		useState<BotData | null>(null);
	const [editingTitle, setEditingTitle] = useState(false);
	const [hoveringTitle, setHoveringTitle] = useState(false);
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
			const bots = await fetchBots();
			if (activeCodeData) {
				setBotData(activeCodeData);
			} else if (bots.length > 0) {
				dispatch(setActiveCodeData(bots[0]));
			} else {
				const bot = await newBot();
				if (bot) dispatch(setActiveCodeData(bot));
			}
			if (bots.length > 0) {
				setAllBots(bots);
				setSelectedTestOpponentData(bots[0]);
			}
		})();
	}, [dispatch]);

	const onChange = (code: string) => {
		setBotData({ ...botData, code });
	};

	const finishSimulation = (results) => {
		setCalculating(false);
		setResults(results);
	};
	const runCode = () => {
		if (botData && botData.code != null) {
			setCalculating(true);

			simulateGames(activeCodeData, selectedTestOpponentData, finishSimulation);
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
			const resp = await fetch('/bots/update', {
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
			console.log(resp);
		} else {
			alert('Nothing to save');
		}
	};

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
			<Tooltip id='editor-button-edit-name' />
			<Tooltip id='editor-button-run' />
			<Tooltip id='editor-button-submit' />
			<Tooltip id='editor-button-challengable' />

			<SideNav />
			<div className='editorSection'>
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
									data-tooltip-id={'editor-button-edit-name'}
									className='icon-pencil'
								/>
							)}
							{botData?.name}
						</div>
					)}

					<div className='editorButtons'>
						<Button
							icon='icon-control-play'
							onClick={runCode}
							tooltipID={'editor-button-run'}
							tooltipContent={'Run'}
						/>
						<Button
							icon='icon-rocket'
							onClick={submitChanges}
							tooltipID={'editor-button-submit'}
							tooltipContent={'Submit'}
						/>
						<Button
							icon={botData?.challengable ? 'icon-support' : 'icon-target'}
							onClick={toggleChallengeable}
							tooltipID={'editor-button-challengable'}
							tooltipContent={
								botData?.challengable
									? 'Make bot private'
									: 'Allow others to challenge your bot'
							}
						/>
					</div>
				</div>
				<div className='editorWrapper'>
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
						<h1 id='opponentBotTitle'>Test Vs.</h1>
						{/*todo known bug, opponent title is too long wrecks layout - limit display length */}
						<select
							name='opponentBot'
							aria-labelledby='opponentBotTitle'
							value={selectedTestOpponentData?.id}
							onChange={(e) => {
								const selectedBotData = allBots.find(
									(botData) => botData.id === e.target.value,
								);

								setSelectedTestOpponentData(selectedBotData || allBots[0]);
							}}
						>
							{allBots.map((botData) => {
								return (
									<option key={botData.id} value={botData.id}>
										{botData.name}
									</option>
								);
							})}
						</select>
					</div>
					{calculating && 'calculating'}
					{results != null && (
						<TestResults response={results} playMoves={playMoves} />
					)}
				</div>
			</div>
		</div>
	);
}

export default EditorPage;
