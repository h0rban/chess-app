import {ObjectId} from "mongodb";
import {Chess} from "chess.js";

let gameplay

export default class GameplayDAO {

	static async injectDB(con) {
		if (!gameplay) {
			try {
				// todo follows mongo design but might not be necessary
				gameplay = con
			} catch (e) {
				console.error(`Unable to connect in GameplayDAO, ${e}`)
			}
		}
	}

	static async startNewGame(google_id, type) {

		// todo how to use type

		// todo should not work if playing
		// todo return the created game id, use same as mongo maybe

		console.log('creating new game')

		const id = new ObjectId()

		console.log(await gameplay.set(`google_id:${google_id}`, id))
		console.log(await gameplay.set(id, new Chess().pgn()))
	}

	static async getCurrentGame(google_id) {
		// Note: if game not found, returns null
		if (!google_id) throw new Error('expecting id to be non null')
		// try {
		// 	return await users.findOne(query)
		// } catch (e) {
		// 	console.error(`Unable to get user by id: ${e}`)
		// }


		return await gameplay.get(`google_id:${google_id}`)
	}

	static async makeAction(game_id, google_id, action) {

		// move = {from: e2, to: e4}
		// can be resignation or offering of a draw


		// await redis_client.set('jskey', 'value');
		// const value = await redis_client.get('jskey');


	}

	// todo will probably need get move / listen for move (unless i cn figure out the subscription)

}