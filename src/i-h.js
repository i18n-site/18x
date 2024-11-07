import onI18n from "x/langSite.js"

customElements.define(
	"i-h",
	class extends HTMLElement {
		connectedCallback() {
			const me = this,
				f = _H[me.dataset.h]
			if (f) {
				me._ = onI18n(() => (me.innerHTML = f(_L)))
			}
		}
		disconnectedCallback() {
			this._ && this._()
		}
	},
)
