class SignInUser extends HTMLElement {
	constructor () {
		super()
		this.shadow = this.attachShadow({mode : "closed"})
	}
	connectedCallback() {}
	static get abservedAttributes() {
		return ["markup2","css2"]
	}

	attributechangeCallback(attrName, oldVal, newVal){
		fetch(newVal).then(response => response.text())
      .then(response => {
        if (attrName === "markup2") {

        let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
          "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]

        this.shadow.innerHTML = response + `<style> ${styles} </style>`;

        }
        if (attrName === "css2") {
          let html = this.shadow.innerHTML.split("<style>")

          let end = html.length === 1 ? "" : html[1].split("</style>")[1]
          this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
        }
      })
      .then(() => this.getElems())
	}
}
customElements.define("sign-in-user",SignInUser)