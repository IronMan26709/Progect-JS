  // // const h1 = document.getElementById("h1")
// // const main = document.getElementById("main")

// // main.onclick = function (ev) {
// //   const messages = ["hello", "goodbuy", "fuck off"]
// //   const event = new Event ("i-am-clicked")
// //   event.param = messages[Math.round(Math.random() * (messages.length-1))]
// //   h1.dispatchEvent(event)
// // }

// // h1.addEventListener("i-am-clicked", funkciya)

// // function funkciya (event){
// //   console.log("event")
// //   this.innerText = event.param
// // }

// // var croko = "https://bipbap.ru/wp-content/uploads/2017/10/0_8eb56_842bba74_XL-640x400.jpg"


// class BaseLogic extends HTMLElement  {
//   constructor () {
//     super()
//     var template = `
//     <div> </div>
//     <img src='${this.getAttribute("croko")}' width="250">
//     <h1>Hello</h1>
//     `
//     this.innerHTML = template

//   }
//   static get observedAttributes() {
//     return ["croko"]
//   }
//   attributeChangedCallback(attrname, oldval, newval) {
//     // здесь должна быть валидация (что передали)
//     this.querySelector("img").src = newval
//   }
// }

// customElements.define ( 'base-logic', BaseLogic )

// const images = ["https://st1.stranamam.ru/data/cache/2018apr/23/49/24122007_93951-700x500.jpg",
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56TQ7AmFuIV7pxI1b9q0dfkQZ5nH89TEYbXnTMuz5460dad7F",
//           "https://www.meme-arsenal.com/memes/599c8add003ad8d5373d2039cbe175b5.jpg"
//               ]

//               const collection = document.getElementsByTagName("base-logic")
//     for (let item of [1,2,3,4,5,6,7,8,9,10]) {
// setTimeout( () => {

//   collection[0].setAttribute("croko",  images[Math.round(Math.random()* (images.length-1))])
// }, 1000 * item)
//     }
// страница регистрации

// class Regpage extends HTMLElement {
//   constructor() {
//       super ()
//       let regpage = document.createElement ( 'div' )
//       regpage.className = "regpage"


//       let style = document.createElement ( 'style' )
//       style.textContent = `

//       `
//       this.shadow = this.attachShadow ( { mode: 'open' } )
//       this.shadow.appendChild ( style )
//       this.shadow.appendChild ( regpage )
//   }

// }

// customElements.define ( 'register-page', Regpage )
// let registerpage = document.createElement ( 'register-page' )

// function regpage(event){

//   document.getElementsByTagName("main")[0].innerHTML=""
//   document.getElementsByTagName("main")[0].appendChild ( registerpage )
//   location.hash = "regpage"

// }
// regpage()
// class Universalelement extends HTMLElement {
//   constructor() {
//     super()
//     this.attachShadow
//   }
// }



class RegisterPage extends HTMLElement {
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

  getElems() {
    this.userName = this.shadow.querySelector("#name")
    this.userEmail = this.shadow.querySelector("#input-email")
    this.userPhone = this.shadow.querySelector("#phone")
    this.userPassword = this.shadow.querySelector("#input-password")
    this.userPasswordRepeat = this.shadow.querySelector("#input-passwordRepeat")
    this.userPhoto = this.shadow.querySelector("#avatarka")
    this.btn = this.shadow.querySelector("#register-button")
    this.preview = this.shadow.querySelector("#preview") 
    // this.userPhoto.disabled = true
    // this.userPasswordRepeat.disabled = true
    // this.userPassword.disabled = true
    // this.userPhone.disabled = true
    this.userPassword.onchange = function (event) {
        document.cookie = `hash=${Sha256.hash(this.value)}`
      }
    this.userName.onchange = function (event) {
                event.target.valid = event.target.value.length >= 2
                console.log( event.target.valid)
               event.target.valid ? this.style.background = "#c7f5ac" : this.style.background = red
               if(event.target.valid) {
                this.userEmail.disabled = false
                this.userPhone.disabled = false
               }
               else {
                this.userEmail.disabled = true
                this.userPhone.disabled = true
               }
            }.bind(this)
    this.shadow.querySelector('input[type="file"]').onchange = function (event) {
      let file = event.target.files[0]
      file.type.indexOf("image") === 0 ? this.preview.src = URL.createObjectURL(file) :
        console.error("NOT IMAGE!!!!!");   
    }.bind(this);

    this.btn.onclick = function (event) {
       this.remove();
      fetch("https://fea13-andrew.glitch.me/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.userName.value,
          email: this.userEmail.value,
          phone: this.userPhone.value,
          avatar: this.preview.src,
          passHash: Sha256.hash(this.userPassword.value)

        })
      })
        .then(response => response.json())
          .then(response => {
           let currentUserResponse = response  
            document.cookie = `userEmail=${currentUserResponse.email};
            pass=${currentUserResponse.passHash}`;
            document.body.querySelector("#avatarka").src = currentUserResponse.avatar;
            let first = document.getElementsByClassName('first')[0];     
            first.appendChild(document.createElement("p")).textContent = currentUserResponse.name;
          })
    }.bind(this);   
  }    
}



customElements.define("register-page", RegisterPage)


