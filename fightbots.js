const { Chess } = require('chess.js');

const args = process.argv.slice(2);

const bot1Code = args[0].slice(args[0].indexOf('=') + 1);
const bot2Code = args[1].slice(args[1].indexOf('=') + 1);
const bot1Id = args[2].split('=')[1];
const bot2Id = args[3].split('=')[1];
const MAX_MOVES = 250;

class ChessWrapper {
	constructor(savedState) {
		if (savedState) {
			this._chess = new Chess(savedState);
			this._savedState = savedState;
		} else {
			this._chess = new Chess();
			this._savedState = this._chess.fen();
		}
	}
	moves = (options) => {
		return this._chess.moves(options);
	};
	move = (target) => {
		return this._chess.move(target);
	};
	board = () => {
		return this._chess.board();
	};
	fen = () => {
		return this._chess.fen();
	};
	isGameOver = () => {
		return this._chess.isGameOver();
	};
	isInsufficientMaterial = () => {
		return this._chess.isInsufficientMaterial();
	};
	isThreefoldRepetition = () => {
		return this._chess.isThreefoldRepetition();
	};
	isStalemate = () => {
		return this._chess.isStalemate();
	};
	isDraw = () => {
		return this._chess.isDraw();
	};
	getCastlingRights = () => {
		return this._chess.getCastlingRights(this._chess.turn());
	};
	getOpponentCastingRights = () => {
		return this._chess.getCastlingRights(this._chess.turn() == 'w' ? 'b' : 'w');
	};
	ascii = () => {
		return this._chess.ascii();
	};
	get = (square) => {
		return this._chess.get(square);
	};
	isCheck = () => {
		return this._chess.isCheck();
	};
	inCheck = () => {
		return this._chess.inCheck();
	};
	isCheckmate = () => {
		return this._chess.isCheckmate();
	};
	saveState = () => {
		return (this._savedState = this._chess.fen());
	};
	getSavedState = () => {
		return this._savedState;
	};
	reset = () => {
		return this._chess.load(this._savedState);
	};
	copy = () => {
		return new ChessWrapper(this._chess.fen());
	};
	load = (fen) => {
		return this._chess.load(fen);
	};
	turn = () => {
		return this._chess.turn();
	};
	undo = () => {
		return this._chess.undo();
	};
	moveNumber = () => {
		return this._chess.moveNumber();
	};
	remainingHalfMoves = () => {
		return MAX_MOVES - this.moveNumber();
	};
	history = () => {
		return this._chess.history();
	};
}
console.log(JSON.stringify(simulateGames(bot1Code, bot2Code, bot1Id, bot2Id)));

function simulateGames(
	bot1Code,
	bot2Code,
	bot1Id,
	bot2Id,
	gamesToSimulate = 101,
) {
	try {
		const games = [];

		for (let i = 0; i < gamesToSimulate; i++) {
			games.push({
				bot1Color: Math.random() < 0.5 ? 'w' : 'b',
				board: new ChessWrapper(null),
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
		const results = [];
		for (let game of games) {
			let winner = null;
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
