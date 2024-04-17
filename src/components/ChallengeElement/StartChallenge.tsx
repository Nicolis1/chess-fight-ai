import { useState } from 'react';
import { BotData } from '../../data/api/bots.ts';
import React from 'react';
import BotSelectionModal, {
	ChallengeEvent,
} from '../Modals/BotSelectionModal.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKhanda } from '@fortawesome/free-solid-svg-icons';

import './Challenge.css';
function StartChallenge(props: {
	id?: string;
	name: string;
	owner?: string;
	code: string;
	onChallenge: Function;
	eligibleBots: BotData[];
}) {
	const [displayModal, setDisplayModal] = useState(false);

	return (
		<div key={props.id} className='challenge'>
			<BotSelectionModal
				forEvent={ChallengeEvent.Challenge}
				displayModal={displayModal}
				bots={props.eligibleBots}
				onSelect={(selectedBot) => {
					props.onChallenge(selectedBot);
				}}
				hideModal={() => {
					setDisplayModal(false);
				}}
			/>

			<div className='challenger'>
				<div className='botName'>
					<button
						onClick={() => {
							alert(props.code);
						}}
					>
						{props.name.substring(0, 25)}
					</button>
				</div>
				<div className='dots'>
					................................................................................................................................................................
				</div>
				<div className='author'>{props.owner}</div>
				<button
					className='joinChallenge'
					onClick={() => {
						setDisplayModal(true);
					}}
					data-tooltip-id='challenge-page'
					data-tooltip-content={`challenge ${props.name}`}
				>
					Challenge <FontAwesomeIcon icon={faKhanda} />
				</button>
			</div>
		</div>
	);
}

export default StartChallenge;
