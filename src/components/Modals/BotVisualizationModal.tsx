import React from 'react';
import { BotData } from '../../data/api/bots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './Modals.css';
function BotVisualizationModal(props: {
	botData: BotData | null;
	hideModal: Function;
	displayModal: boolean;
}) {
	if (!props.displayModal || !props.botData || !props.botData.code) {
		return false;
	}
	return (
		<div
			className='blurrer'
			onClick={(e) => {
				props.hideModal();
				e.stopPropagation();
			}}
		>
			<div
				className='modalContainer'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className='modalTitle'>
					<h2>
						{props.botData.name.substring(0, 30)}
						{props.botData.name.length > 30 ? '...' : ''} by{' '}
						{props.botData.ownerName}
					</h2>
					<button
						className='close'
						onClick={() => {
							props.hideModal();
						}}
					>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</div>
				<div className='bot-code-wrapper'>
					<textarea
						id='bot-code-visual'
						name='Bot Code'
						value={props.botData.code}
						readOnly={true}
						disabled={true}
					/>
				</div>
			</div>
		</div>
	);
}
export default BotVisualizationModal;
