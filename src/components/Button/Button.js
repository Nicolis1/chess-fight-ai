import { React } from 'react';
import './Button.css';

export default function Button(props) {
	return (
		<div className='icon' onClick={props.onClick}>
			<i className={props.icon} />
		</div>
	);
}
