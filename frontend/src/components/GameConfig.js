import './GameConfig.css'

import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {
	ALL_TIME_CONTROL,
	GAME_TYPE_2PLAYERS,
	GAME_TYPE_COMPUTER,
	GAME_TYPE_ONLINE,
	TIME_10MIN,
	TIME_INFINITY
} from "./constants";
import {BLACK, WHITE} from "chess.js";
import {get_random} from "../utils";

const GameConfig = ({user}) => {

	const [color, set_color] = useState(WHITE)
	const [game_type, set_game_type] = useState(GAME_TYPE_COMPUTER)
	const [time_control, set_time_control] = useState(TIME_INFINITY)

	useEffect(() => {
		switch (game_type) {
			case GAME_TYPE_COMPUTER:
				set_time_control(TIME_INFINITY)
				set_color('random')
				break
			case GAME_TYPE_2PLAYERS:
				set_color('random')
				set_time_control(TIME_10MIN)
				break
			case GAME_TYPE_ONLINE:
				set_color('random')
				set_time_control(TIME_10MIN)
				break
			default:
				throw new Error('game type not supported:' + game_type)
		}
	}, [game_type])

	const make_game_type = type => {
		return (
			<Row>
				<Button className={"radio" + (game_type === type ? ' selected' : '')} variant={"primary"} type={"button"}
				        onClick={() => set_game_type(type)}>{type}</Button>
			</Row>
		)
	}

	const make_color = (s_color, text) => {
		return (
			<Row>
				<Button className={"radio" + (color === s_color ? ' selected' : '')} variant={"primary"}
				        type={"button"} onClick={() => set_color(s_color)}>{text}</Button>
			</Row>
		)
	}

	return (
		<Container className={'config-page'}>
			<Row>
				<Col className={'header'}>game type</Col>
				<Col className={'header'}>color</Col>
				<Col className={'header'}>time control</Col>
			</Row>
			<Row>

				{/* GAME TYPE */}
				<Col>
					{make_game_type(GAME_TYPE_COMPUTER)}

					{make_game_type(GAME_TYPE_2PLAYERS)}
					{user && make_game_type(GAME_TYPE_ONLINE)}
				</Col>

				{/* COLOR */}
				{game_type === GAME_TYPE_COMPUTER ?
					(
						<Col>
							{make_color('random', 'random')}
							{make_color(WHITE, 'white')}
							{make_color(BLACK, 'black')}
						</Col>
					)
					: (<Col>{make_color('random', 'random')}</Col>)
				}

				{/* TIME CONTROL*/}
				{game_type === GAME_TYPE_COMPUTER ?
					(
						<Col>
							<Button className={"radio" + (time_control === TIME_INFINITY ? ' selected' : '')} variant={"primary"}
							        type={"button"} onClick={() => set_time_control(TIME_INFINITY)}>∞</Button>
						</Col>
					)
					: (
						<Col>
							{ALL_TIME_CONTROL.map(tc => (
								<Button key={tc} className={"radio" + (time_control === tc ? ' selected' : '')} variant={"primary"}
								        type={"button"} onClick={() => set_time_control(tc)}>{tc}</Button>
							))}
						</Col>
					)}
			</Row>

			{/* FINAL PLAY BUTTON*/}
			<Row>
				<Link className={'play'} to={'/play/' + game_type}
				      state={{color: color === 'random' ? get_random([WHITE, BLACK]) : color, time_control: time_control}}>
					Play
				</Link>
			</Row>
		</Container>
	)
}

export default GameConfig