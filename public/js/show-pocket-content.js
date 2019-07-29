class ShowPocket extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
    }
    connectedCallback() {

    }
    static get observedAttributes() {
        return ["pocket-id"]
    }
    attributeChangedCallback(attrName,oldVal,newVal) {
        this.showPocket(newVal)
    }
    async showPocket(pocketId) {
        
        let pocketName = (await (await fetch(`https://fea13-andrew.glitch.me/pockets/${pocketId}`)).json()).name
        let entries = await (await fetch("https://fea13-andrew.glitch.me/entries")).json()
        entries = entries.filter(item => item.pocket_id === pocketId)
        entries.forEach(function (entry) {
            this.shadow.innerHTML += `
            <link rel="stylesheet" href="js/../chanks/pocket-info.css">
            <div class='componentWrap' id="componentWrap">
                <header></header>
                <div class="content" id="content">
                    <h3>${pocketName}</h3>
                    <div class='infoBlock'>
                       <h5>${entry.data}</h5>
                       <h2>${entry.currency}</h2>
                       <h6>${entry["custumer-choise"]}</h6>
                    </div>     
                </div>
            </div>
       `
        }, this)
    }
}

customElements.define("pocket-info",ShowPocket)