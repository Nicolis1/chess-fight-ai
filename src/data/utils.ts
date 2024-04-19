import { Chess } from 'chess.js';
import { BotData } from './api/bots';
import { Result } from './api/challenges';
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

export async function simulateGames(
	botData: BotData | null,
	opponentData: BotData | null,
): Promise<Result[] | null> {
	const maxMoves = 50;
	try {
		const games: Array<Game> = [];
		for (let i = 0; i < 10; i++) {
			games.push({
				playerColor: Math.random() < 0.5 ? 'w' : 'b',
				board: new Chess(),
			});
		}
		if (botData?.code == null || opponentData?.code == null) {
			return null;
		}
		// new Function call's eval on user submitted code, this is potentially dangerous
		// eslint-disable-next-line no-new-func
		const decisionFunction = new Function('position', botData.code);
		const opponentDecisionFunction = opponentData.code
			? // eslint-disable-next-line no-new-func
			  new Function('position', opponentData.code)
			: null;

		for (let i = 0; i < maxMoves * 2; i++) {
			for (let game of games) {
				if (game.board.moveNumber() < 100 && !game.board.isGameOver()) {
					if (game.board.turn() === game.playerColor) {
						game.board.move(decisionFunction(game.board));
					} else {
						if (opponentDecisionFunction) {
							game.board.move(opponentDecisionFunction(game.board));
						}
					}
				}
			}
		}
		const results: Result[] = [];
		for (let game of games) {
			let winner: string | null = null;
			if (game.board.isCheckmate()) {
				// the winner is whoever's turn it isn't on the last turn
				winner =
					game.board.turn() === game.playerColor ? opponentData.id : botData.id;
			}
			results.push({
				winner,
				draw: game.board.isDraw(),
				turns: game.board.moveNumber(),
				reachedMoveLimit: game.board.moveNumber() > maxMoves,
				moves: game.board.history(),
				whitePieces: game.playerColor === 'w' ? botData.id : opponentData.id,
			});
		}
		return results;
	} catch (error) {
		console.error(error);
		return null;
	}
}
