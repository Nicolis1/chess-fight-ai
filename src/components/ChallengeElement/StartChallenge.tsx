import { useCallback, useState } from 'react';
import { BotData } from '../../data/api/bots.ts';
import React from 'react';
import BotSelectionModal, {
	ChallengeEvent,
} from '../Modals/BotSelectionModal.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKhanda } from '@fortawesome/free-solid-svg-icons';

import './Challenge.css';
import BotVisualizationModal from '../Modals/BotVisualizationModal.tsx';
function StartChallenge(props: {
	botData: BotData;
	disabled: boolean;
	onChallenge: Function;
	eligibleBots: BotData[];
}) {
	const [displayModal, setDisplayModal] = useState(false);
	const [botToVisualize, setBotToVisualize] = useState<BotData | null>(null);
	const hideSelectionModal = useCallback(() => {
		setDisplayModal(false);
	}, []);
	const hideVisualizationModal = useCallback(() => {
		setBotToVisualize(null);
	}, []);
	return (
		<div key={props.botData.id} className='challenge'>
			<BotSelectionModal
				forEvent={ChallengeEvent.Challenge}
				displayModal={displayModal}
				bots={props.eligibleBots}
				onSelect={(selectedBot) => {
					props.onChallenge(selectedBot);
				}}
				hideModal={hideSelectionModal}
			/>
			<BotVisualizationModal
				botData={botToVisualize}
				displayModal={!!botToVisualize}
				hideModal={hideVisualizationModal}
			/>
			<div className='challenger'>
				<div className='botName'>
					<button
						onClick={() => {
							setBotToVisualize(props.botData);
						}}
					>
						{props.botData.name.substring(0, 25)}
					</button>
				</div>
				<div className='dots'>
					................................................................................................................................................................
				</div>
				<div className='author'>{props.botData.ownerName}</div>
				<button
					disabled={props.disabled}
					className='joinChallenge'
					onClick={() => {
						setDisplayModal(true);
					}}
					data-tooltip-id='challenge-page'
					data-tooltip-content={
						props.disabled
							? 'wait for pending challenge'
							: `challenge ${props.botData.name}`
					}
				>
					Challenge <FontAwesomeIcon icon={faKhanda} />
				</button>
			</div>
		</div>
	);
}

export default StartChallenge;
