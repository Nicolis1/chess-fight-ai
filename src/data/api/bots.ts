import { simulateGamesInBrowser } from '../utils.ts';

export type BotData = {
	id: string;
	code?: string | undefined;
	name: string;
	challengable?: boolean;
	ownerName?: string;
};

export async function postBotChallenable(
	bot: BotData,
	challengable: boolean,
): Promise<boolean> {
	if (!challengable) {
		const resp = await fetch('/api/bots/update/challenge', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botid: bot.id,
				challengable,
			}),
		});
		// todo, what to return if post is successful, but no bots change (204)
		return resp.status === 200 || resp.status === 204;
	}
	try {
		if (!bot.code) {
			console.error(new Error('Submitted bot has no code'));
			return false;
		}
		if (/console/.test(bot.code)) {
			console.error(
				new Error(
					'Submitted bot contains console calls, delete them to submit your bot (commenting them out is not enough)',
				),
			);
			return false;
		}
		if (/_chess|_savedState/.test(bot.code)) {
			console.error(
				new Error(
					'It looks like you may be trying to access private variables _chess or _savedState',
				),
			);
		}
		const maliciousRegex = /(fetch|XMLHttpRequest|axios|jQuery\.ajax)\s*\(/gi;
		const moreMaliciousRegex =
			/\b(alert|import|require|confirm|prompt|console\.(log|warn|error))\s*\(/gi;

		if (maliciousRegex.test(bot.code) || moreMaliciousRegex.test(bot.code)) {
			console.error(
				new Error(
					'bot may contain harmful code, revise to remove anything that may appear to be an api reust, or import. This may be a false positive.',
				),
			);
			return false;
		}
		try {
			if ((await simulateGamesInBrowser(bot, bot)) != null) {
				const resp = await fetch('/api/bots/update/challenge', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						botid: bot.id,
						challengable,
					}),
				});
				// todo, what to return if post is successful, but no bots change (204)
				return resp.status === 200 || resp.status === 204;
			}
		} catch (error) {
			console.error(new Error('bot failed to run'));
			console.error(error);
			return false;
		}
	} catch (error) {
		console.error('something unknown went wrong. ');
		console.error(error);
	}

	return false;
}

export async function fetchChallengable(): Promise<BotData[]> {
	try {
		const resp = await fetch('/api/bots/challengable', {
			method: 'GET',
		});
		const availableBots: BotData[] = [];
		const result = JSON.parse(await resp.json()).data;
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

export async function newBot(
	code = 'return position.moves()[0]',
	name = '',
): Promise<BotData | null> {
	try {
		const resp = await fetch('/api/bots/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, name }),
		});

		const response = JSON.parse(await resp.json());
		// fetch the bots again so cache is ready for when you next open the drawer
		fetch('/api/bots/all', {
			method: 'GET',
			cache: 'reload',
		});
		return {
			id: response.bot_id,
			name: response.name,
			code: response.code,
			challengable: response.challengable,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}
export async function removeBot(id: string) {
	const response = await fetch('/api/bots/delete', {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ botid: id }),
	});
	// fetch the bots again so cache is ready for when you next open the drawer
	fetch('/api/bots/all', {
		method: 'GET',
		cache: 'reload',
	});
	return response.status == 200;
}
export async function fetchBots() {
	const response = await fetch('/api/bots/all', {
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
			ownerName: bot.owner,
		});
	}
	return botsForState;
}
