import { QrCode, Ecc } from "./qrcodegen.js";

function randRange(maximum, minimum = 0) {
   return Math.round(Math.random() * maximum) + minimum;
}

// Utility functions
function RGBtoHex(r, g, b) {
   return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

function randRGB() {
   return RGBtoHex(randRange(255), randRange(255), randRange(255));
}


// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
export function toSvgString(text, border, lightColor, darkColor) {
   const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	if (border < 0) throw new RangeError("Border must be non-negative");
	const parts = [];
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

// Returns a string of SVG code for an image depicting the given QR Code, with adorable rainbow dots
export function toSvgStringCircle(text, border, lightColor) {
   const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	if (border < 0) throw new RangeError("Border must be non-negative");
	const parts = [];
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y))
				parts.push(`<ellipse style="fill: ${randRGB()}" cx=${x + border} cy=${y + border} rx="0.5px" ry="0.5px" />`);
		}
	}
   return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="${lightColor}"/>
	${parts.join("")}
</svg>
`;
}

// Draws the given QR Code, with the given module scale and border modules, onto the given HTML
// canvas element. The canvas's width and height is resized to (qr.size + border * 2) * scale.
// The drawn image is purely dark and light, and fully opaque.
// The scale must be a positive integer and the border must be a non-negative integer.
export function drawCanvas(text, scale, border, lightColor, darkColor, canvas) {
   const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	if (scale <= 0 || border < 0)
		throw new RangeError("Value out of range");
	const width = (qr.size + border * 2) * scale;
	canvas.width = width;
	canvas.height = width;
	const ctx = canvas.getContext("2d");
	for (let y = -border; y < qr.size + border; y++) {
		for (let x = -border; x < qr.size + border; x++) {
			ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
			ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
		}
	}
}