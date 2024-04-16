import { useState } from 'react';
import { BotData } from '../../data/api/bots.ts';
import { Tournament, joinTournament } from '../../data/api/challenges.ts';
import React from 'react';
import BotSelectionModal, {
	ChallengeEvent,
} from '../BotSelectionModal/BotSelectionModal.tsx';
import Button from '../Button/Button.tsx';
import './TournamentElement.css';

function TournamentElement(props: Tournament & { eligibleBots: BotData[] }) {
	const [displayModal, setDisplayModal] = useState(false);
	const [participants, setParticipants] = useState(props.participants);
	return (
		<div key={props.challengeId} className='tournament'>
			<div>
				<BotSelectionModal
					forEvent={ChallengeEvent.Tournament}
					displayModal={displayModal}
					bots={props.eligibleBots}
					onSelect={(selectedBot) => {
						setParticipants([selectedBot, ...participants]);
						joinTournament(selectedBot.id, props.challengeId);
					}}
					hideModal={() => {
						setDisplayModal(false);
					}}
				/>
				<div className='title'>{props.name}</div>
				<div className='subtitle'>
					<div>{new Date(props.scheduled * 1000).toDateString()}</div>
					{!!participants.length && (
						<div>{participants.length} participants</div>
					)}
				</div>
				{!!participants.length ? (
					<div className='participantsWrapper'>
						{participants.slice(0, 5).map((participant) => {
							return (
								<div className='participant'>
									<div className='botName'>
										<button
											onClick={() => {
												alert(participant.code);
											}}
										>
											{participant.name.substring(0, 25)}
											{participant.name.length > 25 ? '(etc)' : ''}
										</button>
									</div>
									<div className='dots'>
										................................................................................................................................................................
									</div>
									<div className='author'>{participant.ownerName}</div>
								</div>
							);
						})}
						{participants.length > 5 && (
							<button className='seeMore'>see more</button>
						)}
					</div>
				) : (
					<div className='firstToJoin'>
						<div>no participants so far.</div>
						<div>be the first to join</div>
					</div>
				)}
			</div>
			<button
				onClick={() => {
					setDisplayModal(true);
				}}
				className='join'
			>
				Join Now<span className='icon-arrow-right'></span>
			</button>
		</div>
	);
}
export default TournamentElement;
