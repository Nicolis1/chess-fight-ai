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
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

function EditorPage() {
	const activeCodeID = useSelector((state) => state.activeCode.value);
	const [activeCodeLocal, setActiveCode] = useState(STARTER_CODE);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState(null);
	const [botID, setBotID] = useState(null);
	const [userID, setUserID] = useState(null);

	useEffect(() => {
		(async () => {
			if (activeCodeID) {
				try {
					const docRef = doc(firestore, 'bots', activeCodeID);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						const data = docSnap.data();
						console.log('Document data:', data);
						setActiveCode(data.code);
						setBotID(data.botID);
						setUserID(data.owner);
					} else {
						// docSnap.data() will be undefined in this case
						console.log('No such document!');
					}
				} catch (error) {
					console.error(error);
					alert(error.message);
				}
			}
		})();
	}, [activeCodeID]);

	const onChange = useCallback((code) => {
		setActiveCode(code);
	});

	const finishSimulation = useCallback((results) => {
		setCalculating(false);
		setResults(results);
	});
	const runCode = useCallback(() => {
		setCalculating(true);
		const decisionFunction = new Function('position', activeCodeLocal);
		simulateGames(decisionFunction, finishSimulation);
	});
	const submitChanges = useCallback(async () => {
		await setDoc(doc(firestore, 'bots', activeCodeID), {
			name: 'Untitled',
			owner: userID,
			code: activeCodeLocal,
			botID: botID,
		});
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
			<Tooltip id='editor-button-run' />
			<Tooltip id='editor-button-submit' />

			<SideNav />
			<div className='editorSection'>
				<div className='titleBar'>
					<div>Untitled</div>
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
