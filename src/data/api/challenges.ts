export type MatchData = any; // todo update this with proper type

export type Tournament = {
	challengeId: string;
	matchData: MatchData[];
	participants: string[];
	scheduled: number;
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
				participants: tournament.participants,
				scheduled: tournament.scheduled,
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
		console.log(resp);
		const result = JSON.parse(await resp.json());
		console.log(result);
		const jsonResult = JSON.parse(result.result);
		// todo, output from this api call is too nested
		return jsonResult.output.results;
	} catch (error) {
		console.error(error);
		return [];
	}
}
