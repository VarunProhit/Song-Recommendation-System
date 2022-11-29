import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { clientId, clientSecret, redirectUri } from "./config/index.mjs";
import cors from "cors";
import child from "child_process";
import { formatText } from "./helpers/index.mjs";
// import { formateText } from "./helpers/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/login", (req, res) => {
	const spotifyApi = new SpotifyWebApi({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
	});
	const code = req.body.code;
	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(400);
		});
});

app.post("/refresh", (req, res) => {
	const spotifyApi = new SpotifyWebApi({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
		refreshToken: req.body.refreshToken,
	});
	const refreshToken = req.body.refreshToken;
	spotifyApi.setRefreshToken(refreshToken);
	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(400);
		});
});

app.get("/emotion/:text", (req, res) => {
	let text = req.params.text;
	let formattedText = formatText(text);
	console.log(formattedText)
	child.exec(
		`python main.py --text ${formattedText}`,
		(error, stdout, stderr) => {
			// if (stderr) {
			// 	console.error("error id ", stderr);
			// 	return res.status(500).json({
			// 		emotion: "Wait",
			// 		message: "Error occured",
			// 		error: stderr,
			// 	});
			// }
			// if (stdout) {
				console.log("op in js",stdout)
				console.error("error id ", error);
				console.error("error id ", stderr);
				return res
					.status(200)
					.json({ emotion: stdout.slice(0, stdout.length - 2) });
			//  } else return res.status(500).json({ emotion: "Server Error" });
		}
	);
});

app.listen(4000, () => {
	console.info("Server started on port 4000");
});
// Song-Recommendation-System