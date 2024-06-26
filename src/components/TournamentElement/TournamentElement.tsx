import { useCallback, useState } from 'react';
import { BotData } from '../../data/api/bots.ts';
import { Tournament, joinTournament } from '../../data/api/challenges.ts';
import React from 'react';
import BotSelectionModal, {
	ChallengeEvent,
} from '../Modals/BotSelectionModal.tsx';
import './TournamentElement.css';
import BotVisualizationModal from '../Modals/BotVisualizationModal.tsx';

function TournamentElement(props: Tournament & { eligibleBots: BotData[] }) {
	const [displayModal, setDisplayModal] = useState(false);
	const [participants, setParticipants] = useState(props.participants);
	const [botToVisualize, setBotToVisualize] = useState<BotData | null>(null);
	const [seeMore, setSeeMore] = useState(false);

	const toggleSeeMore = useCallback(() => {
		setSeeMore(!seeMore);
	}, [seeMore]);
	const hideSelectionModal = useCallback(() => {
		setDisplayModal(false);
	}, []);
	const hideVisualizationModal = useCallback(() => {
		setBotToVisualize(null);
	}, []);

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
					hideModal={hideSelectionModal}
					subtitle='Bots must be public to enter, and can enter each tournament only once'
				/>
				<BotVisualizationModal
					botData={botToVisualize}
					displayModal={!!botToVisualize}
					hideModal={hideVisualizationModal}
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
						{participants
							.slice(0, seeMore ? participants.length : 5)
							.map((participant) => {
								return (
									<div className='participant' key={participant.id}>
										<div className='botName'>
											<button
												onClick={() => {
													setBotToVisualize(participant);
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
							<button className='seeMore' onClick={toggleSeeMore}>
								{seeMore ? 'show less' : 'see more'}
							</button>
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
				data-tooltip-id='challenge-page'
				data-tooltip-content='You can enter more than one bot to each tournament!'
			>
				Join Now<span className='icon-arrow-right'></span>
			</button>
		</div>
	);
}
export default TournamentElement;
