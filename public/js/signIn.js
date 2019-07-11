class SignInPage extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "closed" })

  }

  connectedCallback() {
  }
  static get observedAttributes() {
    return ["markup", "css"]
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    fetch(newVal).then(response => response.text())
      .then(response => {
        if (attrName === "markup") {

        let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
          "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]

        this.shadow.innerHTML = response + `<style> ${styles} </style>`;

        }
        if (attrName === "css") {
          let html = this.shadow.innerHTML.split("<style>")

          let end = html.length === 1 ? "" : html[1].split("</style>")[1]
          this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
        }
      })
      .then(() => this.getElems())
  }

  getElems() {}    
}

customElements.define("signin-page",SignInPage)