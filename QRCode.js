class QRCodeElement extends HTMLElement {
	shadow;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "closed" });
	}

	renderQR(text, border, bgColor, fgColor) {
		if (border < 0) {
			throw new RangeError("Border must be non-negative");
		}
		const qr = QRC.encodeText(text, QRC.Ecc.MEDIUM);
		let parts = [];
		for (let y = 0; y < qr.size; y++) {
			for (let x = 0; x < qr.size; x++) {
				if (qr.getModule(x, y))
					parts.push(`M${x + border},${y + border}h1v1h-1z`);
			}
		}
		this.shadow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="${bgColor}"/>
	<path d="${parts.join(" ")}" fill="${fgColor}"/>
</svg>`;
	}
}

customElements.define("qr-code", QRCodeElement, {});
