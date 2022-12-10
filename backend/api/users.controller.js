import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {

	static async apiAddUser(req, res, next) {
		try {

			console.log(req.body)

			const {body: {username, google_id, email}} = req
			const response = await UsersDAO.addUser(username, google_id, email, new Date())

			const {insertedId, error} = response

			if (error) {
				res.status(500).json({error: error})
			} else {
				res.json({
					status: 'success',
					insertedId: insertedId
				})
			}
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}

	static async apiUpdateUser(req, res) {
		try {

			const {body: {user_id, username, game, puzzle_id}} = req
			const response = await UsersDAO.updateUser(user_id, username, game, puzzle_id)

			if (response.error) {
				res.status(500).json({error: response.error})
			} else if (response.modifiedCount === 0) {
				res.status(500).json({error: `did not make modifications for user: ${user_id}`})
			} else {
				res.json({status: 'success'})
			}
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}

	static async apiDeleteUser(req, res) {
		try {

			const {body: {user_id}} = req
			const response = await UsersDAO.deleteUser(user_id)

			if (response.error) {
				res.status(500).json({error: response.error})
			} else if (response.deletedCount === 0) {
				res.status(500).json({error: `did not find user with id: ${user_id}`})
			} else {
				res.json({status: 'success'})
			}
		} catch (e) {
			res.status(500).json({error: e.message})
		}
	}

	static async apiGetUserById(req, res, next) {
		try {

			const {params: {id}} = req
			const response = await UsersDAO.getUserById(id)

			if (!response) {
				res.status(404).json({error: 'user not found'})
			} else {
				res.json(response)
			}
		} catch (e) {
			console.error(`apiGetUserById failed: ${e}`)
			res.status(500).json({error: e})
		}
	}
}