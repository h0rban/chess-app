import axios from 'axios'

class UsersDataService {

	api_base = process.env.REACT_APP_API_BASE_URL

	postUser(data) {
		return axios.post(`${this.api_base}/api/v1/user`, data)
	}
}

export default new UsersDataService()