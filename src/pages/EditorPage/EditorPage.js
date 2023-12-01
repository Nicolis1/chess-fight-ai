import { React, useEffect, useState } from 'react';
import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';
import Editor from '@monaco-editor/react';

function EditorPage() {
	const code = 'console.log("Hello, Monaco Editor!");';
	return (
		<div className='container'>
			<SideNav />
			<div className='editorSection'>
				<div className='titleBar'>Untitled</div>
				<div className='editorWrapper'>
					<Editor defaultLanguage='javascript' defaultValue={code} />
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
