import mongodb from 'mongodb'

const ObjectId = mongodb.ObjectId
let games;

export default class GamesDAO {

	static async injectDB(con) {
		if (!games) {
			try {
				games = await con.db(process.env.CHESS_NS).collection('games')
			} catch (e) {
				console.error(`Unable to connect in GamesDAO, ${e}`)
			}
		}
	}

	static async getGames(
		{filters = null,
			page = 0,
			games_per_page = 20} = {}) {

		// filters will include user id

		// todo sort by recent

		let query
		if (filters) {
			if ('title' in filters) {
				query = {$text: {$search: filters.title}}
			} else if ('rated' in filters) {
				query = {'rated': {$eq: filters.rated}}
			}
		}

		try {
			const cursor = await games.find(query).limit(games_per_page).skip(games_per_page * page)
			const games_list = await cursor.toArray()
			const total_num_games = await games.countDocuments(query)

			return {games_list, total_num_games}
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`)
			return {games_list: [], total_num_games: 0}
		}
	}

	static async getGameById(game_id) {
		try {
			return await games.aggregate([
				{$match: {_id: new ObjectId(game_id)}},
				// check this
				// {$lookup: {from: 'games', localField: '_id', foreignField: 'user_id', as: 'players'}}
			]).next()
		} catch (e) {
			console.error(`Unable to get game by id: ${e}`)
			throw e;
		}
	}

	static async getGamesByUserId(user_id) {

	}
}