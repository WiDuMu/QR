const textInput = document.querySelector('#url');
const fgInput = document.querySelector('#fg-color');
const bgInput = document.querySelector('#bg-color');
fgInput.value = "#000000";
bgInput.value = "#FFFFFF";
textInput.value = "";

textInput.addEventListener('input', e => showText(textInput.value, fgInput.value, bgInput.value));
fgInput.addEventListener('input', e => showText(textInput.value, fgInput.value, bgInput.value));
bgInput.addEventListener('input', e => showText(textInput.value, fgInput.value, bgInput.value));

const QRC = qrcodegen.QrCode;
const QR = document.getElementById('qr-code');

function showText(text, fg, bg) {
   qr0 = QRC.encodeText(text, QRC.Ecc.MEDIUM);
   console.log(text)
   QR.innerHTML = toSvgString(qr0, 2, bg ? bg : "white", fg ? fg: "black");
   QR.toggleAttribute('hidden', false);
}

	// // Draws the given QR Code, with the given module scale and border modules, onto the given HTML
	// // canvas element. The canvas's width and height is resized to (qr.size + border * 2) * scale.
	// // The drawn image is purely dark and light, and fully opaque.
	// // The scale must be a positive integer and the border must be a non-negative integer.
	// function drawCanvas(qr: qrcodegen.QrCode, scale: number, border: number, lightColor: string, darkColor: string, canvas: HTMLCanvasElement): void {
	// 	if (scale <= 0 || border < 0)
	// 		throw new RangeError("Value out of range");
	// 	const width: number = (qr.size + border * 2) * scale;
	// 	canvas.width = width;
	// 	canvas.height = width;
	// 	let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	// 	for (let y = -border; y < qr.size + border; y++) {
	// 		for (let x = -border; x < qr.size + border; x++) {
	// 			ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
	// 			ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
	// 		}
	// 	}
	// }
	
	
	// Returns a string of SVG code for an image depicting the given QR Code, with the given number
	// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
	function toSvgString(qr, border, lightColor, darkColor) {
		if (border < 0)
			throw new RangeError("Border must be non-negative");
		let parts = [];
		for (let y = 0; y < qr.size; y++) {
			for (let x = 0; x < qr.size; x++) {
				if (qr.getModule(x, y))
					parts.push(`M${x + border},${y + border}h1v1h-1z`);
			}
		}
		return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="${lightColor}"/>
	<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
	}

