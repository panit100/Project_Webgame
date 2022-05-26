window.onload = pageLoad;
function pageLoad(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	console.log("WebLoad");
	if (urlParams.get("error")==1){
		document.getElementById('errordisplay').innerHTML = "Username or password does not match.";
	}
	startup();
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
	const haveTransition = ["container","page","topic","transition"];
	for(i=0;i<haveTransition.length;i++)
	{
		let element = document.getElementById(haveTransition[i]);
		element.classList.remove('out'); // reset animation
		console.log(element.classList);
		element.classList.add('out'); // start animation
		console.log(element.classList);
	}

}
function startup()
{
	let myForm = document.getElementById("myform");
	myForm.addEventListener("submit", myFunction);
}

