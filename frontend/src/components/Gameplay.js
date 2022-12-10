import './Gameplay.css'
import {useCallback, useEffect, useState} from "react";
import Board from "./Board";

import {WHITE, BLACK, Chess} from 'chess.js'
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Row} from "react-bootstrap";
import {
	DELAY,
	GAME_TYPE_COMPUTER,
	PLAYING,
	PROMOTION_PIECES,
	game_status,
	GAME_TYPE_2PLAYERS,
	GAME_TYPE_ONLINE
} from "./constants";
import {get_random, promotion_time} from "../utils";
import GamePlayDataService from "../services/gamplay";


// const chess = new Chess()
// const chess = new Chess('rnbqkbnr/1pppppPp/8/8/8/8/PpPPPPP1/RNBQKBNR w KQkq - 0 5') // promotion check
// const chess = new Chess('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4') // M1

// while (!chess.game_over()) {
// 	const moves = chess.moves()
// 	const move = moves[Math.floor(Math.random() * moves.length)]
// 	chess.move(move)
// }
// console.log(chess.pgn())


/* todo
todo add:
- timers if necessary
- buttons to resign / offer draw
 */


// used to log available moves
// const moves_to_string = moves => 'available moves:\n' +  Object.entries(moves)
// 	.map(([from, set]) =>
// 		"\t" + from + " => "  + Array.from(set).join(' ')).join('\n')
// console.log(moves_to_string(available))

const Gameplay = ({user, game_type, user_color}) => {


	const [game_id, set_game_id] = useState(null)
	const [chess, set_chess] = useState(new Chess())

	const get_available_moves = useCallback(() => {
		let available = {}
		chess.moves({verbose: true}).forEach(({from, to}) => {
			if (from in available) {
				available[from].add(to)
			} else {
				available[from] = new Set([to])
			}
		})
		return available
	}, [chess])

	useEffect(() => {
		if (user && !game_id) {
			console.log('starting game', user, game_type)
			GamePlayDataService.startGame(user.googleId, game_type)
				.then(resp => {
					console.log('started new game')
					console.log(resp)
					set_game_id(resp)
				})
		}
	}, [user, chess, game_id, game_type])


	// todo this is not the best design, consider redoing
	useEffect(() => {


		if (user) {
			console.log('updating current game')

			GamePlayDataService.getCurrentGame(user.googleId)
				.then(resp => {
					console.log('getCurrentGame', resp.data)
					// const new_chess = new Chess()
					// new_chess.load_pgn(resp.data.moves)
					// set_chess(new_chess)
				})
		}
	}, [user])

	// todo set the color of this user and limit his moves
	// TODO retrieve game info if the user is currently playing. once the game is over push to mongo

	const [moves, set_moves] = useState(get_available_moves())
	const [status, set_status] = useState(game_status(chess))
	const [orientation, setOrientation] = useState(user_color)

	const change_orientation = () => setOrientation(orientation === WHITE ? BLACK : WHITE)

	const make_chess_move = useCallback(move_data => {

		const move_output = chess.move(move_data)

		// todo consider adding this to log
		if (move_output === null) {
			throw new Error('unknown move: ' + JSON.stringify({fen: chess.fen(), ascii: chess.ascii(), ...move_data}))
		}

		const current_status = game_status(chess)
		set_status(current_status)

		if (current_status === PLAYING) {
			set_moves(get_available_moves())
		} else {
			// todo do appropriate uploads here
			console.log(current_status)
		}
	}, [chess, get_available_moves])

	// todo try catch here for confirmation that a move is correct ?
	const move = useCallback((from, to, promotion = null) => {
		let move_data = {from: from, to: to}
		if (promotion) move_data = {promotion: promotion, ...move_data}
		make_chess_move(move_data)
	}, [make_chess_move])


	const get_random_move = () => {
		const options = Object.entries(moves)
			.flatMap(([from, set]) => {
				return Array.from(set).map(to => {
					if (promotion_time(chess, from, to)) {
						return PROMOTION_PIECES.map(piece => {
							return {from: from, to: to, promotion: piece}
						})
					} else {
						return {from: from, to: to}
					}
				})
			}).flatMap(a => a) // accounts for promotion list
		return get_random(options)
	}

	// updates for different modes
	useEffect(() => {

		switch (game_type) {
			case GAME_TYPE_COMPUTER:
				if (status === PLAYING && chess.turn() !== user_color) {
					make_chess_move(get_random_move())
				}
				break
			case GAME_TYPE_2PLAYERS:
				break
			case GAME_TYPE_ONLINE:
				break
			default:
				throw new Error('game type not implemented: ' + game_type)
		}
	}, [chess, game_type, user_color, status, make_chess_move, get_random_move])

	// todo consider using this for the online version
	// update moves every .1 second
	// useEffect(() => {
	// 	const interval = setInterval(() => set_moves(get_available_moves()), DELAY);
	// 	return () => clearInterval(interval);
	// }, [set_moves, get_available_moves]);

	return (
		<Container className={"gameplay"}>
			<Row>
				{/* todo figure out how to remove outline from button and call it by name rather than "f"*/}
				<Button className={'glyph-button'} onClick={() => setOrientation(orientation === WHITE ? BLACK : WHITE)}>
					f
				</Button>
			</Row>
			<Row>
				<Board user={user} orientation={orientation} chess={chess} move={move} moves={moves} game_type={game_type}/>
			</Row>
			<Row>

			</Row>
		</Container>
	)
}

export default Gameplay