// import './js/regist.js'
///////////////////////////////////////   Delete Sigh In and Register buttons    /////////////////////////////////
let delRegSignInBtn = function() {
       regBtn.remove(),
       signInBtn.remove()
}
///////////////////////////////////////////////      added  registration       ////////////////////////////////////
const regBtn = document.getElementById('registParagraph');
regBtn.onclick = function(event) {
  delRegSignInBtn();
  var regpage = document.getElementById("registrlog").appendChild(document.createElement("register-page"));
  regpage.setAttribute("markup", "./chanks/chank1.html");
  regpage.setAttribute("css", "./chanks/chank1.css"); 
}
;
////////////////////////////////////////////         Sign - In    ///////////////////////////////////////////////
const signInBtn = document.getElementById("sign-inBtn");
signInBtn.onclick =function(event){
  delRegSignInBtn();
  var signInParent = document.getElementById("signInWindw").appendChild(document.createElement("sign-in-user"));
  signInParent.setAttribute("markup2","./chanks/login.html");
  signInParent.setAttribute("css2","./chanks/login.css");
}
///////////////////////////////////////////////////////////////////////
let ava = document.getElementById('avatarka');
let userId = document.cookie.split('; ')
    .filter(item => item.indexOf('userId') === 0)[0].split('=')[1];

let currentUser = null;

userId
  ? fetch(`https://curasa.glitch.me/users/${userId}`)
    .then(response => response.json())
    .then(user => currentUser = user)
    .then(() => ava.src = currentUser.avatar)
  : null;
