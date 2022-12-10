import axios from "axios";

class GamePlayDataService {

	api_base = process.env.REACT_APP_API_BASE_URL


	getCurrentGame(google_id) {
		console.log(google_id)
		return axios.get(`${this.api_base}/api/v1/play/${google_id}`)
	}

	startGame(google_id, type) {
		return axios.post(`${this.api_base}/api/v1/play`, {
			google_id: google_id,
			type: type
		})
	}

	makeGameAction(game_id, user_id, action) {
		return axios.put(`${this.api_base}/api/v1/play`, {
			game_id: game_id,
			user_id: user_id,
			action: action
		})
	}

}

export default new GamePlayDataService()