var username = getCookie('username');

// function checkCookie(){
// 	var username = "";
// 	if(getCookie("username")==false){
// 		window.location = "login.html";
// 	}
// }

// checkCookie()

window.onload = pageLoad;


function pageLoad(){
    document.getElementById('postbutton').onclick = getData;
    setHighScoreUsername();
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
function setHighScoreUsername(){
	var highscoreUsername = getCookie('highscore');

	document.getElementById("highscoreUsername").innerHTML = highscoreUsername;

	loadScore(highscoreUsername);
}

async function loadScore(user){
	let response = await fetch("/loadScoreComment",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user:user})
		});
		let responseJson = await response.json();
		let obj = JSON.parse(responseJson);
		document.getElementById("highscore").innerHTML = obj.getscore;
		
		showPost(obj)
}


function getData(){
    var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

async function readPost(){

	let response = await fetch("/readPost");
	let content = await response.json();
	let post = await showPost(JSON.parse(content));
}

async function writePost(msg){
	var highscoreUsername = getCookie('highscore');
	let response = await fetch("/writePost",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			highscoreUser:highscoreUsername,
			message:msg})
	});
	window.location = "comment.html";
}

function showPost(data){
	var postData = JSON.parse(data.comment)
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = postData.length-1; i >=0 ; i--) {
		var temp = document.createElement("div");
		temp.className = "newsfeed";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = postData[i];
		temp.appendChild(temp1);
	}
}
