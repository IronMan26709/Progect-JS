

class NewPocket extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow ( { mode: "closed" } )
    this.shadow.innerHTML = `
      <link rel="stylesheet" href="/new-pocket.css">
      <form id="new-pocket-form">
        <span>Pocket name: </span>
        <input name="pocket-name" id="pocket-name" placeholder="Enter the name of your pocket">
        <section>
          <h3>Выберите связанные кошельки и установите квоты:</h3>
          <figure id="selection-area"></section>
        </section>
        <section id="total-area"></section>
        <input type="hidden" 
               value="https://dmeszqrvxc7wa.cloudfront.net/images/product/new/medium/AC696001.T.jpg" 
               name="pocket-photo" 
               id="pocket-photo">
        <img src="https://dmeszqrvxc7wa.cloudfront.net/images/product/new/medium/AC696001.T.jpg" 
             id="pocket-photo-preview" 
             width="80">
        <input type="file">
      </form>
      <button id="register-button">new Pocket</button>
    `
    this.pocketsMenu = []
    this.pocketsMenu.selected = []
    Object.defineProperty ( this, "total", {
      get () {
        let pocketsMenu = this.pocketsMenu
        return this.pocketsMenu.selected.reduce (
          ( accumulator, item ) => accumulator + Number( item.quota ),
          0
        )
      },
      set ( newVal ) {
        
      }
    })
    this.setHandlers()
  }
  connectedCallback () {
    
  }
  async getAllPockets() {
      let pockets = await ( await fetch ( "https://fea13-andrew.glitch.me/pockets" ) ).json()
      pockets.forEach (
          pocket => {
              let elem = document.createElement ( "div" )
              let input = elem.appendChild ( document.createElement ( "input" ) )
              let label = elem.appendChild ( document.createElement ( "label" ) )
              label.innerText = pocket["pocket-name"]
              
              input.type = "checkbox"
              input.name = "pockets"
              input.value = pocket.id
              input.title = pocket["pocket-name"]
              
              input.quota = elem.appendChild ( document.createElement ( "input" ) )
              input.quota.type = "number"
              input.quota.style.display = "none"
              input.quota.id = pocket.id
              input.quota.onchange = function ( event ) {
                  this.pocketsMenu.selected.push ( { id: event.target.id, quota: event.target.value } )
                  this.pocketsMenu.selected [ this.pocketsMenu.selected.length - 1 ].checked = Boolean ( event.target.value )
                  this.totalArea.innerText = this.total + "%"
              }.bind ( this )
              
              input.onclick = function ( event ) {
                  event.target.quota.style.display = event.target.checked ? "inline-block" : "none"
              }
              
              this.pocketsMenu.push ( elem )
          }
      )
  }
  async setHandlers () {
    this.selectionArea = this.shadow.querySelector ( "#selection-area" )
    this.totalArea = this.shadow.querySelector ( "#total-area" )
    
    await this.getAllPockets()
    this.pocketsMenu.forEach ( item => this.selectionArea.appendChild ( item ) )
    this.selectionArea.style.display = this.selectionArea.children ? "block" : "none"
    
    this.shadow.querySelector( "button" )
        .onclick = this.registerPocket.bind(this)
    this.shadow.querySelector( "input[type='file']" )
        .onchange = function ( event ) {
            
            let photo = event.target.files[0]
            if ( photo.type.indexOf ( "image" ) !== 0 ) return
            
            const reader = new FileReader
            reader.onload = function( event ) {
              this.shadow.querySelector ("#pocket-photo-preview").src = event.target.result
              this.shadow.querySelector ("#pocket-photo").value = event.target.result
            }.bind( this )
      
            reader.readAsDataURL( photo )
            
        }.bind( this )
  } 
  
  registerPocket() {

      let formData = new FormData( this.shadow.querySelector ( "#new-pocket-form" ) )
      formData.set (
          "dependentPockets",
          JSON.stringify (
            Object.assign (
              {},
              ...this.pocketsMenu.selected
                .map( item => Object.assign ({}, { [item.id]: item.quota }) )
            )    
          )
      )
      let result = {}
      formData.forEach (
        ( val, key ) => Object.assign ( result, { [key]: val } )
      )
      fetch("https://fea13-andrew.glitch.me/pockets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify ( result )
      }).then ( response => response.json() )
        .then ( response => {
          const event = new Event ( "new-pocket" )
          event.pocketData = response
          this.parentNode.dispatchEvent ( event )
        } )

      this.style.display = "none"
  }
}

customElements.define ("new-pocket-element", NewPocket)