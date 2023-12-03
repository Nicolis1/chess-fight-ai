import { Chess } from 'chess.js';
export const STARTER_CODE2 =
	//comment for code formatting
	`function getMove(position){
	/* edit your code here, 
	your result must be a string like "a3" that appears
	in the list of position.moves() */
	return position.moves()[0];
}
return getMove(position);`;

export const STARTER_CODE =
	//comment for code formatting
	`function getMove(position){
	/* edit your code here, 
	your result must be a string like "a3" that appears
	in the list of position.moves() */
	let moves = position.moves();
	let move = moves[Math.floor(Math.random() * moves.length)];
	return move;
}
return getMove(position);`;

export async function simulateGames(decisionFunction, callback) {
	console.log(decisionFunction(new Chess()));
	try {
		const games = [];
		for (let i = 0; i < 10; i++) {
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
			if (game.isCheckmate()) {
				// the winner is whoever's turn it isn't on the last turn
				winner = game.turn() == 'b' ? 'w' : 'b';
			}
			results.push({
				winner,
				draw: game.isDraw,
				turns: game.moveNumber(),
				reachedMoveLimit: game.moveNumber() > 99,
				moves: game.history(),
			});
		}
		callback({ success: true, results });
	} catch (error) {
		callback({ success: false, error });
	}
}
