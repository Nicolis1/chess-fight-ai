import { React } from 'react';
import './Button.css';

export default function Button(props) {
	return (
		<div className='icon' onClick={props.onClick}>
			<a
				data-tooltip-content={props.tooltipContent}
				data-tooltip-id={props.tooltipID}
			>
				<i className={props.icon} />
				{props.children}
			</a>
		</div>
	);
}
