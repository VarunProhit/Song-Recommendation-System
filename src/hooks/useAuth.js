import React from "react";
import axios from "axios";

export default function useAuth(code) {
	const [accessToken, setAccessToken] = React.useState();
	const [refreshToken, setRefreshToken] = React.useState();
	const [expiresIn, setExpiresIn] = React.useState();

	React.useEffect(() => {
		if (!code) return;
		axios
			.post("http://localhost:4000/login", {
				code,
			})
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				window.history.pushState({}, null, "/");
			})
			.catch((err) => {
				console.log(err);
				window.location = "/";
			});
	}, [code]);

	React.useEffect(() => {
		if (!refreshToken || !expiresIn) return;
		const interval = setInterval(() => {
			axios
				.post("http://localhost:4000/refresh", {
					refreshToken,
				})
				.then((res) => {
					setAccessToken(res.data.accessToken);
					setExpiresIn(res.data.expiresIn);
				})
				.catch((err) => {
					console.log(err);
					window.location = "/";
				});
		}, (expiresIn - 60) * 1000);
		return () => clearInterval(interval);
	}, [refreshToken, expiresIn]);

	return accessToken;
}
