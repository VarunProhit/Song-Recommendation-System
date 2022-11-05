export const clientId = process.env.REACT_APP_CLIENT_ID;

export const paperQuotesToken = process.env.REACT_APP_PAPER_QUOTES_TOKEN;

export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export const emotions = ["joy", "sadness", "anger", "fear", "surprise", "love"];

export const genresCollection = new Map([
	[
		"joy",
		[
			"ambient",
			"acoustic",
			"world-music",
			"techno",
			"tango",
			"synth-pop",
			"summer",
			"samba",
			"salsa",
			"comedy",
			"rainy-day",
			"pop",
			"party",
			"metalcore",
			"club",
			"indie",
			"indie-pop",
			"jazz",
			"alt-rock",
			"road-trip",
			"j-dance",
			"j-idol",
			"j-pop",
			"j-rock",
			"k-pop",
			"metal",
			"rock",
			"rock-n-roll",
			"power-pop",
			"breakbeat",
			"british",
			"kids",
			"funk",
			"happy",
			"groove",
			"hip-hop",
			"folk",
			"death-metal",
			"disney",
			"children",
			"emo",
			"chill",
			"classical",
		],
	],
	[
		"sadness",
		[
			"ambient",
			"acoustic",
			"trance",
			"summer",
			"comedy",
			"sleep",
			"rainy-day",
			"sad",
			"piano",
			"jazz",
			"romance",
			"emo",
		],
	],
	[
		"anger",
		[
			"work-out",
			"road-trip",
			"metal",
			"comedy",
			"power-pop",
			"heavy-metal",
			"trance",
		],
	],
	[
		"fear",
		[
			"soul",
			"sad",
			"blues",
			"death-metal",
			"latin",
			"children",
			"disney",
			"sleep",
		],
	],
	[
		"love",
		[
			"ambient",
			"acoustic",
			"summer",
			"sleep",
			"rainy-day",
			"piano",
			"indie",
			"indie-pop",
			"sad",
			"bluegrass",
			"blues",
			"rock",
			"rock-n-roll",
			"romance",
			"hip-hop",
			"british",
			"folk",
			"french",
			"emo",
			"chill",
			"classical",
		],
	],
	[
		"surprise",
		[
			"world-music",
			"work-out",
			"techno",
			"tango",
			"synth-pop",
			"samba",
			"salsa",
			"pop",
			"party",
			"club",
			"psych-rock",
			"punk",
			"punk-rock",
			"alt-rock",
			"j-dance",
			"j-idol",
			"j-pop",
			"j-rock",
			"k-pop",
			"power-pop",
			"breakbeat",
			"heavy-metal",
			"edm",
			"electro",
			"electronic",
			"funk",
			"hip-hop",
			"drum-and-bass",
			"dance",
			"dancehall",
			"disco",
		],
	],
]);

export const getQuoteForEmotion = (emotion) => {
	switch (emotion) {
		case "joy":
			return "You are happy! Keep it up!";
		case "sadness":
			return "I'm sorry you are sad, here are some songs to cheer you up";
		case "anger":
			return "Oh you're angry? Here's something to calm your nerves";
		case "fear":
			return "You are afraid? Here's something to make you feel better";
		case "surprise":
			return "You are surprised? Here's something that might surprise you even more";
		case "love":
			return "Oh you are in love... Let's listen to some love songs";
		default:
			return "I'm sorry, I don't know what to say";
	}
};
