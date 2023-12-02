import { React, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import Board from '../../components/board/Board';

function EditorPage() {
	const activeCode = useSelector((state) => state.activeCode.value);

	return (
		<div className='container'>
			<SideNav />
			<div className='editorSection'>
				<div className='titleBar'>
					<div>Untitled</div>
					<div className='editorButtons'>
						<Button icon='icon-control-play' onClick={() => {}}></Button>
						<Button icon='icon-rocket' onClick={() => {}}></Button>
					</div>
				</div>
				<div className='editorWrapper'>
					<CodeMirror
						value={activeCode}
						extensions={[javascript({ jsx: false })]}
						onChange={() => {}}
						height='900px'
					/>
				</div>
			</div>
			<div className='debugger'>
				<div className='gameVisualization'>
					{/* <Board position={new Position()} extrasVisible={false}></Board> */}
				</div>
				<div className='testOutput'></div>
			</div>
		</div>
	);
}

export default EditorPage;
