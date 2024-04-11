export type BotData = {
	id: string;
	code?: string | undefined;
	name?: string | undefined;
	challengable?: boolean;
	ownerName?: string;
};

export async function postBotChallenable(
	botid: string,
	challengable: boolean,
): Promise<boolean> {
	try {
		const resp = await fetch('/bots/update/challenge', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botid,
				challengable,
			}),
		});
		// todo, what to return if post is successful, but no bots change (204)
		return resp.status === 200 || resp.status === 204;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function fetchChallengable(): Promise<BotData[]> {
	try {
		const resp = await fetch('/bots/challengable', {
			method: 'GET',
		});
		const availableBots: BotData[] = [];
		const result = JSON.parse(await resp.json()).data;
		console.log(result);
		for (let bot of result) {
			availableBots.push({
				id: bot.botid,
				code: bot.code,
				name: bot.name,
				challengable: bot.challengable,
				ownerName: bot.userData[0].username,
			});
		}
		return availableBots;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function newBot(): Promise<BotData | null> {
	try {
		const resp = await fetch('/bots/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code: 'return position.moves()[0]' }),
		});

		console.log(resp);
		const response = JSON.parse(await resp.json());
		// fetch the bots again so cache is ready for when you next open the drawer
		fetch('/bots/all', {
			method: 'GET',
			cache: 'reload',
		});
		return {
			id: response.bot_id,
			name: response.name,
			code: response.code,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}
export async function fetchBots() {
	const response = await fetch('/bots/all', {
		method: 'GET',
		cache: 'no-cache',
	});
	const jsonBots = JSON.parse(await response.json()).bots;
	let botsForState: Array<BotData> = [];
	for (let bot of jsonBots) {
		botsForState.push({
			id: bot.botid,
			name: bot.name,
			code: bot.code,
			challengable: bot.challengable,
		});
	}
	return botsForState;
}