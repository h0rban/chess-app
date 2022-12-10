import Gameplay from "./Gameplay";
import {GAME_TYPE_COMPUTER} from "./constants";
import {useLocation} from "react-router-dom";

const PlayComputer = ({user}) => {

	const location = useLocation()

	console.log(location)
	const {color} = location.state

	return <Gameplay user={user} game_type={GAME_TYPE_COMPUTER} user_color={color}/>
}

export default PlayComputer