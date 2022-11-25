import React from "react";
import { AUTH_URL } from "../constants";
import "./login.scss";
import logo from "../images/logo.gif";

const Login = () => {
	return (
		<main className="login">
			<section
				className="login-left"
				style={{
					backgroundImage: `url(${logo})`,
				}}
			></section>
			<section className="login-right">
				<h1>Jazzem</h1>
				<p>
					Get the right music for you. Millions of songs personalized
					just for your mood. No credit card needed. Just listen. Just
					play. Just Jazzem. Providing you access to millions of
					songs, login with your spotify account today.
				</p>
				<button
					className="btn btn-green btn-lg"
					onClick={() => window.open(AUTH_URL, "_self")}
				>
					Login with Spotify
				</button>
			</section>
		</main>
	);
};

export default Login;
