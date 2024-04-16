import React, { MouseEventHandler, ReactElement, ReactNode } from 'react';
import './Button.css';

export default function Button(props: {
	onClick: MouseEventHandler<HTMLButtonElement>;
	onRightClick?: Function;
	children?: ReactNode | ReactElement;
	tooltipContent?: string;
	tooltipId?: string;
	icon?: string;
}) {
	return (
		<button
			className='custom-button'
			onClick={props.onClick}
			onContextMenu={(e) => {
				if (!!props.onRightClick) {
					props.onRightClick();
					e.preventDefault();
				}
			}}
		>
			{props.children && <div className='children'>{props.children}</div>}
			<span
				data-tooltip-content={props.tooltipContent}
				data-tooltip-id={props.tooltipId}
			>
				<i className={props.icon} />
			</span>
		</button>
	);
}
