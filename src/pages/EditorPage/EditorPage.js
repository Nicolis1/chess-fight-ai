import { React, useCallback, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import Board from '../../components/board/Board';
import { Chess } from 'chess.js';
import { STARTER_CODE, simulateGames } from '../../data/utils';

function EditorPage() {
	// const activeCode = useSelector((state) => state.activeCode.value);
	const [activeCodeLocal, setActiveCode] = useState(STARTER_CODE);
	const [results, setResults] = useState(null);
	const [calculating, setCalculating] = useState(false);
	const onChange = useCallback((code) => {
		setActiveCode(code);
	});

	const finishSimulation = useCallback((results) => {
		console.log('called back');
		setCalculating(false);
		setResults(results);

		console.log(results);
	});
	const runCode = useCallback(() => {
		//TODO move this to backend
		setCalculating(true);
		console.log('begin simulation');
		const decisionFunction = new Function('position', activeCodeLocal);

		simulateGames(decisionFunction, finishSimulation);
	});

	const resultComponents = results?.map((result) => {
		<p>{result}</p>;
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
					{<Board position={new Chess().fen()}></Board>}
				</div>
				<div className='testOutput'>{calculating && 'calculating'}</div>
				{resultComponents}
			</div>
		</div>
	);
}

export default EditorPage;
