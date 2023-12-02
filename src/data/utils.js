import { Chess } from 'chess.js';
export const STARTER_CODE = `function getMove(position){
    return position.moves()[0];
  }
  return getMove(position);`;

export async function simulateGames(decisionFunction, callback) {
	console.log(decisionFunction(new Chess()));
	try {
		const games = [];
		for (let i = 0; i < 100; i++) {
			games.push(new Chess());
		}
		for (let i = 0; i < 100; i++) {
			for (let game of games) {
				// console.log(game.moveNumber());
				if (game.moveNumber() < 100 && !game.isGameOver()) {
					const move = decisionFunction(game);
					// console.log(move);
					game.move(move);
				}
			}
		}
		const results = [];
		for (let game of games) {
			let winner = null;
			if (game.isGameOver()) {
				winner = game.turn();
			}
			results.push({
				winner,
				turns: game.moveNumber(),
				reachedMoveLimit: game.moveNumber() > 99,
				moves: game.history(),
			});
		}
		callback(results);
	} catch {
		callback(null);
	}
}
