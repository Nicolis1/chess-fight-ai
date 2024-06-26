import { BotData } from './bots';

export type MatchData = Result; // todo update this with proper type

export type Tournament = {
	challengeId: string;
	matchData: MatchData[];
	participants: BotData[];
	scheduled: number;
	type: string;
	name: string;
};
export type Result = {
	draw: boolean;
	moves: string[];
	turns: number;
	whitePieces: string;
	winner: string | null;
	reachedMoveLimit: boolean;
};

export async function fetchTournaments(): Promise<Tournament[]> {
	try {
		const resp = await fetch('/api/challenges/tournaments', {
			method: 'GET',
		});
		const tournamentsForReturn: Tournament[] = [];
		for (let tournament of JSON.parse(await resp.json())?.challenges) {
			tournamentsForReturn.push({
				challengeId: tournament.challengeid,
				matchData: tournament.match_data,
				participants: tournament.participantData.map((pData): BotData => {
					return {
						name: pData.botName,
						id: pData.botid,
						challengable: pData.challengable,
						code: pData.code,
						ownerName: pData.username,
					};
				}),
				scheduled: tournament.scheduled,
				type: tournament.type,
				name: tournament.name,
			});
		}
		return tournamentsForReturn;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function challengeBot(botId: string, opponentBotId: string) {
	try {
		const resp = await fetch('/api/challenges/direct', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ botid: botId, opponentid: opponentBotId }),
		});
		if (resp.status === 200) {
			const result = JSON.parse(await resp.json());
			const jsonResult = JSON.parse(result);
			// todo, output from this api call is too nested
			return jsonResult.output.results;
		}
		return false;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function joinTournament(botId: string, tournamentId: string) {
	try {
		const resp = await fetch('/api/challenges/tournaments/join', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ botid: botId, tournament: tournamentId }),
		});
		const result = JSON.parse(await resp.json());
		return result;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function fetchChallenges(all = false): Promise<Tournament[]> {
	try {
		const url = all ? '/api/challenges/direct/all' : '/api/challenges/direct';
		const resp = await fetch(url, {
			method: 'GET',
		});
		const challengesForReturn: Tournament[] = [];
		for (let tournament of JSON.parse(await resp.json())?.challenges) {
			const parsedMatchData = JSON.parse(tournament.match_data).output.results;
			challengesForReturn.push({
				challengeId: tournament.challengeid,
				matchData: parsedMatchData,
				participants: tournament.participantData.map((pData): BotData => {
					return {
						name: pData.botName,
						id: pData.botid,
						challengable: pData.challengable,
						code: pData.code,
						ownerName: pData.username,
					};
				}),
				scheduled: tournament.scheduled,
				type: tournament.type,
				name: tournament.name,
			});
		}
		return challengesForReturn;
	} catch (error) {
		console.error(error);
		return [];
	}
}
