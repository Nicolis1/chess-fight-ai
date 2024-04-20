import { Chess } from 'chess.js';
import { BotData } from './api/bots';
import { Result } from './api/challenges';

export function testBot(position) {
	let moves = position.moves();
	let move = moves[0];
	return move;
}

export async function simulateGamesInBrowser(
	botData: BotData | null,
	opponentData: BotData | null,
): Promise<Result[] | null> {
	if (botData?.code != null && opponentData?.code != null) {
		try {
			return new Promise((resolve, reject) => {
				// if not actually necesary (caught by above if), but flow is sad without ti
				if (!botData.code || !opponentData?.code) {
					return;
				}
				const response = simulateGames(
					botData.code,
					opponentData.code,
					botData.id,
					opponentData.id,
					11,
				);
				if (response.output.success && response.output.results) {
					// types are but fightbots is .js so doesn't ahve explicit types
					resolve(response.output.results);
				} else {
					reject(response.output.error);
				}
			});
		} catch (error) {
			console.error(new Error('bot failed to run'));
			console.error(error);
			return null;
		}
	}
	return null;
}

type Game = {
	bot1Color: string;
	board: ChessWrapper;
	moves: string[];
};
const MAX_MOVES = 250;
function simulateGames(
	bot1Code: string,
	bot2Code: string,
	bot1Id: string,
	bot2Id: string,
	gamesToSimulate = 101,
) {
	try {
		const games: Game[] = [];
		for (let i = 0; i < gamesToSimulate; i++) {
			games.push({
				bot1Color: Math.random() < 0.5 ? 'w' : 'b',
				board: new ChessWrapper(),
				moves: [],
			});
		}

		const decisionFunction = new Function('position', bot1Code);
		const opponentDecisionFunction = new Function('position', bot2Code);
		for (let i = 0; i < MAX_MOVES; i++) {
			for (let game of games) {
				if (game.board.moveNumber() < MAX_MOVES && !game.board.isGameOver()) {
					const resetState = game.board.fen();
					if (game.board.turn() === game.bot1Color) {
						let chosenMove = decisionFunction(game.board);
						game.board.load(resetState);
						game.moves.push(chosenMove);
						game.board.move(chosenMove);
					} else {
						let chosenMove = opponentDecisionFunction(game.board);
						game.board.load(resetState);
						game.moves.push(chosenMove);
						game.board.move(chosenMove);
					}
				}
			}
		}
		const results: Result[] = [];
		for (let game of games) {
			let winner: string | null = null;
			if (game.board.isCheckmate()) {
				// the winner is whoever's turn it isn't on the last turn
				winner = game.board.turn() === game.bot1Color ? bot2Id : bot1Id;
			}
			results.push({
				winner,
				draw: game.board.isDraw(),
				turns: game.board.moveNumber(),
				reachedMoveLimit: game.board.remainingHalfMoves() < 1,
				moves: game.moves,
				whitePieces: game.bot1Color === 'w' ? bot1Id : bot2Id,
			});
		}
		return {
			output: {
				success: true,
				results,
			},
		};
	} catch (error) {
		return { output: { success: false, error, bot1Code, bot2Code } };
	}
}

class ChessWrapper {
	#chess: Chess;
	#savedState: string;
	constructor(savedState?: string) {
		if (savedState) {
			this.#chess = new Chess(savedState);
			this.#savedState = savedState;
		} else {
			this.#chess = new Chess();
			this.#savedState = this.#chess.fen();
		}
	}
	moves = (options) => {
		return this.#chess.moves(options);
	};
	move = (target) => {
		return this.#chess.move(target);
	};
	board = () => {
		return this.#chess.board();
	};
	fen = () => {
		return this.#chess.fen();
	};
	isGameOver = () => {
		return this.#chess.isGameOver();
	};
	isInsufficientMaterial = () => {
		return this.#chess.isInsufficientMaterial();
	};
	isThreefoldRepetition = () => {
		return this.#chess.isThreefoldRepetition();
	};
	isStalemate = () => {
		return this.#chess.isStalemate();
	};
	isDraw = () => {
		return this.#chess.isDraw();
	};
	getCastlingRights = () => {
		return this.#chess.getCastlingRights(this.#chess.turn());
	};
	getOpponentCastingRights = () => {
		return this.#chess.getCastlingRights(this.#chess.turn() == 'w' ? 'b' : 'w');
	};
	ascii = () => {
		return this.#chess.ascii();
	};
	get = (square) => {
		return this.#chess.get(square);
	};
	isCheck = () => {
		return this.#chess.isCheck();
	};
	inCheck = () => {
		return this.#chess.inCheck();
	};
	isCheckmate = () => {
		return this.#chess.isCheckmate();
	};
	saveState = () => {
		return (this.#savedState = this.#chess.fen());
	};
	getSavedState = () => {
		return this.#savedState;
	};
	reset = () => {
		return this.#chess.load(this.#savedState);
	};
	copy = () => {
		return new ChessWrapper(this.#chess.fen());
	};
	load = (fen) => {
		return this.#chess.load(fen);
	};
	turn = () => {
		return this.#chess.turn();
	};
	undo = () => {
		return this.#chess.undo();
	};
	moveNumber = () => {
		return this.#chess.moveNumber();
	};
	remainingHalfMoves = () => {
		return MAX_MOVES - this.moveNumber();
	};
	history = () => {
		return this.#chess.history();
	};
}
