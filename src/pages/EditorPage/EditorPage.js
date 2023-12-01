import { React, useEffect, useState } from 'react';

import './EditorPage.css';
import SideNav from '../../components/SideNav/SideNav';

function EditorPage() {
	return (
		<div className='container'>
			<SideNav />
			<div className='editor'></div>
			<div className='debugger'>
				<div className='gameVisualization'></div>
				<div className='testOutput'></div>
			</div>
		</div>
	);
}

export default EditorPage;
