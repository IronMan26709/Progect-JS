class NewArrival extends HTMLElement {
	constructor() {
		super()
		this.shadow  = this.attachShadow({ mode:  "closed" })
		this.shadow.innerHTML = `
    		<link rel="stylesheet" href="js/../chanks/newArrival.css">
			<div class = "componentWrap">
	            <header>
	                <h1>Новое поступление</h1>
	                <img class ="closing" src ="png/times-solid.svg" width="30" height="30">
	            </header>
	            <div class ="wrapcontent"> 
	            	<form>
		            	<div class="arrivalWrap">
		            		<input id="arrival" name="arrival" class="arrival" type="number" placeholder="Сумма поступления, грн">
		            	</div>
		            	<div class="descriptionWrap">
		            		<input id="description" name="arrival" class="description" type="text" placeholder="Описание">
		            	</div>
		            	<div class ="pocketsSelection">
                       		<figure id ="selection-area" class ="selection-area"> 
                      	 	</figure>
                    	</div>	
				    </form>
				    <div class="ErrorMessage"></div>
				    <button class="register-button"id="register-button">new Pocket</button>
	            </div>
            </div>
		`

		this.addCash
        this.getAllPockets()
		this.closing = this.shadow.querySelector(".closing")
		this.addCashBtn = this.shadow.querySelector(".register-button")
		this.ErrorMessage = this.shadow.querySelector(".ErrorMessage")
		this.arrival = this.shadow.querySelector(".arrival")
        this.closing.onclick = function(event){
             document.body.dispatchEvent(new Event("deleteArrivalElem"))
        }.bind(this)
        
	}

	connectedCallback(){

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

        this.shadow.querySelector("button").onclick = this.registerEntry
        this.cashValid ? this.shadow.disabled = false : this.shadow.disabled = true
       
        this.pocket = this.shadow.querySelector(".pocket")
        this.inpArrival = this.shadow.querySelector("#arrival")
    this.addCashBtn.onclick = function (event){
    		let pocket = this.pocket
			
				
	        

        	fetch ( `https://fea13-andrew.glitch.me/pockets/${pocket.value}`, {
		    method: "PATCH",
		    headers: { 
				"Content-Type": "application/json"
			},
		    body: JSON.stringify ( { cash: 5000 } )
			})
			.then ( response => response.json())
				.then(response => console.log(response))
        } 
	}
}
customElements.define("new-arrival", NewArrival)