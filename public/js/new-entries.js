class NewEntries extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })
        this.shadow.innerHTML = `
        <link rel="stylesheet" href="js/../chanks/new-entries.css">
        <section class = "componentWrap">
            <header>
                <h1>Записать расход</h1>
               <img class ="closing" src ="png/times-solid.svg" width="30" height="30">
            </header>
            <div class ="wrapForm"> 
                <form id="new-entry-form" class ="new-entry-form">
                    <section id="total-area">
                        <input name="custumer-choise" placeholder="Название расхода" type="text">
                        <input name="currency" placeholder="Стоимость" type="number">
                        <input name="coment" placeholder="ДН.М.Г." type="text">
                    </section>
                    <section class =" pocketsSelection">
                       <figure id ="selection-area" class ="selection-area"> 
                       </figure>
                    </section>
                    <input type="hidden" name="pocket_id" id="pocket_id">
                </form>
                <button id="KNOPKA">ЗАПИСАТЬ</button>
            </div>
        </section>
        `
        this.getAllPockets()  
          
        this.closing = this.shadow.querySelector(".closing")
        this.closing.onclick = function(event){
             document.body.dispatchEvent(new Event("deleteEntries"))
        }.bind(this)
    
        ////////////////////////////////////////     Валидация на остаток    //////////////////////////////////////////////

        this.expenseArea =this.shadow.querySelector("#new-entry-form")
        this.inpCurrency = this.shadow.querySelector("input[name=currency]")
        this.nameCurrency = this.shadow.querySelector("input[name=custumer-choise]")
        this.coment = this.shadow.querySelector("input[name=coment]")
        this.pockets = this.shadow.querySelector(".selection-area")
        this.pockets.onchange = function(event){
               this.nameCurrency.valid = this.nameCurrency.value.length > 0 
               this.inpCurrency.valid = this.inpCurrency.value > 0 ? true : false
               this.inputsValid = this.nameCurrency.valid && this.inpCurrency.valid === true 
               this.validationPockets()        

        }.bind(this)
    }

    connectedCallback() {

    }
    validationPockets(){
        let inpCurrencyValue = this.shadow.querySelector("input[name=currency]").value
        console.log(inpCurrencyValue)
        let selectPocketValueId = this.shadow.querySelector(".pocket").value
        let pockets
         fetch (`https://fea13-andrew.glitch.me/pockets/${selectPocketValueId}`)
            .then(response => response.json())
            .then(response =>{
                pockets = response
                this.pocketId = pockets.id
                this.shadow.querySelector("#pocket_id").value = this.pocketId
                console.log(this.shadow.querySelector("#pocket_id").value)
                this.cashValid = pockets.cash >=  inpCurrencyValue
        }) 
    }
    async getAllPockets() {
        this.selectionArea = this.shadow.querySelector("#selection-area")
        let pockets = await (await fetch("https://fea13-andrew.glitch.me/pockets")).json()
        pockets = pockets.filter(item => !item.dependentPockets)
        let wrap = this.selectionArea.appendChild(document.createElement("select"))
        pockets.forEach(function (item) {
            
            let elem = wrap.appendChild(document.createElement("option"))
            elem.innerText = item['pocket-name']
            elem.name = "croco"
            elem.value = item.id
            wrap.className = "pocket"
            elem.onchange = function (event) {
               this.shadow.querySelector("#pocket_id").value = event.target.value
            }.bind(this)
        }, this)

        this.shadow.querySelector("button").onclick = this.registerEntry.bind(this)
        this.cashValid ? this.shadow.disabled = false : this.shadow.disabled = true
    }

    async registerEntry() {
        let inpCurrency = this.shadow.querySelector("input[name = currency]")
        let formData = new FormData(this.shadow.querySelector("#new-entry-form"))
        formData.delete("croco")
        let result = {}
        formData.forEach(
            (val, key) => Object.assign(result, { [key]: val })
        )
        fetch("https://fea13-andrew.glitch.me/entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        }).then(response => response.json())
            .then(response => {
                const event = new Event("new-entry")
                event.entryData = response
                document.body.dispatchEvent(new Event("deleteEntries"))
            })
        // this.style.display ="none"
    }
}


customElements.define(
    "new-entries-element",
    NewEntries
)


