import './Board.css'
import {useEffect, useState} from "react";
import {BLACK, WHITE} from "chess.js";
import {DELAY, GAME_TYPE_2PLAYERS, PROMOTION_PIECES} from './constants'
import {promotion_time} from "../utils";


// TODO FIGURE OUT THE BOARD INDEX ISSUE WHEN PLAYING BALCK

const Board = ({user, orientation, chess, move, moves, game_type}) => {

	// constants
	const dimensions = 100
	const square_size = dimensions / 8
	const ranks = [1, 2, 3, 4, 5, 6, 7, 8]
	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

	// helper functions
	const even = n => n % 2 === 0
	const is_empty = id => !chess.get(id)
	const legal_move = (from, to) => from in moves && moves[from].has(to)

	const o_white = () => orientation === WHITE
	const o_adjust = list => o_white() ? list : list.reverse()
	const file = (id) => o_adjust(files).indexOf(id[0])

	const makeRectangles = () => {
		let rects = []
		ranks.forEach(rank =>
			files.forEach((file_string, file) =>
				rects.push({
					id: file_string + rank,
					x: o_white() ? file * square_size : dimensions - (file + 1) * square_size,
					y: o_white() ? dimensions - rank * square_size : (rank - 1) * square_size,
					className: even(rank + file) ? "dark" : "light",
				})
			))
		return rects
	}

	// todo why setting as null initially does not work in the very beginning
	const [squares, setSquares] = useState(makeRectangles)
	const [selected, setSelected] = useState(null)
	const [promotingAt, setPromotingAt] = useState(null)


	const onClick = (event) => {

		const {target: {id}} = event
		const [from, to] = [selected, id]

		if (promotingAt) {
			return
		}

		if (legal_move(from, to)) {
			if (promotion_time(chess, from, to)) {
				setPromotingAt(to)
			} else {
				move(from, to)
				setSelected(null)
			}
			// clicked on a non-empty square
		} else if (!is_empty(id)) {
			// either remove selection or select a new square
			setSelected(from === to || chess.turn() !== chess.get(to).color ? null : to)
		} else {
			setSelected(null)
		}
	}

	// TODO CHECK IF THIS IS NEEDED
	useEffect(() => {
		const interval = setInterval(() => setSquares(makeRectangles(orientation)), DELAY);
		return () => clearInterval(interval);
	}, [setSquares, makeRectangles, orientation]);

	useEffect(() => {
		// console.log('set squares called')
		setSquares(makeRectangles(orientation))
		setSelected(null)
		setPromotingAt(null) // todo redo or redraw modal

		// TODO should should trigger rerender of axis labels as well
	}, [orientation]) // todo what should i put here

	const make_square = ({id, className, x, y}) => {
		const classNames = ['square', className]
		if (id === selected) classNames.push('selected')
		return <rect id={id} key={id} className={classNames.join(' ')} x={x} y={y} onClick={onClick}/>
	}

	const draw_rank_labels = () => o_adjust(ranks).map((rank, i) => make_coordinate(rank, i, .75, 90.75 - i * 12.5))
	const draw_file_labels = () => o_adjust(files).map((file, i) => make_coordinate(file, i, 10 + i * 12.5, 99))

	const make_coordinate = (coordinate, index, x, y) => (
		<text x={x} y={y} key={index} className={"coordinate " + (even(index) ? "light" : "dark")}>
			{coordinate}
		</text>
	)

	const draw_square_piece = ({id, x, y}) => {
		const {type, color} = chess.get(id)

		if (game_type === GAME_TYPE_2PLAYERS
			&& ((color === BLACK && orientation === WHITE)
				|| (color === WHITE && orientation === BLACK)
			)) {
			return <image key={id} id={id} href={process.env.PUBLIC_URL + `/images/pieces/${color}${type}.png`} x={x} y={y}
			              width={square_size} onClick={onClick}
			              transform={`rotate(180, ${x}, ${y}) translate(${-square_size}, ${-square_size})`}
			/>
		} else {
			return <image key={id} id={id} href={process.env.PUBLIC_URL + `/images/pieces/${color}${type}.png`} x={x} y={y}
			              width={square_size} onClick={onClick}/>
		}
	}

	const draw_hints = () => {
		const available = Array.from(moves[selected])
		return (
			available.map(to => {
				// todo is there a better way to do this than filtering
				const {id, x, y} = squares.filter(s => s.id === to)[0]
				return (
					<circle key={id} id={id} onClick={onClick} cx={x + square_size / 2} cy={y + square_size / 2}
					        r={is_empty(id) ? square_size * .175 : square_size / 2 - .75}
					        className={is_empty(id) ? 'hint-empty' : 'hint'}/>
				)
			})
		)
	}

	const onPromotionClick = (event) => {
		const {target: {id}} = event
		move(selected, promotingAt, id) // todo try catch here for confirmation ?
		setPromotingAt(null)
		setSelected(null)
	}


	const drawPromotion = () => {

		const x = file(promotingAt) * square_size
		const color = chess.turn()

		const above = chess.turn() === orientation
		const a_index = (index) => above ? index : 7 - index

		const modal_list = []

		modal_list.push(<rect x={x} y={above ? 0 : square_size * 3.5} width={square_size} height={square_size * 4.5}
		                      fill={"white"} key={"rect"}/>)
		PROMOTION_PIECES.forEach((piece, index) => modal_list.push(
			<image href={process.env.PUBLIC_URL + `/images/pieces/${color}${piece}.png`} x={x}
			       y={a_index(index) * square_size} width={square_size}
			       onClick={onPromotionClick} key={index + piece} id={piece}/>)
		)
		modal_list.push(<text x={x + square_size / 2} y={square_size * (a_index(4) + (above ? .375 : .875))}
		                      className={'exit-button'}
		                      onClick={() => setPromotingAt(null)} key={"button"}>B</text>)
		return modal_list
	}


	return (
		<svg id={"board"} className={"board"} viewBox={`0 0 ${dimensions} ${dimensions}`}>
			{squares.map(make_square)}
			{draw_file_labels()}
			{draw_rank_labels()}
			{squares.filter(s => chess.get(s.id)).map(draw_square_piece)}
			{!promotingAt && selected && selected in moves && draw_hints()}
			{promotingAt && drawPromotion()}
		</svg>
	)
}

export default Board