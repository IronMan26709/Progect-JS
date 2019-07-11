const main = document.querySelector("main")
///////////////////////////////////////   Delete Sigh In and Register buttons    /////////////////////////////////
main.regBtn = document.getElementById('registParagraph');
main.signInBtn = document.getElementById("sign-inBtn")




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
let userId = document.cookie.split('; ')
    .filter(item => item.indexOf('userId') === 0)[0].split('=')[1];

let currentUser = null;

userId
  ? fetch(`https://curasa.glitch.me/users/${userId}`)
    .then(response => response.json())
    .then(user => currentUser = user)
    .then(() => ava.src = currentUser.avatar)
  : null;
