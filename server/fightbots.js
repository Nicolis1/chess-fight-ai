// todo add to requirements in dockerfile
const { Chess } = require('chess.js');
console.log(Chess);
const bots = process.argv.slice(2);
const bot1Code = bots[0].split('=')[1];
const bot2Code = bots[1].split('=')[1];
console.log(bot1Code);
console.log(bot2Code);
if (bot1Code === '' || bot2Code === '') {
	console.log(JSON.stringify({ error: 'Missing bot code' }));
}
console.log(JSON.stringify(simulateGames(bot1Code, bot2Code)));

function simulateGames(bot1Code, bot2Code) {
	const maxMoves = 50;
	try {
		const games = [];
		for (let i = 0; i < 1; i++) {
			games.push({
				bot1Color: Math.random() < 0.5 ? 'w' : 'b',
				board: new Chess(),
			});
		}

		const decisionFunction = new Function('position', bot1Code);
		const opponentDecisionFunction = new Function('position', bot2Code);
		for (let i = 0; i < maxMoves * 2; i++) {
			for (let game of games) {
				// console.log(game.moveNumber());
				if (game.board.moveNumber() < 100 && !game.board.isGameOver()) {
					if (game.board.turn() === game.playerColor) {
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
				winner = game.board.turn() === 'w' ? 'b' : 'w';
			}
			results.push({
				winner,
				draw: game.board.isDraw(),
				turns: game.board.moveNumber(),
				reachedMoveLimit: game.board.moveNumber() > maxMoves,
				moves: game.board.history(),
				bot1Color: game.bot1Color,
			});
		}
		return {
			success: true,
			results,
		};
	} catch (error) {
		console.error(error);
		return { success: false, error };
	}
}
