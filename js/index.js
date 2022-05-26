var username = getCookie('username');
var userText

function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "login.html";
	}
}

checkCookie();

window.onload = pageLoad;
function pageLoad(){
    userText = document.getElementById("user")

    setUsername()
	startup()
}

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function setUsername(){
    if(username == null){
        userText.innerHTML = "Guest";
    }else{
        userText.innerHTML = "Welcome back "+username+" !";
    }
}
window.addEventListener( "pageshow", function ( event ) {
	var historyTraversal = event.persisted || 
						   ( typeof window.performance != "undefined" && 
								window.performance.navigation.type === 2 );
	if ( historyTraversal ) {
	  // Handle page restore.
	  window.location.reload();
	}
  });
function myFunction()
{
	const haveTransition = ["flexSpace","transition"];
	for(i=0;i<haveTransition.length;i++)
	{
		let element = document.getElementById(haveTransition[i]);
		console.log(element.classList);
		element.classList.add('out'); // start animation
		console.log(element.classList);
	}

}
function startup()
{
	content = document.getElementsByClassName("border")[0];
	kbButtons = content.getElementsByTagName("button");
	for(i=0;i<kbButtons.length;i++)
	{
		console.log(kbButtons[i]);
		kbButtons[i].addEventListener("click", myFunction);
	}


}
