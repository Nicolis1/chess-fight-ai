import { Chess } from 'chess.js';
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

export async function simulateGames(decisionFunction, callback) {
	const maxMoves = 50;
	try {
		const games = [];
		for (let i = 0; i < 10; i++) {
			games.push({
				playerColor: Math.random() < 0.5 ? 'w' : 'b',
				board: new Chess(),
			});
		}
		for (let i = 0; i < maxMoves * 2; i++) {
			for (let game of games) {
				// console.log(game.moveNumber());
				if (game.board.moveNumber() < 100 && !game.board.isGameOver()) {
					if (game.board.turn() === game.playerColor) {
						game.board.move(decisionFunction(game.board));
					} else {
						game.board.move(testBot(game.board));
					}
				}
			}
		}
		const results = [];
		for (let game of games) {
			let winner = null;
			if (game.board.isCheckmate()) {
				// the winner is whoever's turn it isn't on the last turn
				winner = game.board.turn() !== game.playerColor;
				console.log(game.playerColor);
				console.log(winner);
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
		callback({ success: true, opponent: 'TestBot', results });
	} catch (error) {
		console.error(error);
		callback({ success: false, error });
	}
}
