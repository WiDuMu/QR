import { Ecc, QrCode } from "./qrcodegen.js";

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

const svgHeader = width => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${width} ${width}" stroke="none">`;

function toPixelGrid(text, border, ecc = Ecc.MEDIUM) {
	const qr = QrCode.encodeText(text, ecc);
	return qr.modules;
}

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
export function toSvgString(text, border, lightColor = "#FFFFFF", darkColor = "#000000") {
   const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	if (border < 0) throw new RangeError("Border must be non-negative");
	const parts = [];
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y))
				parts.push(`M${x + border},${y + border}h1v1h-1z`);
		}
	}
	return `${svgHeader(qr.size + border * 2)}
	<rect width="100%" height="100%" fill="${lightColor}"/>
	<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
}

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The squares are rainbow
export function toSvgStringRainbow(text, border, lightColor, darkColor) {
   const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	if (border < 0) throw new RangeError("Border must be non-negative");
	const parts = [];
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y))
				parts.push(`<rect style="fill: ${randRGB()}" x=${x + border} y=${y + border} width="1" height="1"></rect>`);
		}
	}
	return `${svgHeader(qr.size + border * 2)}
	<rect width="100%" height="100%" fill="${lightColor}"/>
	${parts.join(" ")}
	
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
				parts.push(`<ellipse style="fill: ${randRGB()}" cx=${x + border} cy=${y + border} rx="0.5px" ry="0.5px"/>`);
		}
	}
   return `${svgHeader(qr.size + border * 2)}
	<rect width="100%" height="100%" fill="${lightColor}"/>
	${parts.join("")}
</svg>
`;
}

/**
 * Creates a PNG image by to export
 * @param {string} text 
 * @param {number} scale 
 * @param {number} border 
 * @param {string} lightColor 
 * @param {string} darkColor 
 * @param {"image/png" | "image/jpeg" | "image/webp"} imageType Only image/png is fully supported
 * @returns {Promise<Blob>} A blob representing the generated image
 */
export async function createImage(text, scale, border, lightColor, darkColor, imageType = "image/png") {
	if (!OffscreenCanvas) {
		throw new Error("Offscreencanvas not supported! Exiting.")
	}
	const canvas = new OffscreenCanvas(dimensions, dimensions);
	drawCanvas(canvas, text, scale, border, lightColor, darkColor);
	return await canvas.convertToBlob({ type: imageType });
}

/**
 * Creates a PNG image by to export
 * @param {string} text 
 * @param {number} scale 
 * @param {number} border 
 * @param {string} lightColor 
 * @param {string} darkColor 
 * @param {"image/png" | "image/jpeg" | "image/webp"} imageType Only image/png is fully supported
 * @returns {Promise<Blob>} A blob representing the generated image
 */
export async function createImageRainbowDots(text, scale, border, lightColor, darkColor, imageType = "image/png") {
	if (!OffscreenCanvas) {
		throw new Error("Offscreencanvas not supported! Exiting.")
	}
	const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	const dimensions = (qr.size + (border * 2)) * scale;
	const canvas = new OffscreenCanvas(dimensions, dimensions);
	drawCanvasRainbowDots(canvas, text, scale, border, lightColor, darkColor);
	return await canvas.convertToBlob({ type: imageType });
}


/**
 * Draws a QR code onto the canvas of choice
 * @param {HTMLCanvasElement | OffscreenCanvas} canvas 
 * @param {string} text 
 * @param {number} scale 
 * @param {number} border 
 * @param {string} lightColor 
 * @param {string} darkColor 
 */
export function drawCanvas(canvas, text, scale = 10, border = 2, lightColor = "#FFFFFF", darkColor = "#000000") {
	if (scale < 1 || border < 0) {
		throw new RangeError("Invalid border or scale!");
	}
	const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	const dimensions = (qr.size + (border * 2)) * scale;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Unable to obtain canvas context. Exiting.")
	}
	ctx.fillStyle = lightColor;
	ctx.fillRect(0,0,dimensions,dimensions);
	ctx.fillStyle = darkColor;
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y)) {
				ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
			}
		}
	}
}

/**
 * Draws a QR code onto the canvas of choice
 * @param {HTMLCanvasElement | OffscreenCanvas} canvas 
 * @param {string} text 
 * @param {number} scale 
 * @param {number} border 
 * @param {string} lightColor 
 * @param {string} darkColor 
 */
export function drawCanvasRainbowDots(canvas, text, scale = 10, border = 2, lightColor = "#FFFFFF", darkColor = "#000000") {
	if (scale < 1 || border < 0) {
		throw new RangeError("Invalid border or scale!");
	}
	const qr = QrCode.encodeText(text, Ecc.MEDIUM);
	const dimensions = (qr.size + (border * 2)) * scale;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Unable to obtain canvas context. Exiting.")
	}
	ctx.fillStyle = lightColor;
	ctx.fillRect(0,0,dimensions,dimensions);
	ctx.fillStyle = darkColor;
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y)) {
				const color = randRGB();
				ctx.fillStyle = color;
				ctx.strokeStyle = color;
				console.log(ctx.fillStyle);
				ctx.beginPath();
				ctx.ellipse((x + border) * scale, (y + border) * scale, scale / 2, scale / 2, 0, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
			}
		}
	}
}