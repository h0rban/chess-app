import dotenv from 'dotenv'
import {MongoClient, MongoServerError, ObjectId} from "mongodb";
import UsersDAO from "../../dao/usersDAO.js";

let users
let mongo_client

beforeAll(async () => {

	dotenv.config();
	const env = process.env

	// save client
	mongo_client = new MongoClient(env.CHESS_DB_URI)
	await mongo_client.connect()

	// drop if exists
	await mongo_client.db(env.CHESS_TEST_NS).dropDatabase()

	// add new collection
	const dbo = mongo_client.db(env.CHESS_TEST_NS)
	await dbo.createCollection("users")
	await UsersDAO.injectDB(mongo_client, true)

	// save collection
	users = dbo.collection("users")

	// todo make sure this is present in my new database
	await users.createIndex({"google_id": 1}, {unique: true})
	await users.createIndex({"username": 1}, {unique: true})

})

afterAll(async () => {
	await mongo_client.close()
})

const asserThrows = (promise, error_type, error_msg) => {
	promise
		.then(() => fail())
		.catch(e => {
			expect(e).toEqual(expect.any(error_type))
			expect(e.message).toEqual(error_msg)
		})
}

let insertedId
let expected_test_user

describe('initial tests', () => {

	it('initial test', async () => {
		const data = await users.find().toArray()
		expect(data).toEqual([])

		const googleId = 1
		const oid1 = new ObjectId(googleId)
		const oid2 = new ObjectId(googleId)
		expect(oid1).not.toEqual(oid2)
	})

})

describe('addUser', () => {

	it('correct', async () => {

		const date = new Date()
		const res = await UsersDAO.addUser('test_user', 1, date)
		expect(res).toEqual({
			acknowledged: true,
			insertedId: expect.any(ObjectId)
		})

		insertedId = res.insertedId
		expected_test_user = {
			_id: new ObjectId(insertedId),
			google_id: 1,
			username: 'test_user',
			registration_date: date,
			games: [],
			puzzles: [],
			stats: {
				rating: {
					blitz: [600],
					puzzles: [600],
					rapid: [600],
					bullet: [600],
					daily: [600]
				},
				totals: {blitz: 0, puzzles: 0, rapid: 0, bullet: 0, daily: 0}
			}
		}

		const data = await users.find().toArray()
		expect(data.length).toBe(1)

		expect(data[0]).toEqual(expected_test_user)
	})

	it('no data provided', async () => {
		// todo three different cases
	})

	it('duplicate google_id', () => asserThrows(
		UsersDAO.addUser('new_user', 1, new Date()),
		MongoServerError, "E11000 duplicate key error collection: chess_db_test.users index: " +
		"google_id_1 dup key: { google_id: 1 }"))

	it('duplicate username', () => asserThrows(
		UsersDAO.addUser('test_user', 2, new Date()),
		MongoServerError, "E11000 duplicate key error collection: chess_db_test.users index: " +
		"username_1 dup key: { username: \"test_user\" }"))
})

describe('getUserById', () => {

	it('correct id', async () => {
		expect(await UsersDAO.getUserById(insertedId)).toEqual(expected_test_user)
	})

	it('no id provided', async () => {
		// todo
	})

	it('non existing id', async () => {
		// todo check this test
		// expect(await UsersDAO.getUserById(null)).toBeNull()
		expect(await UsersDAO.getUserById(1)).toBeNull()
	})
})

describe('updateUser', () => {

	it('username correct', async () => {

		const res = await UsersDAO.addUser("toBeChanged", 2, new Date())
		let user_id = res.insertedId
		let user = await UsersDAO.getUserById(user_id)
		expect(user.username).toEqual("toBeChanged")

		await UsersDAO.updateUser(user_id, 'new username', null, null)
		user = await UsersDAO.getUserById(user_id)
		expect(user.username).toEqual("new username")

		await UsersDAO.deleteUser(user_id)
	})

	// todo remove this
	const valid_game = {_id: new ObjectId(1), type: "blitz"}

	it('game correct', async () => {

		let user = await UsersDAO.getUserById(insertedId)
		expect(user.stats.totals.blitz).toBe(0)
		expect(user.games).toEqual([])

		await UsersDAO.updateUser(insertedId, null, valid_game, null)

		user = await UsersDAO.getUserById(insertedId)
		expect(user.stats.totals.blitz).toBe(1)
		expect(user.games).toEqual([valid_game._id])
	})

	it('puzzle correct', async () => {
		let user = await UsersDAO.getUserById(insertedId)
		expect(user.stats.totals.puzzles).toBe(0)
		expect(user.puzzles).toEqual([])

		const puzzle_id = new ObjectId(1)
		await UsersDAO.updateUser(insertedId, null, null, puzzle_id)

		user = await UsersDAO.getUserById(insertedId)
		expect(user.stats.totals.puzzles).toBe(1)
		expect(user.puzzles).toEqual([puzzle_id])
	})

	it('invalid user id', async () => {

		let data = await users.find().toArray()
		expect(data.length).toBe(1)
		expect(data[0].username).toEqual("test_user")

		await UsersDAO.updateUser(null, 'new username', null, null)

		// has no affect
		data = await users.find().toArray()
		expect(data.length).toBe(1)
		expect(data[0].username).toEqual("test_user")
	})

	it('invalid game object', () => asserThrows(
		UsersDAO.updateUser(insertedId, null, {}, null, null),
		Error, 'expecting the game to contain id'
	))

	it('invalid game type', () => asserThrows(
		UsersDAO.updateUser(insertedId, null, {_id: new ObjectId(1), type: "hello"}, null),
		Error, "unknown game type"))

	it('no change provided', () => asserThrows(
		UsersDAO.updateUser(insertedId, null, null, null),
		Error, 'no update information provided'))
})

describe('deleteUser', () => {

	it('correct', async () => {

		const data = await users.find().toArray()
		expect(data.length).toBe(1)
		await UsersDAO.deleteUser(insertedId)
		expect(await users.find().toArray()).toEqual([])
	})

	it('no data provided', async () => {
		// todo
	})

	it('missing', async () => {
		expect(await UsersDAO.deleteUser(123)).toEqual({
			acknowledged: true,
			deletedCount: 0
		})
	})

})