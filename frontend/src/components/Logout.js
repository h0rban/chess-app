import React from "react";
import {GoogleLogin, googleLogout} from '@react-oauth/google';
import Button from "react-bootstrap/Button";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function Logout({setUser}) {
	const onSuccess = () => {
		googleLogout();  // helper for logging out
		setUser(null);
		localStorage.setItem("login", null);  // clearing local storage
	}

	const onFailure = () => console.log('failed to logout')

	return (
		<div>
			{/* TODO see how to have a google logout button*/}
			<Button variant="primary" onClick={onSuccess}>Logout</Button>
		</div>
	)

}

export default Logout