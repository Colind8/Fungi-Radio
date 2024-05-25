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

$.getJSON('/radio/2k/radiolist.json', function(data) {
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
			radiolist_string += `<img class="radiolist_albums" draggable="false" src="${radio_data.radiolist[a][b].album}" onclick="radiolist_select(${a},${b})" title="${radio_data.radiolist[a][b].name}">`;
		}
		if (a < radio_data.radiolist.length - 1) {
			radiolist_string += `<hr>`
		}
	}
	radiolist_string += `<p>This is a special instance of Fungi Radio that includes over 2000 songs! Also includes Fungames Radio with over 1000 songs!</p>`
	radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`

	document.getElementById("radiolist").innerHTML = radiolist_string;
});

function onYouTubeIframeAPIReady() {

	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'pp',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onError
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
		volume_icon_change(player.getVolume(),0)
	} else {
		player.mute()
		volume_icon_change(player.getVolume(),1)
	}

}

function volume_change(num) {
	current_volume = player.getVolume();
	
	if ((current_volume + num) > 100) {
		player.setVolume(100);
		document.getElementById("volume_status").innerHTML = `100%`;
	} else if ((current_volume + num) < 0) {
		player.setVolume(0);
		
		document.getElementById("volume_status").innerHTML = `0%`;
	} else {
		player.setVolume(current_volume + num);
		document.getElementById("volume_status").innerHTML = `${current_volume + num}%`;
	}
	volume_icon_change(current_volume + num)
}

function volume_icon_change(vol,muted) {
	current_volume = vol;
	if (muted == 1) {
		return document.getElementById("control_mute").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/volume_mute.svg">`;
	} else if (current_volume >= 75) {
		return document.getElementById("control_mute").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/volume_hi.svg">`;
	} else if (current_volume >= 25) {
		return document.getElementById("control_mute").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/volume_med.svg">`;
	} else if (current_volume >= 5) {
		return document.getElementById("control_mute").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/volume_low.svg">`;
	} else {
		return document.getElementById("control_mute").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/volume.svg">`;
	}
}

function pause() {
	if (player.getPlayerState() == 2) {
		player.playVideo()
		document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/pause.svg">`;
	} else {
		player.pauseVideo()
		document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/play.svg">`;
	}

}

function skip() {
	//console.log(`Skipping`);
	load_next_song();
}

function onError(event) {
	skip();
	//console.log(`ERROR: ${event.data}`);
}

function switch_radio(qw, qwer) {
	document.getElementById('status').innerHTML = "Loading [1/5]...";
	player.stopVideo();
	radio_id = radio_data.radiolist[qw][qwer].file;
	document.getElementById('album_art')
		.setAttribute("src", radio_data.radiolist[qw][qwer].album);
	radio_name = radio_data.radiolist[qw][qwer].name;

	radio_shuffle = false;
	document.getElementById('status').innerHTML = "Loading [2/5]...";
	//player.setShuffle(true);
	/*
	player.loadPlaylist({
		list: radio_id,
		listType: "playlist",
		index: 0,
		startSeconds: 0
	});*/
	reshuffle();
}

function start_radio() {
	//console.log(`Playing: ${radio_array[radio_array.length - 1]}`)
	player.loadVideoById(radio_array[radio_array.length - 1]);
}

function load_next_song() {
	radio_array.pop();
	//console.log(`Songs left: ${radio_array.length}`);
	//console.log(`Loading: ${radio_array[radio_array.length - 1]}`);
	if (radio_array.length > 0) {
		player.loadVideoById(radio_array[radio_array.length - 1]);
	} else {
		reshuffle()
	}
}

function reshuffle() {
	$.get(`/radio/2k/radios/${radio_id}.txt`, function(data) {
		document.getElementById('status').innerHTML = "Loading [3/5]...";
		//console.log(data);
		radio_array = data.split(`\n`);
		document.getElementById('status').innerHTML = "Loading [4/5]...";
		radio_array.sort(function(){return 0.5 - Math.random()});
		//console.log(radio_array);
		start_radio();
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
		case "ArrowDown":
			volume_change(-1);
			break;
		case "ArrowUp":
			volume_change(1);
			break;
	}
}


/*
//////////////////////////////
	DISPLAY
//////////////////////////////
*/
function onPlayerStateChange(event) {
	//console.log(event.data);
	switch (event.data) {
		case -1:
			document.getElementById('status').innerHTML = "Switching Song...";
			document.getElementById('ticker').innerHTML = "";
			break;
		case 0:
			load_next_song();
			break;
		case 3:
			document.getElementById('status').innerHTML = "Switching Song...";
			document.getElementById('ticker').innerHTML = "";
			break;
		case 1:
			document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/pause.svg">`;
			document.getElementById('status').innerHTML = "Now playing... ";
			if (!radio_shuffle) {
				player.setShuffle(true);
				radio_shuffle = true;
				player.playVideoAt(0);
			}
			document.getElementById('ticker').innerHTML = `<a href="${player.getVideoUrl()}" target="_blank" onclick="pause()">${document.getElementById('player').title}</a> - ${radio_name}`;
			ticker_scroll_start();
			break;
		case 2:
			document.getElementById('status').innerHTML = "Paused... ";
			document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/play.svg">`;
			break;
	}
}

function ticker_scroll_start() {
	scroll_width = document.getElementById('ticker').scrollWidth;
}
/*
function scrollToSmoothly(pos, time) {
    var currentPos = window.pageYOffset;
    var start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start;
        var progress = currentTime - start;
        if (currentPos < pos) {
            window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
        } else {
            window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
        }
        if (progress < time) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, pos);
        }
    });
}
*/
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

