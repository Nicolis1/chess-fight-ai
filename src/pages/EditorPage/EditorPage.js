import { React, useCallback, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Button from '../../components/Button/Button';
import Board from '../../components/board/Board';
import { Chess } from 'chess.js';
import { simulateGames } from '../../data/utils';
import TestResults from '../../components/TestResults/TestResultsTable';
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function EditorPage() {
	const activeCodeID = useSelector((state) => state.activeCode.value);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const [displayFen, setDisplayFen] = useState(new Chess().fen());
	const [intervalID, setIntervalID] = useState(null);
	const [user] = useAuthState(auth);
	const [botData, setBotData] = useState({});

	useEffect(() => {
		(async () => {
			if (activeCodeID) {
				try {
					const docRef = doc(
						firestore,
						'users',
						user.uid,
						'bots',
						activeCodeID,
					);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						const data = docSnap.data();
						console.log('Document data:', data);
						setBotData(data);
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
	}, [activeCodeID, user]);

	const onChange = useCallback((code) => {
		setBotData({ ...botData, code });
	});

	const finishSimulation = useCallback((results) => {
		setCalculating(false);
		setResults(results);
	});
	const runCode = useCallback(() => {
		if (botData.code != null) {
			setCalculating(true);
			const decisionFunction = new Function('position', botData.code);
			simulateGames(decisionFunction, finishSimulation);
		} else {
			alert('Nothing to run');
		}
	});
	const submitChanges = useCallback(async () => {
		if (botData.code != null && botData.botID != null && botData.name != null) {
			setDoc(doc(firestore, 'users', user.uid, 'bots', activeCodeID), {
				name: 'Untitled',
				owner: user.uid,
				code: botData.code,
				botID: botData.botID,
			});
		} else {
			alert('Nothing to save');
		}
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
						value={botData.code}
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
