
var username = getCookie('username');
var score = [];
var like = [];
var pname = [];
var topScore = [];
var userText;
var likeBtn = [];



function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "login.html";
	}
}

checkCookie()
window.onload = pageLoad;


function pageLoad(){
    loadScore();
	setLikeFunction();
	commentFunction();
	userText = document.getElementById("user")
    setUsername()
}

function setUsername(){
    if(username == null){
        userText.innerHTML = "Guest";
    }else{
        userText.innerHTML = "Welcome back "+username+" !";
    }
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

async function loadScore(){
    let response = await fetch("/readScoreDB");
	let userJson = await response.json();
	let sethighscore = await setHighScore(JSON.parse(userJson))
	let sethighscoreandlike = await setHighScoreAndLike(topScore)
}

function setHighScore(userData){
	topScore = [];
	var key = Object.keys(userData);
	for(var i = 1; i <= 5; i++){
		score[i-1] = document.getElementById("Score" + i);
		like[i-1] = document.getElementById("like" + i)
		pname[i-1] = document.getElementById("name" + i)

	}

	for(var i = 0; i < key.length; i++){
		var userScore = {username:userData[key[i]].username , score:userData[key[i]].getscore , like:userData[key[i]].getlike}
		if(topScore[0] == null){
			topScore[0] = userScore
		}else{
			var newTopScore = userScore
			var topScoreLength = topScore.length

			for(var j = 0; j <= topScoreLength; j++){
				if(j == topScoreLength){
					topScore.push(newTopScore)
				}

				if(newTopScore.score > topScore[j].score){
					var oldScore = topScore[j]
					topScore[j] = newTopScore
					newTopScore = oldScore
				}
			}
		}
	}

	
}

function setHighScoreAndLike(topScore){
	for(var n = 0; n < 5; n++){
		var user = topScore[n]
		like[n].innerHTML = "Like : " + topScore[n]["like"]
		score[n].innerHTML = user["score"]
		pname[n].innerHTML = user["username"];
	}
}


function setLikeFunction(){
	for(var i = 1; i <= 5; i++){
		likeBtn[i-1] = document.getElementById("like"+i)
	}

	likeBtn[0].addEventListener('click', () => {
		likeScore(topScore[0]);
	})
	likeBtn[1].addEventListener('click', () => {
		likeScore(topScore[1]);
	})
	likeBtn[2].addEventListener('click', () => {
		likeScore(topScore[2]);
	})
	likeBtn[3].addEventListener('click', () => {
		likeScore(topScore[3]);
	})
	likeBtn[4].addEventListener('click', () => {
		likeScore(topScore[4]);
	})
	
}




function likeScore(likeUser){
	likeUser["like"] += 1 
	writeLikeScore(likeUser)
	loadScore();
}

async function writeLikeScore(likeUser){
	let response = await fetch("/writeLikeScore",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user:likeUser["username"],
			like:likeUser["like"]})
		});
}

var commentBtn = [];
function commentFunction(){
	for(var i = 1; i <= 5; i++){
		commentBtn[i-1] = document.getElementById("Comment"+i)
	}

	commentBtn[0].addEventListener('click', () => {
		setCommentCookie(topScore[0]);
	})
	commentBtn[1].addEventListener('click', () => {
		setCommentCookie(topScore[1]);
	})
	commentBtn[2].addEventListener('click', () => {
		setCommentCookie(topScore[2]);
	})
	commentBtn[3].addEventListener('click', () => {
		setCommentCookie(topScore[3]);
	})
	commentBtn[4].addEventListener('click', () => {
		setCommentCookie(topScore[4]);
	})
}

async function setCommentCookie(user){
	let response = await fetch("/comment",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user:user["username"]})
		});
}









