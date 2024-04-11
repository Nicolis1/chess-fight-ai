const { Chess } = require('chess.js');

const args = process.argv.slice(2);

const bot1Code = args[0].slice(args[0].indexOf('=') + 1);
const bot2Code = args[1].slice(args[1].indexOf('=') + 1);
const bot1Id = args[2].split('=')[1];
const bot2Id = args[3].split('=')[1];

console.log(JSON.stringify(simulateGames(bot1Code, bot2Code, bot1Id, bot2Id)));

function simulateGames(bot1Code, bot2Code, bot1Id, bot2Id) {
	const maxMoves = 100;
	try {
		const games = [];
		for (let i = 0; i < 101; i++) {
			games.push({
				bot1Color: Math.random() < 0.5 ? 'w' : 'b',
				board: new Chess(),
			});
		}

		const decisionFunction = new Function('position', bot1Code);
		const opponentDecisionFunction = new Function('position', bot2Code);
		for (let i = 0; i < maxMoves; i++) {
			for (let game of games) {
				if (game.board.moveNumber() < maxMoves && !game.board.isGameOver()) {
					if (game.board.turn() === game.bot1Color) {
						game.board.move(decisionFunction(game.board));
					} else {
						game.board.move(opponentDecisionFunction(game.board));
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
