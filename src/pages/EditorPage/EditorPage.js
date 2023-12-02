import { React, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useSelector } from 'react-redux';

function EditorPage() {
	const activeCode = useSelector((state) => state.activeCode.value);

	return (
		<div className='container'>
			<SideNav />
			<div className='editorSection'>
				<div className='titleBar'>Untitled</div>
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
				<div className='gameVisualization'></div>
				<div className='testOutput'></div>
			</div>
		</div>
	);
}

export default EditorPage;
