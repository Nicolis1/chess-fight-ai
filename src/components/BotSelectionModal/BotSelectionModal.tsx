import React, { useState } from 'react';
import { BotData } from '../../data/api/bots';
import './BotSelectionModal.css';

export enum ChallengeEvent {
	Challenge,
	Tournament,
}
function BotSelectionModal(props: {
	onSelect: Function;
	bots: BotData[];
	displayModal: boolean;
	hideModal: Function;
	forEvent: ChallengeEvent;
}) {
	const [selectedBot, setSelectedBot] = useState<BotData>(props.bots[0]);
	if (!props.displayModal) {
		return null;
	}
	if (!props.bots?.length) {
		return null;
	}
	let title = 'Select Bot';
	let selectButtonText = 'Select';
	switch (props.forEvent) {
		case ChallengeEvent.Challenge:
			title = 'Select Bot For Challenge';
			selectButtonText = 'Initiate Challenge Using ';
			break;
		case ChallengeEvent.Tournament:
			title = 'Select Bot For Tournament';
			selectButtonText = 'Enter Tournament With ';
			break;
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
					<h2>{title}</h2>
					<button
						className='close'
						onClick={() => {
							props.hideModal();
						}}
					>
						<span className='icon-close' />
					</button>
				</div>
				<div className='botsToSelect'>
					{props.bots.map((bot) => {
						return (
							<div
								key={bot.id}
								onClick={(e) => {
									setSelectedBot(bot);
								}}
								className={
									selectedBot?.id === bot.id
										? 'botToSelect selected'
										: 'botToSelect'
								}
							>
								{(bot?.name || '?').substring(0, 40)}
								{bot?.name.length > 40 ? '...' : ''}
								<span
									onClick={(e) => {
										alert(bot.code);
										e.stopPropagation();
									}}
								>
									View Code <span className='icon-arrow-right' />
								</span>
							</div>
						);
					})}
				</div>
				<div className='footerButtons'>
					<button
						onClick={() => {
							props.hideModal();
						}}
						className='cancel'
					>
						Cancel
					</button>
					<button
						disabled={!selectedBot}
						onClick={() => {
							props.hideModal();
							props.onSelect(selectedBot);
						}}
						className='select'
					>
						{`${selectButtonText} ${selectedBot?.name.substring(0, 30) || '?'}${
							selectedBot?.name.length > 30 ? '...' : ''
						}`}
						<span className='icon-arrow-right' />
					</button>
				</div>
			</div>
		</div>
	);
}

export default BotSelectionModal;
