import React from "react";
import MaterialIcons from "./MaterialIcons";
import "./track.scss";

const Track = ({ track, playTrack, playingTrack, playNext, playPrev }) => {
	const handlePlay = () => {
		playTrack(track);
	};
	return (
		<div className="track">
			<div
				className="track-image"
				style={{
					backgroundImage: `url(${track?.albumUrl})`,
				}}
			>
				<a href={track?.external_urls?.spotify} className="icon">
					<MaterialIcons>north_east</MaterialIcons>
				</a>
			</div>
			<div className="track-content">
				<span className="track-name">{track?.title}</span>
				<span className="track-artist">{track?.artist}</span>
				<div className="track-controls">
					<button className="icon" onClick={playPrev}>
						<MaterialIcons>skip_previous</MaterialIcons>
					</button>
					<button className="icon btn-green" onClick={handlePlay}>
						<MaterialIcons>
							{playingTrack?.uri === track?.uri
								? "pause"
								: "play_arrow"}
						</MaterialIcons>
					</button>
					<button className="icon" onClick={playNext}>
						<MaterialIcons>skip_next</MaterialIcons>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Track;
