export const isAlphaChar = (c) =>
	(c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || (c >= "0" && c <= "9");

export const formatText = (text) => {
	let newText = "";
	for (let i = 0; i < text.length; i++) {
		if (isAlphaChar(text[i])) {
			newText += text[i];
		} else if (text[i] === " ") {
			newText += "_";
		}
	}
	return newText;
};
