const main = document.querySelector("main")
document.getElementsByTagName ( "main" )[0]
    .addEventListener ( "new-pocket", showCurrentPocket )

function showCurrentPocket ( event ) {
  console.log ( event.type, event.pocketData )
}

main.regBtn = document.getElementById('registParagraph')
main.signInBtn = document.getElementById("sign-inBtn")
main.showPocket = document.getElementsByClassName("Show-pocket")[0]
main.showPocket.onclick = function (event) {
  main.appendChild(document.createElement("new-pocket-element"))
}

//Delete Sigh In and Register buttons
main.delRegSignInBtn = function() {
      main.regBtn.remove(),
      main.signInBtn.remove()
}
// added  registration
main.regBtn.onclick = function(event) {
  // main.delRegSignInBtn();
  main.regpage = main.appendChild(document.createElement("register-page"));
  main.regpage.setAttribute("markup", "chanks/regist.html");
  main.regpage.setAttribute("css", "chanks/regist.css"); 
};
  // Sign - In  
main.signInBtn.onclick = function (event) {
  main.signInParent = main.appendChild(document.createElement("signin-page"));
  main.signInParent.setAttribute("markup","chanks/signIn.html");
  main.signInParent.setAttribute("css","chanks/signIn.css");
};

let ava = document.getElementById('avatarka'); 

//     add new-entries-element    
main.newEntriesBTN = document.getElementsByClassName("newEntries")[0]
main.newEntriesBTN.onclick =function(event) {
  main.appendChild(document.createElement('new-entries-element'))
}.bind(this)


//add NewArrival
main.newArrivalBtn = document.getElementsByClassName("btn NewArrival")[0]
main.newArrivalBtn.onclick = function(event){
  main.appendChild(document.createElement("new-arrival"))
}.bind(this)
//  delete new-entries-element 
document.body.addEventListener( "deleteEntries", removeEntriesElement )
  
function removeEntriesElement(event){
  document.getElementsByTagName("new-entries-element")[0].remove()    
}

// delete register element 
document.body.addEventListener( "deleteRegist", removeRegistElement )

function removeRegistElement(event){
  document.getElementsByTagName("register-page")[0].remove()    
}

//   delete signIn element 
document.body.addEventListener( "deleteSignIn", removeSignElementElement )

function removeSignElementElement(event){
  document.getElementsByTagName("signin-page")[0].remove()    
}

//   delete newPocket element 
document.body.addEventListener( "deleteNewPocketComponent", deleteNewPocketComponent )

function deleteNewPocketComponent(event){
  document.getElementsByTagName("new-pocket-element")[0].remove()    
}

//   delete newArrival element 
document.body.addEventListener( "deleteArrivalElem", deleteArrivalElem )

function deleteArrivalElem(event){
  document.getElementsByTagName("new-arrival")[0].remove()    
}

main.userEmail = document.cookie.split('; ')
    .filter(item => item.indexOf("userEmail") === 0)[0].split('=')[1]
main.userHash = document.cookie.split('; ').filter(item => item.indexOf("hash") === 0)[0].split('=')[1]  
main.userEmail
  ? fetch(`https://fea13-andrew.glitch.me/owner`)
    .then(response => response.json())
    .then(response => {currentUser = response
        main.hashValid = main.userHash === currentUser.passHash
        main.emailValid = main.userEmail === currentUser.email
        main.hashValid && main.emailValid === true ? main.InputSelection()    
          : console.log("Fail")
    })
    .then(() => ava.src = currentUser.avatar)
  : null;
main.InputSelection = function(){
            main.delRegSignInBtn()
            ava.src = currentUser.avatar
            document.getElementsByClassName('first')[0].appendChild(document.createElement("p")).textContent = currentUser.name
}
