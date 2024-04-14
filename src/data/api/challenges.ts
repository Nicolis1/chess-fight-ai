import { BotData } from './bots';

export type MatchData = any; // todo update this with proper type

export type Tournament = {
	challengeId: string;
	matchData: MatchData[];
	participants: BotData[];
	scheduled: number;
	type: string;
	name: string;
};

export async function fetchTournaments(): Promise<Tournament[]> {
	try {
		const resp = await fetch('/challenges/tournaments', {
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
		const resp = await fetch('/challenges/direct', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ botid: botId, opponentid: opponentBotId }),
		});
		const result = JSON.parse(await resp.json());
		const jsonResult = JSON.parse(result.result);
		// todo, output from this api call is too nested
		return jsonResult.output.results;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function joinTournament(botId: string, tournamentId: string) {
	try {
		const resp = await fetch('/challenges/tournaments/join', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ botid: botId, tournament: tournamentId }),
		});
		console.log(resp);
		const result = JSON.parse(await resp.json());
		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		return [];
	}
}
