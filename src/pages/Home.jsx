import React from "react";
import { wallpaper } from "../images";

const Home = () => {
	return (
		<main className="home" style={{
            backgroundImage: `url(${wallpaper})`,
        }}>
			<section className="home-hero">
				<h1>Hey There, Welcome to Jazzem</h1>
                <h3>Your one stop friend to play any music by your mood.</h3>
			</section>
		</main>
	);
};

export default Home;
