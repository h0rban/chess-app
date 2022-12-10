import app from './server.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import {createClient} from "redis";
import UsersDAO from "./dao/usersDAO.js";
import GamesDAO from "./dao/gamesDAO.js";
import GameplayDAO from "./dao/gameplayDAO.js";

const env = process.env

const getRedisClient = () => {
	const redis_client = !env.REDIS_SECRET
		// default connection at 127.0.0.1 port 6379 no password
		// todo see if i can pass it explicitly
		? createClient()
		: createClient({
			socket: {
				host: env.REDIS_HOST,
				port: env.REDIS_PORT
			},
			password: env.REDIS_SECRET
		})
	redis_client.on('connect', () => console.log('redis connected'))
	redis_client.on('error', (err) => console.log('Redis Client Error', err));
	return redis_client
}

async function main() {

	// sets up our environment variables with reference to the .env
	dotenv.config();

	// create a MongoDB client object with access to our database's URL
	const port = env.PORT || 8000;
	const test = Boolean(env.TEST && env.TEST === "true")
	const mongo_client = new mongodb.MongoClient(env.CHESS_DB_URI)
	const redis_client = getRedisClient()

	try {

		// connect the client object to the database then we pass the client object to the DAO
		await mongo_client.connect()
		await redis_client.connect();

		await UsersDAO.injectDB(mongo_client, test)
		await GamesDAO.injectDB(mongo_client)
		await GameplayDAO.injectDB(redis_client)

		app.listen(port, () => console.log(`Server is running on port: ${port}`))
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
}

main().catch(console.error)