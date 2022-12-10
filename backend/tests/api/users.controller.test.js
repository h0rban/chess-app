import axios from "axios";
import dotenv from 'dotenv'
import {MongoClient, ObjectId} from "mongodb";
import UsersDAO from "../../dao/usersDAO.js";

// NOTE THAT FOR THIS TO WORK SERVER HAS TO BE RUNNING
// todo see how can integrate this : https://github.com/visionmedia/supertest
// todo figure out if i can use supertest for this ! maybe if app does not work use url

let users
let api_base
let mongo_client
let insertedId

const asserThrows = (promise, error_type, error_msg) => {
	promise
		.then(() => fail())
		.catch(e => {
			expect(e).toEqual(expect.any(error_type))
			expect(e.message).toEqual(error_msg)
		})
}

beforeAll(async () => {

	dotenv.config();
	const env = process.env
	api_base = 'http://localhost:' + env.PORT + '/api/v1'

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

describe('POST /user', () => {

	it('correct', async () => {
		let response = await axios.post(api_base + '/user', {
			username: "test_user",
			google_id: 123
		})
		expect(response.status).toBe(200)

		// save inserted id for later use
		insertedId = response.data.insertedId

		response = await axios.post(api_base + '/user', {
			username: "test_user_2",
			google_id: 1234
		})
		expect(response.status).toBe(200)

	})

	it('no data provided', () => {

		// todo see whats wrong here
		// asserThrows(axios.post(api_base + '/user', {}),
		// 	Error, 'hi')
	})

	it('duplicate google_id', async () => {
		// todo
	})

	it('duplicate username', async () => {
		// todo
	})

})

describe('GET /user/:id', () => {

	it('correct', async () => {
		// todo
	})

	it('no id provided', async () => {
		// todo
	})

	it('missing id', async () => {
		// todo
	})
})

describe('PUT /user', () => {

	// todo this might a bit more complicated, review after check in with instructor

	it('username correct', async () => {

	})

	it('game correct', async () => {

	})

	it('puzzle correct', async () => {

	})

	it('invalid user id', async () => {

	})

	it('invalid game object', async () => {

	})

	it('invalid game type', async () => {

	})

	it('no change provided\'', async () => {

	})
})

describe('DELETE /user', () => {

	it('correct', async () => {
		// todo
	})

	it('no data provided', async () => {
		// todo
	})

	it('missing', async () => {
		// todo
	})

})
