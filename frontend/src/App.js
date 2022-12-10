import './App.css';

import {Routes, Route, Link, Navigate} from "react-router-dom"
import {useState, useEffect} from "react";

import Login from "./components/Login";
import Logout from "./components/Logout";
import {GoogleOAuthProvider} from '@react-oauth/google';

import "bootstrap/dist/css/bootstrap.min.css"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import GameConfig from "./components/GameConfig";
import {GAME_TYPE_2PLAYERS, GAME_TYPE_COMPUTER, GAME_TYPE_ONLINE} from "./components/constants";
import Play2Players from "./components/Play2Players";
import PlayComputer from "./components/PlayComputer";
import PlayOnline from "./components/PlayOnline";
import History from "./components/History";
import Profile from "./components/Profile";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

	const [user, setUser] = useState(null)

	useEffect(() => {
		let loginData = JSON.parse(localStorage.getItem("login"));
		if (loginData) {
			let loginExp = loginData.exp;
			let now = Date.now() / 1000;
			if (now < loginExp) {
				// Not expired
				setUser(loginData);
			} else {
				// Expired
				localStorage.setItem("login", null);
			}
		}
	}, []);

	const nav_bar = (
		<Navbar className={"navbar"} expand={"lg"} sticky={"top"} variant={"dark"}>
			<Container className={"container-fluid"}>
				<Navbar.Brand className={"brand"} href={"/"}>
					{/*todo check why the logo disappears on review page if reloaded*/}
					<img src={process.env.PUBLIC_URL + "/favicon.ico"} alt={"chess logo"} className={"chessLogo"}/>
					chess
				</Navbar.Brand>
				<Navbar.Toggle aria-controls={"basic-navbar-nav"}/>
				<Navbar.Collapse id={"responsive-nav-bar"}>
					<Nav className={"ml-auto"}>
						<Nav.Link as={Link} to={"/play"}>play</Nav.Link>
						{user && <Nav.Link as={Link} to={"/profile"}>profile</Nav.Link>}
						{user && <Nav.Link as={Link} to={"/history"}>history</Nav.Link>}
					</Nav>
				</Navbar.Collapse>
				{user ? <Logout setUser={setUser}/> : <Login setUser={setUser}/>}
			</Container>
		</Navbar>
	)

	// const ger_redirect = () => {
	// 	if (!game) {
	// 		throw new Error('no game info');
	// 	}
	// 	switch (game.type) {
	//
	// 	}
	// 	return '/play/' + GAME_TYPE_COMPUTER
	// }

	// todo figure out how to redirect to an active game
	const routes = () => {
		// if (game) {
		// 	return <Routes>
		// 		<Route path="*" element={<Navigate to={ger_redirect()} replace element={<PlayComputer user={user} game={game}/>}/>}/>
		// 	</Routes>
		// }
		return <Routes>
			<Route exact path={"/"} element={<GameConfig user={user}/>}/>
			<Route exact path={"/play"} element={<GameConfig user={user}/>}/>
			<Route exact path={'/play/' + GAME_TYPE_COMPUTER} element={<PlayComputer user={user}/>}/>
			<Route exact path={'/play/' + GAME_TYPE_2PLAYERS} element={<Play2Players user={user}/>}/>
			<Route exact path={'/play/' + GAME_TYPE_ONLINE} element={<PlayOnline user={user}/>}/>
			<Route exact path={"/history"} element={<History/>}/>
			<Route exact path={"/profile"} element={<Profile/>}/>
		</Routes>
	}



	return (
		<GoogleOAuthProvider clientId={clientId}>
			<div className={"App"}>
				{nav_bar}
				{routes()}
			</div>
		</GoogleOAuthProvider>
	)
}

export default App;
