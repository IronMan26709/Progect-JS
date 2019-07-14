const main = document.querySelector("main")


document.getElementsByTagName ( "main" )[0]
    .addEventListener ( "new-pocket", showCurrentPocket )

function showCurrentPocket ( event ) {
  console.log ( event.type, event.pocketData )
}
///////////////////////////////////////   Delete Sigh In and Register buttons    /////////////////////////////////
main.regBtn = document.getElementById('registParagraph')
main.signInBtn = document.getElementById("sign-inBtn")
main.showPocket = document.getElementById("Show-pocket")
main.showPocket.onclick = function (event) {
  main.appendChild(document.createElement("new-pocket-element"))
}
main. delRegSignInBtn = function() {
      main.regBtn.remove(),
      main.signInBtn.remove()
}
///////////////////////////////////////////////      added  registration       ////////////////////////////////////

main.regBtn.onclick = function(event) {
  main.delRegSignInBtn();
  main.regpage = main.appendChild(document.createElement("register-page"));
  main.regpage.setAttribute("markup", "../chanks/regist.html");
  main.regpage.setAttribute("css", "../chanks/regist.css"); 
};
////////////////////////////////////////////         Sign - In    ///////////////////////////////////////////////
main.signInBtn.onclick = function (event) {
  main.delRegSignInBtn();
  main.signInParent = main.appendChild(document.createElement("signin-page"));
  main.signInParent.setAttribute("markup","../chanks/signIn.html");
  main.signInParent.setAttribute("css","../chanks/signIn.css");
};
///////////////////////////////////////////////////////////////////////
let ava = document.getElementById('avatarka'); 
// let userName = document.cookie.split('; ')
//     .filter(item => item.indexOf('userName') === 0)[0].split('=')[1];
// // let currentUser = null;
let userEmail = document.cookie.split('; ')
    .filter(item => item.indexOf("userEmail") === 0)[0].split('=')[1]
    console.log(userEmail)
let userHash = document.cookie.split('; ').filter(item => item.indexOf("hash") === 0)[0].split('=')[1]
console.log(userHash)   
userEmail
  ? fetch(`https://fea13-andrew.glitch.me/owner`)
    .then(response => response.json())
    .then(response => {currentUser = response
        let hashValid = userHash === currentUser.passHash
        let emailValid = userEmail === currentUser.email
        console.log(currentUser.name)
        hashValid && emailValid === true ?
         document.getElementsByClassName('first')[0].appendChild(document.createElement("p")).textContent = currentUser.name
          : console.log("Fail")
    })
    .then(() => ava.src = currentUser.avatar)
  : null;
