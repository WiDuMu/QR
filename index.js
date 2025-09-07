import { toSvgString, toSvgStringRainbow, toSvgStringCircle, drawCanvas, createImage, createImageRainbowDots } from './QRCode.js';

const textInput = document.querySelector("#url");
const fgInput = document.querySelector("#fg-color");
const bgInput = document.querySelector("#bg-color");
fgInput.value = "#000000";
bgInput.value = "#FFFFFF";
textInput.value = "";

const updateInput = () => showText(textInput.value, fgInput.value, bgInput.value);

textInput.addEventListener("input", updateInput);
fgInput.addEventListener("input", updateInput);
bgInput.addEventListener("input", updateInput);

const QR = document.getElementById("qr-code");
const errorElement = document.getElementById("qr-code-errors");
const QRDownload = document.getElementById("qr-download-button");
const downloadLink = document.getElementById("secret-download-link");

QRDownload.addEventListener("click", async () => {
	// const encoded = toSvgString(textInput.value, 2, bgInput.value, fgInput.value);
	// const blob = new File([encoded], "qr.svg", { type: "image/svg+xml"});
	// const url = URL.createObjectURL(blob);
	const blob = new File([await createImageRainbowDots(textInput.value, 16, 2, bgInput.value, fgInput.value)], "qr.png", {type: "image/png"});
	const url = URL.createObjectURL(blob);
	downloadLink.href = url;
	downloadLink.click();
	URL.revokeObjectURL(url);
});

function showText(text, fg, bg) {
	errorElement.replaceChildren();
	try {
		QR.innerHTML = toSvgString(text, 2, bg ? bg : "white", fg ? fg : "black");
		QR.toggleAttribute("hidden", false);
		QRDownload.toggleAttribute("hidden", false);
	} catch (e) {
		console.log(e)
		QR.toggleAttribute("hidden", true);
		QRDownload.toggleAttribute("hidden", true);
		const error = document.createElement("li");
		error.textContent =
			"Error: Your text is too long to be encoded into a QR code. Please shorten it.";
		errorElement.append(error);
	}
}
