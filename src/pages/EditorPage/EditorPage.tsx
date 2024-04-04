import { useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav.tsx';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Button from '../../components/Button/Button.tsx';
import Board from '../../components/board/Board.tsx';
import { Chess } from 'chess.js';
import { fetchBots, newBot, simulateGames } from '../../data/utils.ts';
import TestResults from '../../components/TestResults/TestResultsTable.tsx';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import {
	setActiveCodeData,
	type BotData,
} from '../../data/features/activeCodeSlice.ts';
import type { ActiveCodeState } from '../../data/stores/dataStore.ts';
function EditorPage() {
	const activeCodeData = useSelector(
		(state: ActiveCodeState) => state.activeCode.value,
	);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

	const [botData, setBotData] = useState<BotData | null>(null);
	const [editingTitle, setEditingTitle] = useState(false);
	const [hoveringTitle, setHoveringTitle] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			if (activeCodeData) {
				try {
					setBotData(activeCodeData);
				} catch (error) {
					console.error(error);
					alert(error.message);
				}
			} else {
				const bots = await fetchBots();
				if (bots.length > 0) {
					dispatch(setActiveCodeData(bots[0]));
				} else {
					const bot = await newBot();
					if (bot) dispatch(setActiveCodeData(bot));
				}
			}
		})();
	}, [activeCodeData, dispatch]);

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
			// new Function call's eval on user submitted code, this is potentially dangerous
			// eslint-disable-next-line no-new-func
			const decisionFunction = new Function('position', botData.code);
			simulateGames(decisionFunction, finishSimulation);
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
			// todo, save updates to code
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
			<Tooltip id='editor-button-run' />
			<Tooltip id='editor-button-submit' />

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
							<span>{botData?.name}</span>
							{hoveringTitle && <Button icon={'icon-pencil'} />}
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
