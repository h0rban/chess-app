/*
	This will handle routing of incoming http requests, based on their URLs.
 */
import express from 'express'
import UsersController from "./users.controller.js";
import GamesController from "./games.controller.js";
import GameplayController from "./gameplay.controller.js";

// get access to express router
const router = express.Router()
const route = path => router.route(path)

// USERS
route('/user')
	.post(UsersController.apiAddUser)
	.put(UsersController.apiUpdateUser)
	.delete(UsersController.apiDeleteUser)
route('/user/:id')
	.get(UsersController.apiGetUserById)

// DEFAULT
// todo think about what this should be
// router.route('/')

// GAMEPLAY

route('/play/:id')
	.get(GameplayController.apiGetCurrentGame)
route('/play')
	.post(GameplayController.apiStartNewGame)
	.put(GameplayController.apiPostGameAction)

// todo how do i retrieve new actions with redis channels
// i assume post will be move:e4

// GAMES
route('/games').post(GamesController.apiPostGame)
route('/games/:id').get(GamesController.apiGetGameById)
route('/games/idList/:idList').get(GamesController.apiGetGamesByIdList)

export default router