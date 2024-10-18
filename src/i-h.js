import onI18n from "x/langSite.js"

customElements.define(
	"i-h",
	class extends HTMLElement {
		connectedCallback() {
			let me = this,
				func = _H[me.innerHTML]
			if (func.length) {
				this._ = onI18n(() => (me.innerHTML = func(_L)))
			} else {
				me.innerHTML = func()
			}
		}
		disconnectedCallback() {
			const { _ } = this
			_ && _()
		}
	},
)
