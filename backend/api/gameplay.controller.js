import GameplayDAO from "../dao/gameplayDAO.js";

export default class GameplayController {

	// todo or enroll in game queue
	// start game against computer if there are no users, have a wait timeout
	static async apiStartNewGame(req, res, next) {

		try {
			const {body: {google_id, type}} = req
			const response = await GameplayDAO.startNewGame(google_id, type)
			const {error} = response
			if (error) {
				res.status(500).json({error})
			}
			res.json({status: 'success'})
		} catch (e) {
			console.log(`API, failed to start new game, ${e}`)
			res.status(500).json({error: e.message})
		}

	}

	static async apiPostGameAction(req, res, next) {

	}

	static async apiGetCurrentGame(req, res, next) {

		try {
			const {params: {id}} = req
			const response = await GameplayDAO.getCurrentGame(id)

			res.json(response)

			// todo see if game not found

			// if (!response) {
			// 	res.status(404).json({error: 'user not found'})
			// } else {
			// 	res.json(response)
			// }
		} catch (e) {
			console.error(`apiGetCurrentGame failed: ${e}`)
			res.status(500).json({error: e})
		}
	}
}