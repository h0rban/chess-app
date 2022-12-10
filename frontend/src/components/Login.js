import React from 'react'

import UsersDataService from '../services/users'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode  from 'jwt-decode';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function Login({setUser}) {

	const onSuccess = async res => {
		let tokenData = jwt_decode(res.credential);
		let loginData = {
			googleId: tokenData.sub,
			...tokenData
		}

		// console.log(loginData)

		const {family_name, given_name, googleId, email} = loginData

		// todo if new user - register with my id and prompt for username
		let username = given_name + '_' + family_name
		await UsersDataService.postUser({
			username: username,
			google_id: googleId,
			email: email
		})

		// todo do a db search and set user with the response
		setUser(loginData);
		localStorage.setItem("login", JSON.stringify(loginData));
	};

	const onFailure = res => console.log('Login failed:', res)

	return <div>
		<GoogleLogin
			clientId={clientId}
			buttonTest={'login'}
			onSuccess={onSuccess}
			onFailure={onFailure}
			cookiePolicy={'single_host_origin'}
			style={{marginTop: '100px'}}
			isSignedIn={true}
		/>
	</div>
}

export default Login