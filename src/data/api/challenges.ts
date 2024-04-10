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
