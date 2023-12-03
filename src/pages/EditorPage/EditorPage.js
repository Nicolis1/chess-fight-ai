import { React, useCallback, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Button from '../../components/Button/Button';
import Board from '../../components/board/Board';
import { Chess } from 'chess.js';
import { STARTER_CODE, simulateGames } from '../../data/utils';
import TestResults from '../../components/TestResults/TestResultsTable';

function EditorPage() {
	// const activeCode = useSelector((state) => state.activeCode.value);
	const [activeCodeLocal, setActiveCode] = useState(STARTER_CODE);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState(null);

	const onChange = useCallback((code) => {
		setActiveCode(code);
	});

	const finishSimulation = useCallback((results) => {
		setCalculating(false);
		setResults(results);
	});
	const runCode = useCallback(() => {
		//TODO move this to backend
		setCalculating(true);
		const decisionFunction = new Function('position', activeCodeLocal);
		simulateGames(decisionFunction, finishSimulation);
	});
	const playMoves = useCallback((moves) => {
		const movesClone = [...moves];
		if (intervalID != null) {
			clearInterval(intervalID);
		}
		let game = new Chess();
		console.log(movesClone);
		const id = setInterval(() => {
			if (movesClone.length > 0) {
				game.move(movesClone.shift());
			} else {
				clearInterval(id);
			}
			setDisplayFen(game.fen());
		}, 100);
		setIntervalID(id);
	});

	return (
		<div className='container'>
			<SideNav />
			<div className='editorSection'>
				<div className='titleBar'>
					<div>Untitled</div>
					<div className='editorButtons'>
						<Button icon='icon-control-play' onClick={runCode}></Button>
						<Button icon='icon-rocket' onClick={() => {}}></Button>
					</div>
				</div>
				<div className='editorWrapper'>
					<CodeMirror
						value={activeCodeLocal}
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
