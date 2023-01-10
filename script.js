/*
//////////////////////////////
	INITIAL SETUP
//////////////////////////////
*/
radio_data = {};
radio_name = "Fungi Radio";
radio_current = [0, 0];
radio_shuffle = false;
radiolist_open = false;
const radiolist_albums = document.getElementsByClassName("radiolist_albums");

$.getJSON('radio.json', function(data) {
	//Code vomit
	radio_data = data;
	//console.log(radio_data.radiolist[1].length);
	var tag = document.createElement('script');
	document.getElementById("radiolist").style.display = "none";
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	var player;

	// Create radiolist
	radiolist_string = "";
	for (a = 0; a < radio_data.radiolist.length; a++) {
		for (b = 0; b < radio_data.radiolist[a].length; b++) {
			radiolist_string += `<img class="radiolist_albums" draggable="false" src="${radio_data.radiolist[a][b].album}" onclick="radiolist_select(${a},${b})">`;
		}
		if (a < radio_data.radiolist.length - 1) {
			radiolist_string += `<hr>`
		}
	}

	document.getElementById("radiolist").innerHTML = radiolist_string;
});

function onYouTubeIframeAPIReady() {

	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'pp',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});

}

function onPlayerReady(event) {
	switch_radio(0, 0);
	//event.target.playVideo();
}

/*
//////////////////////////////
	CONTROLS
//////////////////////////////
*/
function mute() {
	if (player.isMuted()) {
		player.unMute()
		document.getElementById("control_mute").innerHTML = "🔊";
	} else {
		player.mute()
		document.getElementById("control_mute").innerHTML = "🔇";
	}

}

function pause() {
	if (player.getPlayerState() == 2) {
		player.playVideo()
		document.getElementById("control_pause").innerHTML = "⏸";
	} else {
		player.pauseVideo()
		document.getElementById("control_pause").innerHTML = "▶";
	}

}

function skip() {
	player.nextVideo();
}

function switch_radio(qw, qwer) {
	document.getElementById('status').innerHTML = "Loading...";
	player.stopVideo();
	radio_id = radio_data.radiolist[qw][qwer].id;
	document.getElementById('album_art')
		.setAttribute("src", radio_data.radiolist[qw][qwer].album);
	radio_name = radio_data.radiolist[qw][qwer].name;

	radio_shuffle = false;
	//player.setShuffle(true);
	player.loadPlaylist({
		list: radio_id,
		listType: "playlist",
		index: 0,
		startSeconds: 0
	});
}

function keycontrols(event) {
	switch (event.key) {
		case "m":
			mute();
			break;
		case "k":
			pause();
			break;
		case " ":
			pause();
			break;
		case "l":
			skip();
			break;

	}
}


/*
//////////////////////////////
	DISPLAY
//////////////////////////////
*/
function onPlayerStateChange(event) {
	switch (event.data) {
		case -1:
			document.getElementById('status').innerHTML = "Switching Song...";
			break;
		case 3:
			document.getElementById('status').innerHTML = "Switching Song...";
			break;
		case 1:
			;
			document.getElementById('status').innerHTML = "Now playing... " + document.getElementById('player').title + " - " + radio_name;
			if (!radio_shuffle) {
				player.setShuffle(true);
				radio_shuffle = true;
				player.playVideoAt(0);
			}
			break;
		case 2:
			document.getElementById('status').innerHTML = "Paused... " + radio_name;
			break;
	}
}

function radiolist_openup() {
	if (radiolist_open == "true") {
		return;
	}
	document.getElementById("album_art").style.animation = "album_fadeout 0.2s ease-in forwards";
	document.getElementById("body").style.animation = "bg_fadeout 0.5s ease-in forwards";
	setTimeout(radiolist_display, 200);
}

function radiolist_display() {
	radiolist_open = true;
	document.getElementById("album").style.display = "none";
	document.getElementById("radiolist").style.display = "block";
	for (i = 0; i < radiolist_albums.length; i++) {
		radiolist_albums[i].style.animation = "album_fadein 0.1s ease-in " + (i * 0.05) + "s forwards";
	}
}

function radiolist_select(section, id) {
	radiolist_open = false;
	for (i = 0; i < radiolist_albums.length; i++) {
		radiolist_albums[i].style.animation = "album_fadeout 0.2s ease-in forwards";
	}

	if (!((radio_current[0] == section) && (radio_current[1] == id))) {
		document.getElementById("body").style.backgroundImage = `url('${radio_data.radiolist[section][id].bg}')`;
		radio_current = [section, id];
		switch_radio(section, id);
	}
	setTimeout(album_display, 200);
}

function album_display() {
	document.getElementById("album").style.display = "flex";
	document.getElementById("radiolist").style.display = "none";
	document.getElementById("album_art").style.animation = "album_fadein 0.1s ease-in forwards";
	document.getElementById("body").style.animation = "bg_fadein 0.5s ease-in forwards";
	setTimeout(album_animate, 100);
}

function album_animate() {
	document.getElementById("album_art").style.animation = "albumanimation 4s alternate infinite ease-in-out"
}