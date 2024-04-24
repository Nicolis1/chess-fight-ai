/* prettier-ignore */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './Modals.css';

function APIModal(props: { hideModal: Function; displayModal: boolean }) {
	if (!props.displayModal) {
		return null;
	}
	return (
		<div
			className='blurrer'
			onClick={(e) => {
				props.hideModal();
				e.stopPropagation();
			}}
		>
			<div
				className='modalContainer wide'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className='modalTitle'>
					<h2>API</h2>
					<button
						className='close'
						onClick={() => {
							props.hideModal();
						}}
					>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</div>
				<div className='apiContent'>
					<p>
						The function you implement will have one parameter called position.
						Your function will need to return one legal move, from the list of
						legal moves found in <code>position.moves</code>
					</p>
					<p>
						Only implement the body of the function, you should not include the
						function signature ex: instead of ...
						<br />
						<code>
							function decideMove(position)&#123;; return position.moves()[0];
							&#125;
						</code>
						<br />
						you should do...
						<br />
						<code>return position.moves()[0];</code>
						<br />
						The full class definition for the <code>position</code> argument is
						detailed below.
					</p>
					<p>
						The provided API is a wrapper around the Chess.js library with some
						functions restricted, and a couple added. You may find helpful
						documentation <a href='https://github.com/jhlywa/chess.js/'>here</a>
					</p>
					<code className='apiWrapper'>
						<ul>
							<li>class Position &#123;</li>
							<ul>
								<li>
									#chess: Chess; //private field for controlling game state
								</li>
								<li>
									#savedState: string; // private field storing saved state,
									access with methods
								</li>
								<li>moves = (options) =&gt; &#123;</li>
								<ul>
									<li>Returns a list of legal moves. </li>
									<li>
										Pass option flags piece: ("b" | "p" | "q" | "k" | "r" | "n")
									</li>
									<li>
										or square: ("a8" | "b8" | "c8" | "d8" | "e8" | "f8" | "g8" |
										"h8" | "a7" | "b7" | "c7" | "d7" | "e7" | "f7" | etc) to get
										only moves relevant to those options
									</li>
								</ul>
								<li>&#125;</li>
								<li>move = (moveString) =&gt; &#123;</li>
								<ul>
									<li>
										plays the legal move on the board so you can see what
										changes it's made to the board
									</li>
								</ul>
								<li>&#125;</li>
								<li>board = () =&gt; &#123;</li>
								<ul>
									<li>
										Returns an 2D array representation of the current position.
										Empty squares are represented by null. see{' '}
										<a href='https://github.com/jhlywa/chess.js/'>here</a> for
										details
									</li>
								</ul>
								<li>&#125;</li>
								<li>fen = () =&gt; &#123;</li>
								<ul>
									<li>
										Returns a representation of the board in Forsyth-Edwards
										Notation (FEN)
									</li>
								</ul>
								<li>&#125;</li>
								<li>isGameOver = () =&gt; &#123;</li>
								<ul>
									<li>returns true if the game is over, false otherwise</li>
								</ul>
								<li>&#125;</li>
								<li>isInsufficientMaterial = () =&gt; &#123;</li>
								<ul>
									<li>
										returns true if there is inusufficient material for a
										checkmate
									</li>
								</ul>
								<li>&#125;</li>
								<li>isThreefoldRepetition = () =&gt; &#123;</li>
								<ul>
									<li>
										returns true if the board state has occured 3 or more times,
										triggering a draw;
									</li>
								</ul>
								<li>&#125;</li>
								<li>isStalemate = () =&gt; &#123;</li>
								<ul>
									<li>
										returns true if the active player is unable to make a legal
										move
									</li>
								</ul>
								<li>&#125;</li>
								<li>isDraw = () =&gt; &#123;</li>
								<ul>
									<li>returns true if the game has drawn</li>
								</ul>
								<li>&#125;</li>
								<li>getCastlingRights = () =&gt; &#123;</li>
								<ul>
									<li>
										returns the castling rights for the active player. // &#123;
										'k': false, 'q': true &#125;
									</li>
								</ul>
								<li>&#125;</li>
								<li>getOpponentCastingRights = () =&gt; &#123;</li>
								<ul>
									<li>
										returns the castling rights for the inactive player. //
										&#123; 'k': false, 'q': true &#125;
									</li>
								</ul>
								<li>&#125;</li>
								<li>ascii = () =&gt; &#123;</li>
								<ul>
									<li>
										returns a string with an ASCII depiction of the board.
									</li>
								</ul>
								<li>&#125;</li>
								<li>get = (square) =&gt; &#123;</li>
								<ul>
									<li>returns the piece on the square. Null if empty</li>
								</ul>
								<li>&#125;</li>
								<li>isCheck = () =&gt; &#123;</li>
								<ul>
									<li>returns true if the active player is in check</li>
								</ul>
								<li>&#125;</li>
								<li>isCheckmate = () =&gt; &#123;</li>
								<ul>
									<li>returns true if the active player is in checkmate</li>
								</ul>
								<li>&#125;</li>
								<li>saveState = () =&gt; &#123;</li>
								<ul>
									<li>saves the games state so it can be loaded later</li>
								</ul>
								<li>&#125;</li>
								<li>getSavedState = () =&gt; &#123;</li>
								<ul>
									<li>returns the games saved state</li>
								</ul>
								<li>&#125;</li>
								<li>reset = () =&gt; &#123;</li>
								<ul>
									<li>sets the board to it's saved state</li>
								</ul>
								<li>&#125;</li>
								<li>copy = () =&gt; &#123;</li>
								<ul>
									<li>
										Returns a copy of the position object with a different
										refernce
									</li>
								</ul>
								<li>&#125;</li>
								<li>load = (fen) =&gt; &#123;</li>
								<ul>
									<li>
										sets the boardstate to the provided FEN, can be used to
										manually control saved state
									</li>
								</ul>
								<li>&#125;</li>
								<li>turn = () =&gt; &#123;</li>
								<ul>
									<li>returns the active player: "w" or "b"</li>
								</ul>
								<li>&#125;</li>
								<li>undo = () =&gt; &#123;</li>
								<ul>
									<li>
										returns the board to the state it was in before the last
										move. May throw an exception if called before you make a
										move
									</li>
								</ul>
								<li>&#125;</li>
								<li>moveNumber = () =&gt; &#123;</li>
								<ul>
									<li>Returns the current move number</li>
								</ul>
								<li>&#125;</li>
								<li>remainingMoves = () =&gt; &#123;</li>
								<ul>
									<li>
										Each game has a limit of 250 moves before a draw is
										declared. Returns the remaing number of moves
									</li>
								</ul>
								<li>&#125;</li>
							</ul>
						</ul>
					</code>
				</div>
			</div>
		</div>
	);
}
export default APIModal;
