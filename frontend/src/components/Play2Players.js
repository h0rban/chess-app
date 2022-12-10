import Gameplay from "./Gameplay";
import {GAME_TYPE_2PLAYERS} from "./constants";
import {useLocation} from "react-router-dom";

const Play2Players = ({user}) => {

	const location = useLocation()
	const {color} = location.state
	return <Gameplay user={user} game_type={GAME_TYPE_2PLAYERS} user_color={color}/>
}

export default Play2Players