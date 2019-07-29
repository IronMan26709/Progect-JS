class NewPocket extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.shadow.innerHTML = `
        <link rel="stylesheet" href="chanks/new-pocket.css">
        <div class="component">
            <header>
                <h1>Правила распределения</h1>
                <img class ="closing" src ="png/times-solid.svg">
            </header>
            <div class="wrap">
                <form id="new-pocket-form" class="new-pocket-form">
                  <div class="rule">
                    <input name="pocket-name" id="pocket-name"  class="pocket-name"placeholder="Enter the name the rule">
                  </div>
                  <section>
                    <h3>Выберите связанные кошельки и установите квоты:</h3>
                    <figure id="selection-area"></section>
                  </section>
                  <section id="total-area"></section>
                  <input type="hidden" 
                         value="https://dmeszqrvxc7wa.cloudfront.net/images/product/new/medium/AC696001.T.jpg" 
                         name="pocket-photo" 
                         id="pocket-photo">
                 <div class="previewWrap">
                    <img src="https://dmeszqrvxc7wa.cloudfront.net/images/product/new/medium/AC696001.T.jpg"
                                                                id="pocket-photo-preview"class="preview">
                    <input type="file">
                  </div>
                </form>
                <button class="register-button"id="register-button">new Pocket</button>
            </div>
        </div>
        
      `         
        this.closing = this.shadow.querySelector(".closing")
        this.closing.onclick = function(event){
           document.body.dispatchEvent(new Event("deleteNewPocketComponent"))
        }.bind(this)

        this.pocketsMenu = []
        this.pocketsMenu.selected = []
        this.sum = this.shadow.querySelector("#selection-area")
     
        this.sum.onchange = function(event){
            let arrInputs = this.shadow.querySelectorAll(".quota")
            let summ = 0
            arrInputs.forEach( input => {
             if( input.value !== "") {
                  summ += Number(input.value)
             }
         })
            this.total = summ    
            this.totalValid = true
        }.bind(this)
        this.setHandlers()
    }

    connectedCallback() {
    
    }
    async getAllPockets() {
        let pockets = await (await fetch("https://fea13-andrew.glitch.me/pockets")).json()
        pockets.forEach(
            pocket => {
                let elem = document.createElement("div")
                let input = elem.appendChild(document.createElement("input"))
                let label = elem.appendChild(document.createElement("label"))
                label.innerText = pocket["pocket-name"]
                input.type = "checkbox"
                input.name = "pockets"
                input.value = pocket.id
                input.title = pocket["pocket-name"]
                input.className = 'check'
                input.quota = elem.appendChild(document.createElement("input"))
                input.quota.type = "number"
                input.quota.style.visibility = "hidden" 
                input.quota.className = "quota"
                input.quota.id = pocket.id
                input.onchange = function (event) {
                    if(this.total !== undefined ) {
                        this.totalArea.innerText = this.total + "%"
                        this.totalArea.style.color = "#f5f5f5"
                        this.totalValid = true
                    }   
                    if(this.total > 100) {
                        this.totalArea.innerText = "Более 100%"
                        this.totalArea.style.color = "red"
                        this.totalValid = false
                        input.quota.value = Number(0)
                    } 
                     if(this.total == 0)  {
                        this.totalArea.innerText = null
                        this.totalValid = false
                    }
                     if(this.total < 0) {
                        this.totalValid = false
                        this.totalArea.innerText =  "Не может быть отрицательным значением"
                        this.totalArea.style.color = "red"
                    }
                      
                }.bind(this)
                input.onclick = function (event) {
                    event.target.quota.style.visibility = event.target.checked ? "visible" : "hidden"
                    // event.target.quota.style.display = event.target.checked ? "block" : "none"
                }.bind(this)

                this.pocketsMenu.push(elem)
            }
        )
    }
    async setHandlers() {
        this.selectionArea = this.shadow.querySelector("#selection-area")
        this.totalArea = this.shadow.querySelector("#total-area")

        await this.getAllPockets()
        this.pocketsMenu.forEach(item => this.selectionArea.appendChild(item))
        this.selectionArea.style.display = this.selectionArea.children ? "block" : "none"

        this.shadow.querySelector("button")
            .onclick = this.registerPocket.bind(this)
        this.shadow.querySelector("input[type='file']")
            .onchange = function (event) {

                let photo = event.target.files[0]
                if (photo.type.indexOf("image") !== 0) return

                const reader = new FileReader
                reader.onload = function (event) {
                    this.shadow.querySelector("#pocket-photo-preview").src = event.target.result
                    this.shadow.querySelector("#pocket-photo").value = event.target.result
                }.bind(this)

                reader.readAsDataURL(photo)

            }.bind(this)
    }

    registerPocket() {
        let formData = new FormData(this.shadow.querySelector("#new-pocket-form"))
        this.pocketsMenu.selected.length ? formData.set(
            "dependentPockets",
            JSON.stringify(
                Object.assign(
                    {},
                    ...this.pocketsMenu.selected
                        .map(item => Object.assign({}, { [item.id]: item.quota }))
                )
            )
        ) : null
        let result = {}
        formData.forEach(
            (val, key) => Object.assign(result, { [key]: val })
        )
        fetch("https://fea13-andrew.glitch.me/pockets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        }).then(response => response.json())
            .then(response => {
                const event = new Event("new-pocket")
                event.pocketData = response
                this.parentNode.dispatchEvent(event)
            })

        this.style.display = "none"
    }
}
   

customElements.define(
    "new-pocket-element",
    NewPocket
)