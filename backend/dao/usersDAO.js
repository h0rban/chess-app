import {ObjectId} from "mongodb";

// golbal vars
let users

const make_game_type_object = value => {
	return {
		blitz: value,
		puzzles: value,
		rapid: value,
		bullet: value,
		daily: value,
	}
}

const make_game_type_list_object = value => make_game_type_object([value])

const getIncString = game_type => {

	if (new Set(['blitz', 'rapid', 'bullet', 'daily']).has(game_type)) {
		return `stats.totals.${game_type}`
	}
	throw new Error("unknown game type")
}

const verifyUsername = username => {

	// checks that there is no whitespace
	if (/\s/g.test(username)) {
		throw new Error("string should include white space")
	}

	// todo add more like swear words, there is probably a library for this

	return username
}

export default class UsersDAO {

	static async injectDB(con, test = false) {
		if (!users) {
			try {

				const env = process.env
				const db_string = test ? env.CHESS_TEST_NS : env.CHESS_NS

				users = await con.db(db_string).collection('users')
			} catch (e) {
				console.error(`Unable to connect in UsersDAO, ${e}`)
			}
		}
	}

	// todo update tests to include email
	static async addUser(username, google_id, email, date) {

		if (!username || !google_id || !email || !date) {
			throw new Error('expecting username and google_id to exist')
		}


		// todo check if exists
		const query = {
			$or: [
				{ username: username},
				{ google_id: google_id }
			]
		}
		const response =  await users.findOne(query)
		if (response) {
			console.log('user already exists - skipping add')
			return {insertedId: response._id}
		}

		const document = {
			// todo figure out
			// _id: new ObjectId(google_id),
			email: email,
			google_id: google_id,
			username: username,
			registration_date: date,
			games: [],
			puzzles: [],
			stats: {
				rating: make_game_type_list_object(600),
				totals: make_game_type_object(0),
			}
		}

		return await users.insertOne(document)
	}

	static async getUserById(user_id) {
		// Note: if user not found, returns null
		if (!user_id) throw new Error('expecting id to be non null')
		const query = {_id: new ObjectId(user_id)}
		try {
			return await users.findOne(query)
		} catch (e) {
			console.error(`Unable to get user by id: ${e}`)
		}
	}

	static async updateUser(user_id, username, game, puzzle_id) {

		const filter = {_id: new ObjectId(user_id),}

		const update = {} // empty by default

		// todo consider making separate methods for this
		// note can only update one thing at a time

		if (username) {

			update.$set = {username: verifyUsername(username)}

		} else if (game) {

			if (!game._id || !game.type) {
				// todo add more fields in the future
				throw new Error('expecting the game to contain id and type')
			}

			update.$push = {games: game._id}

			// note game here can have different types
			// todo is there a better way of building this object
			let inc = {}
			inc[getIncString(game.type)] = 1
			update.$inc = inc

			// todo also update rating later (remember that it is a list)

		} else if (puzzle_id) {

			update.$push = {puzzles: puzzle_id}
			update.$inc = {"stats.totals.puzzles": 1}

		} else {
			throw new Error('no update information provided')
		}

		try {
			return await users.updateOne(filter, update)
		} catch (e) {
			console.error(`Unable to update user: ${e}`)
		}
	}

	static async deleteUser(user_id) {

		// todo this currently returns all games and all rating, should omit by choosing fields

		if (!user_id) throw new Error("expecting id user_id to be non null")
		const filter = {_id: new ObjectId(user_id)}

		try {
			return await users.deleteOne(filter)
		} catch (e) {
			console.error(`Unable to delete user: ${e}`)
		}
	}
}