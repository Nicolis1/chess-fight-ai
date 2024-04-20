const startTime = performance.now();

const { Chess } = require('chess.js');

const STARTER_CODE =
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

// JSON.stringify(simulateGames(STARTER_CODE, STARTER_CODE, 'bot1Id', 'bot2Id'));

class ChessWrapper {
	constructor(savedState = null) {
		if (savedState) {
			this.chess = new Chess(savedState);
			this.savedState = savedState;
		} else {
			this.chess = new Chess();
			this.savedState = this.chess.fen();
		}
	}
	moves = (options) => {
		return this.chess.moves(options);
	};
	move = (target) => {
		return this.chess.move(target);
	};
	board = () => {
		return this.chess.board();
	};
	fen = () => {
		return this.chess.fen();
	};
	isGameOver = () => {
		return this.chess.isGameOver();
	};
	isInsufficientMaterial = () => {
		return this.chess.isInsufficientMaterial();
	};
	isThreefoldRepetition = () => {
		return this.chess.isThreefoldRepetition();
	};
	isStalemate = () => {
		return this.chess.isStalemate();
	};
	isDraw = () => {
		return this.chess.isDraw();
	};
	getCastlingRights = () => {
		return this.chess.getCastlingRights();
	};
	ascii = () => {
		return this.chess.ascii();
	};
	get = (square) => {
		return this.chess.get(square);
	};
	isCheck = () => {
		return this.chess.isCheck();
	};
	inCheck = () => {
		return this.chess.inCheck();
	};
	isCheckmate = () => {
		return this.chess.isCheckmate();
	};
	saveState = () => {
		return (this.savedState = this.chess.fen());
	};
	reset = () => {
		return this.chess.load(this.savedState);
	};
	copy = () => {
		return new ChessWrapper(this.chess.fen());
	};
	load = (fen) => {
		return this.chess.load(fen);
	};
	turn = () => {
		return this.chess.turn();
	};
	undo = () => {
		return this.chess.undo();
	};
}
function simulateGames(bot1Code, bot2Code, bot1Id, bot2Id) {
	const maxMoves = 100;
	try {
		const games = [];
		for (let i = 0; i < 101; i++) {
			games.push({
				bot1Color: Math.random() < 0.5 ? 'w' : 'b',
				board: new ChessWrapper(),
				movesMade: [],
			});
		}

		const decisionFunction = new Function('position', bot1Code);
		const opponentDecisionFunction = new Function('position', bot2Code);
		for (let i = 0; i < maxMoves; i++) {
			for (let game of games) {
				const resetState = game.board.fen();
				if (game.board.moveNumber() < maxMoves && !game.board.isGameOver()) {
					if (game.board.turn() === game.bot1Color) {
						let chosenMove = decisionFunction(game.board);
						game.board.load(resetState);
						game.board.move(chosenMove);
					} else {
						let chosenMove = opponentDecisionFunction(game.board);
						game.board.load(resetState);
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
				reachedMoveLimit: game.board.moveNumber() > maxMoves / 2,
				moves: game.board.history(),
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
const endTime = performance.now();

console.log(endTime - startTime);

console.log(new ChessWrapper().inCheck());
console.log(new ChessWrapper().isCheck());
