import React from 'react';
import './Button.css';

export default function Button(props) {
	return (
		<div className='custom-button' onClick={props.onClick}>
			<div className='children'>{props.children}</div>
			<span
				data-tooltip-content={props.tooltipContent}
				data-tooltip-id={props.tooltipID}
			>
				<i className={props.icon} />
			</span>
		</div>
	);
}
