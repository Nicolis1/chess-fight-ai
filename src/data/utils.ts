import { Chess } from 'chess.js';
import { BotData } from './features/activeCodeSlice';
export const STARTER_CODE1 =
	//comment for code formatting
	`function getMove(position){
	/* edit your code here, 
	your result must be a string like "a3" that appears
	in the list of position.moves() */
	return position.moves()[0];
}
return getMove(position);`;

export const STARTER_CODE2 =
	//comment for code formatting
	`function getMove(position){
	/* edit your code here, 
	your result must be a string like "a3" that appears
	in the list of position.moves() */
	let moves = position.moves();


	for(let move of moves){
		position.move(move);
		let isMate = position.isCheckmate();
		position.undo();
		if(isMate){
			return move;
		}
	}
	let move = moves[Math.floor(Math.random() * moves.length)];
	return move;
}
return getMove(position);`;

export function testBot(position) {
	let moves = position.moves();
	let move = moves[0];
	return move;
}

type Game = {
	playerColor: string;
	board: Chess;
};
type SimulatedGame = {
	winner: boolean | null;
	draw: boolean;
	turns: number;
	reachedMoveLimit: boolean;
	moves: Array<string>;
	playerColor: string;
};
export async function simulateGames(
	botData: BotData | null,
	opponentData: BotData | null,
	callback: {
		(results: any): void;
		(arg0: {
			success: boolean;
			opponent?: string;
			results?: SimulatedGame[];
			error?: any;
		}): void;
	},
) {
	const maxMoves = 50;
	try {
		const games: Array<Game> = [];
		for (let i = 0; i < 10; i++) {
			games.push({
				playerColor: Math.random() < 0.5 ? 'w' : 'b',
				board: new Chess(),
			});
		}
		if (botData?.code == null) {
			callback({ success: false, error: 'no selected bot code' });
			return;
		}
		// new Function call's eval on user submitted code, this is potentially dangerous
		// eslint-disable-next-line no-new-func
		const decisionFunction = new Function('position', botData.code);
		const opponentDecisionFunction = opponentData?.code
			? // eslint-disable-next-line no-new-func
			  new Function('position', opponentData.code)
			: null;

		for (let i = 0; i < maxMoves * 2; i++) {
			for (let game of games) {
				// console.log(game.moveNumber());
				if (game.board.moveNumber() < 100 && !game.board.isGameOver()) {
					if (game.board.turn() === game.playerColor) {
						game.board.move(decisionFunction(game.board));
					} else {
						if (opponentDecisionFunction) {
							game.board.move(opponentDecisionFunction(game.board));
						} else {
							game.board.move(testBot(game.board));
						}
					}
				}
			}
		}
		const results: Array<SimulatedGame> = [];
		for (let game of games) {
			let winner: boolean | null = null;
			if (game.board.isCheckmate()) {
				// the winner is whoever's turn it isn't on the last turn
				winner = game.board.turn() !== game.playerColor;
			}
			results.push({
				winner,
				draw: game.board.isDraw(),
				turns: game.board.moveNumber(),
				reachedMoveLimit: game.board.moveNumber() > maxMoves,
				moves: game.board.history(),
				playerColor: game.playerColor,
			});
		}
		callback({
			success: true,
			opponent: opponentData ? opponentData.name : 'TestBot',
			results,
		});
	} catch (error) {
		console.error(error);
		callback({ success: false, error });
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
		});
	}
	return botsForState;
}

export async function newBot(): Promise<BotData | null> {
	try {
		const resp = await fetch(`/bots/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code: STARTER_CODE2 }),
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

export async function fetchActiveUser() {
	try {
		const resp = await fetch(`/users/active`, {
			method: 'GET',
		});
		const response = JSON.parse(await resp.json());
		if (response.userid == null) {
			return null;
		}
		return {
			id: response.userid,
			username: response.username,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}
