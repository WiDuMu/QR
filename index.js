import { toSvgString, toSvgStringCircle, drawCanvas } from './QRCode.js';

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

// const QRC = qrcodegen.QrCode;
const QR = document.getElementById("qr-code");
const errorElement = document.getElementById("qr-code-errors");
const QRDownload = document.getElementById("qr-download-button");
const downloadLink = document.getElementById("secret-download-link");

QRDownload.addEventListener("click", () => {
	const encoded = encodeSVG(textInput.value, bgInput.value, fgInput.value);
	const blob = new File([encoded], "qr.svg", { type: "image/svg+xml"});
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
