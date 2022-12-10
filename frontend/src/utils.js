import {PAWN} from "chess.js";


export const get_random = list => list[Math.floor(Math.random() * list.length)]


export const rank = (id) => parseInt(id[1])
export const promotion_time = (chess, from, to) => chess.get(from).type === PAWN && new Set([1, 8]).has(rank(to))

export const placeholder = () =>
	<div style={{
		width: '33%',
		padding: '1rem',
		fontSize: '2em',
		color: 'white',
	}}>
		This is not currently implemented
	</div>