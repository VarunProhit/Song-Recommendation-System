import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import Track from "../components/Track";
import Player from "../components/Player";
import MaterialIcons from "../components/MaterialIcons";
import empty from "../images/empty.svg";
import emptyCart from "../images/empty-cart.svg";
import { randomize } from "../utils";
import "./dashboard.scss";
import "./home.scss";
import {
	clientId,
	emotions,
	genresCollection,
	getQuoteForEmotion,
	paperQuotesToken,
} from "../constants";
import { wallpaper, textWallpaper } from "../images";

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
});

const Dashboard = ({ code }) => {
	const accessToken = useAuth(code);
	const [genre, setGenre] = useState("");
	const [aboutToday, setAboutToday] = useState("");
	const [tracks, setTracks] = useState([]);
	const [playingTrack, setPlayingTrack] = useState();
	const [activeScreen, setActiveScreen] = useState(1);
	const [quote, setQuote] = useState("");
	const [quoteAuthor, setQuoteAuthor] = useState("");

	const playTrack = (track) => {
		setPlayingTrack(track);
	};
	const playNextTrack = () => {
		const index = tracks.findIndex(
			(track) => track.uri === playingTrack.uri
		);
		setPlayingTrack(tracks[(index + 1) % tracks.length]);
	};
	const playPreviousTrack = () => {
		const index = tracks.findIndex(
			(track) => track.uri === playingTrack.uri
		);
		setPlayingTrack(
			index === 0 ? tracks[tracks.length - 1] : tracks[index - 1]
		);
	};

	const getEmotionByText = async (text) => {
		console.log(text);
		try {
			const res = await axios.get(
				`http://localhost:4000/emotion/${text}`
			);
			setGenre(res.data.emotion);
			return res.data.emotion;
		} catch (error) {
			console.error(error);
			return error?.response?.data;
		}
	};

	const getTracksByGenre = async (genre) => {
		if (!emotions.includes(genre)) return [];
		const genreToSeed =
			genresCollection.get(genre)[
				randomize(0, genresCollection.get(genre)?.length)
			];
		try {
			const res = await axios.get(
				`https://api.spotify.com/v1/recommendations?seed_genres=${genreToSeed}&limit=10`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);
			return res?.data?.tracks;
		} catch (error) {
			return error?.response?.data;
		}
	};

	const getQuoteByGenre = async (genre) => {
		if (!emotions.includes(genre)) return "";
		try {
			const res = await axios.get(
				`https://api.paperquotes.com/quotes/?tags=${genre}&language=en`,
				{
					headers: {
						Authorization: `Token ${paperQuotesToken}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log(res);
			if (res.status === 200) {
				setQuoteAuthor(res?.data?.results[0]?.author);
				return res?.data?.results[0]?.quote;
			}
			return "";
		} catch (error) {
			console.error(error);
			return "";
		}
	};

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(aboutToday);
		try {
			const emotion = await getEmotionByText(aboutToday);
			console.log("handleSubmit emotion", emotion);
			const res = await getTracksByGenre(emotion);
			const fetchQuote = await getQuoteByGenre(emotion);
			setQuote(() => fetchQuote);
			if (res?.length === 0) return setTracks(() => []);
			else {
				const tracksToSet = res.map((track) => {
					const smallestImage = track.album.images.reduce(
						(smallest, image) =>
							image.height < smallest.height ? image : smallest,
						track.album.images[0]
					);
					return {
						artist: track.artists[0].name,
						title: track.name,
						uri: track.uri,
						albumUrl: smallestImage.url,
					};
				});
				console.log(tracksToSet);
				setTracks(() => tracksToSet);
				setActiveScreen(() => 3);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main
			className="home"
			style={{
				backgroundImage: `url(${
					activeScreen === 1 ? wallpaper : textWallpaper
				})`,
			}}
		>
			{activeScreen === 1 && (
				<>
					<section className="home-hero">
						<div className="home-hero-content">
							<h1 data-aos="fade-left">
								Hey There, Welcome to Jazzem
							</h1>
							<h3 data-aos="fade-left">
								Your one stop friend to play any music by your
								mood.
							</h3>
						</div>
						<button
							className="cta"
							onClick={() =>
								window.scrollTo(0, window.innerHeight)
							}
						>
							<MaterialIcons>arrow_downward</MaterialIcons>
							<span>Get Started</span>
						</button>
					</section>
					<section className="home-how">
						<div className="home-how-content">
							<h1>How it works?</h1>
							<p
								style={{
									fontSize: "3.5rem",
									lineHeight: "4rem",
									fontWeight: "500",
									color: "var(--blue-700)",
								}}
							>
								Tell us about your day what are you feeling
								right now and get the best music recommendations
								right at your fingertips.
							</p>
						</div>
						<button
							className="cta"
							onClick={() => setActiveScreen(() => 2)}
						>
							<MaterialIcons>arrow_forward</MaterialIcons>
							<span>Tell Us about your day</span>
						</button>
					</section>
				</>
			)}
			{activeScreen === 2 && (
				<>
					<section className="home-text">
						<button
							className="icon icon-lg go-back"
							onClick={() => setActiveScreen(() => 1)}
						>
							<MaterialIcons>arrow_back</MaterialIcons>
						</button>
						<div className="home-text-content">
							<h1 data-aos="fade-left">
								How are you feeling today?
							</h1>
							<form onSubmit={handleSubmit}>
								<textarea
									name="text"
									id="text"
									cols="30"
									rows="10"
									placeholder="So today..."
									value={aboutToday}
									onChange={(e) =>
										setAboutToday(e.target.value)
									}
								></textarea>
								{aboutToday.length > 0 && (
									<button className="cta" type="submit">
										<MaterialIcons>
											arrow_forward
										</MaterialIcons>
										<span>Get Music</span>
									</button>
								)}
							</form>
						</div>
					</section>
				</>
			)}
			{activeScreen === 3 && (
				<>
					<section className="home-music">
						<button
							className="icon icon-lg go-back"
							onClick={() => setActiveScreen(() => 2)}
						>
							<MaterialIcons>arrow_back</MaterialIcons>
						</button>
						<div className="home-music-content">
							{
								<h3 data-aos="fade-left">
									{getQuoteForEmotion(genre)}
								</h3>
							}
							{genre !== "" && quote !== "" && (
								<div className="home-music-quote">
									<blockquote className="otro-blockquote">
										<p>{quote}</p>
										<span>
											{quoteAuthor !== ""
												? quoteAuthor
												: "Unknown"}
										</span>
									</blockquote>
								</div>
							)}
							<div className="home-music-tracks">
								{genre === "" ? (
									<>
										<div className="null">
											<img src={empty} alt="Empty" />
											<h1 data-aos="fade-left">
												No tracks found for your mood
											</h1>
										</div>
									</>
								) : tracks.length > 0 ? (
									<>
										<div className="tracks-container">
											<div className="tracks">
												{tracks?.map((track, id) => (
													<Track
														track={track}
														key={id}
														playTrack={playTrack}
														playNext={playNextTrack}
														playPrev={
															playPreviousTrack
														}
														playingTrack={
															playingTrack
														}
													/>
												))}
											</div>
										</div>
										<div className="home-player">
											<Player
												accessToken={accessToken}
												trackUri={playingTrack?.uri}
											/>
										</div>
									</>
								) : (
									<>
										<div className="null">
											<img
												src={emptyCart}
												alt="empty cart"
											/>
											<h1 data-aos="fade-left">
												No tracks found for your mood
											</h1>
										</div>
									</>
								)}
							</div>
						</div>
					</section>
				</>
			)}
		</main>
	);

	/*return (
		<main className="dashboard">
			<div className="form-group">
				<label>
					<MaterialIcons>search</MaterialIcons>
				</label>
				<input
					type="text"
					placeholder="Search for a genre"
					className="mr-2"
					name="genre"
					value={genre}
					onChange={handleChange}
					autoFocus
				/>
			</div>
			<section>
				{genre === "" ? (
					<>
						<div className="null">
							<img src={empty} alt="Empty" />
							<h1>Search for a genre above</h1>
						</div>
					</>
				) : tracks.length > 0 ? (
					<div className="tracks-container">
						<h2>Tracks</h2>
						<div className="tracks">
							{tracks?.map((track, id) => (
								<Track
									track={track}
									key={id}
									playTrack={playTrack}
								/>
							))}
						</div>
					</div>
				) : (
					<>
						<div className="null">
							<img src={emptyCart} alt="empty cart" />
							<h1>No results found for {genre}</h1>
						</div>
					</>
				)}
			</section>
			<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
		</main>
	);*/
};

export default Dashboard;
