import React, { useState } from 'react';
import { BotData } from '../../data/api/bots';
import './Modals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faClose } from '@fortawesome/free-solid-svg-icons';
import BotVisualizationModal from './BotVisualizationModal.tsx';

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
	subtitle?: string;
}) {
	const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
	const [botToVisualize, setBotToVisualize] = useState<BotData | null>(null);

	if (!props.displayModal) {
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
	if (!props.bots?.length) {
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
						<div>
							<h2>{title}</h2>
							<p>{props.subtitle}</p>
						</div>
						<button
							className='close'
							onClick={() => {
								props.hideModal();
							}}
						>
							<FontAwesomeIcon icon={faClose} />
						</button>
					</div>
					<div
						className='botsToSelect'
						style={{ height: '200px', textAlign: 'center', cursor: 'default' }}
					>
						You have no eligible bots to select.{' '}
						<a href='/editor'>Head to the editor to make one!</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className='blurrer'
			onClick={(e) => {
				props.hideModal();
				e.stopPropagation();
			}}
		>
			<BotVisualizationModal
				displayModal={!!botToVisualize}
				hideModal={() => {
					setBotToVisualize(null);
				}}
				botData={botToVisualize}
			/>
			<div
				className='modalContainer'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className='modalTitle'>
					<div>
						<h2>{title}</h2>
						<p>{props.subtitle}</p>
					</div>
					<button
						className='close'
						onClick={() => {
							props.hideModal();
						}}
					>
						<FontAwesomeIcon icon={faClose} />
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
								<button
									onClick={(e) => {
										setBotToVisualize(bot);
										e.stopPropagation();
									}}
									className='viewCode custom-button'
								>
									View Code <FontAwesomeIcon icon={faArrowRight} />
								</button>
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
							setSelectedBot(null);
						}}
						className='select'
					>
						{`${selectButtonText} ${selectedBot?.name.substring(0, 30) || '?'}${
							selectedBot && selectedBot?.name.length > 30 ? '...' : ''
						}`}
						<span className='icon-arrow-right' />
					</button>
				</div>
			</div>
		</div>
	);
}

export default BotSelectionModal;
