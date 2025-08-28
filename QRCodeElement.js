import { toSvgString } from "./QRCode.js";

class QRCodeElement extends HTMLElement {
   shadow;

   static get observedAttributes() {
      return ["data-url", "data-foreground", "data-background", "width", "height"];
   }

   constructor() {
      super();
      this.shadow = this.attachShadow({mode: "open"});
   }

   render() {
      console.log("rendering!");
      const foreground = this.getAttribute("data-foreground");
      const background = this.getAttribute("data-background");
      const border = this.getAttribute("data-border");
      const url = this.getAttribute("data-url");

      const heightStr = this.getAttribute("height");
      const widthStr = this.getAttribute("width");

      const cssSizing = heightStr || widthStr ? `<style>:host {height: ${heightStr ? heightStr : widthStr}; width: ${widthStr ? widthStr : heightStr}}</style>` : "";

      if (!url) {this.hidden = true; return;} else {this.toggleAttribute("hidden", false)}

      const svg = toSvgString(url, border ? border : 0, foreground ? foreground : undefined, background ? background : undefined);

      console.log(svg);

      this.shadow.innerHTML = `${cssSizing}${svg}`;
   }

   connectedCallback() {
      this.render()
   }

   /**
    * 
    * @param {string} name attribute name
    * @param {string} oldValue old attribute value
    * @param {string} newValue new attribute value
    */
   attributeChangedCallback(name, oldValue, newValue) {
      console.log("attributechanged");
      if (name === "data-url") {
         console.log(`QR code changed: ${oldValue} -> ${newValue}`);
      }
      
      this.render()
   }
}

customElements.define("qr-code", QRCodeElement, {})