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
import { clientId, emotions, genresCollection } from "../constants";
import { wallpaper, textWallpaper } from "../images";
import "./dashboard.css";
import "./home.css";

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

	const playTrack = (track) => {
		setPlayingTrack(track);
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

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(aboutToday);
		// const randomGenre = emotions[randomize(0, emotions.length)];
		try {
			const emotion = await getEmotionByText(aboutToday);
			console.log("handleSubmit emotion", emotion);
			const res = await getTracksByGenre(emotion);
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
							<p>
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
						<div className="home-music-content">
							{genre !== "" && (
								<h1 data-aos="fade-left">
									Here's what we found for you
								</h1>
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
													/>
												))}
											</div>
										</div>
										<Player
											accessToken={accessToken}
											trackUri={playingTrack?.uri}
										/>
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
