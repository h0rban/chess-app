import {BISHOP, KNIGHT, QUEEN, ROOK} from "chess.js";

/*
	GAME STATUS
 */
export const PLAYING = 'playing'
export const CHECKMATE = 'checkmate'
export const STALEMATE = 'stalemate'
export const INSUFFICIENT_MATERIAL = 'insufficient_material'
export const REPETITION = 'repetition'

export function game_status(chess) {
	if (!chess.game_over()) return PLAYING
	if (chess.in_checkmate()) return CHECKMATE
	if (chess.in_draw()) {
		if (chess.in_stalemate()) return STALEMATE
		if (chess.insufficient_material()) return INSUFFICIENT_MATERIAL
		if (chess.in_threefold_repetition()) return REPETITION
		throw new Error('unknown draw')
	}
	throw new Error('unknown game over')
}

/*
	GAME TYPES
 */
export const GAME_TYPE_2PLAYERS = '2-players'
export const GAME_TYPE_COMPUTER = 'computer'
export const GAME_TYPE_ONLINE = 'online'

/*
	TIME CONTROL
 */
export const TIME_INFINITY = '∞'
export const TIME_1MIN = '1 min'
export const TIME_3MIN = '3 min'
export const TIME_5MIN = '5 min'
export const TIME_10MIN = '10 min'
export const TIME_1_PLUS_1 = '1 | 1'
export const TIME_3_PLUS_2 = '3 | 2'
export const TIME_5_PLUS_5 = '5 | 5'
export const TIME_15_PLUS_10 = '15 | 10'

export const ALL_TIME_CONTROL = [
	TIME_1MIN,
	TIME_1_PLUS_1,
	TIME_3MIN,
	TIME_3_PLUS_2,
	TIME_5MIN,
	TIME_5_PLUS_5,
	TIME_10MIN,
	TIME_15_PLUS_10
]

/*
	OTHER
 */
export const DELAY = 100
export const PROMOTION_PIECES = [
	QUEEN,
	KNIGHT,
	ROOK,
	BISHOP
]
