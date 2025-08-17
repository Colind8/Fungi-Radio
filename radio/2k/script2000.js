/*
//////////////////////////////
	INITIAL SETUP
//////////////////////////////
*/
radio_data = {};
save_data = localStorage.getItem("radio_data");
radio_name = "Fungi Radio";
radio_current = 0;
radio_shuffle = false;
menu_open = false;
dev_logs = false;
started = false;
starting = true;
loop_enabled = false;
loop_wait = false;
customizing_radiolist = false;
radiolist_speed = 0.05;
const radiolist_albums = document.getElementsByClassName("radiolist_album_div");
ticker_id = 0;
song_index = 0;

if (save_data) {
	console.log(`localStorage data found! Loading...`);
	load();
} else {
	console.log(`localStorage data not found! Loading...`);
	dataobj = JSON.parse(`{
	"version": 4,
	"extra_controls": false,
	"devlogs": false,
	"iframe": false,
	"disabled_radios": [],
	"disabled_radios_2k": [],
	"secrets_found": [],
	"secrets_found_2k": [],
	"image_rendering": 0,
	"speed": 0,
	"display_names": false,
	"startup_pause": false,
	"startup_volume": 100,
	"startup_radio": "PLGgeOJev8QMT_4I6NP_BmgSUpQkiTddNf",
	"startup_radio_2k": "fungiradio"
}`);
	begin_loading();
}

function save() {
	set_start_volume();
	save_data = JSON.stringify(dataobj);
	save_data = window.btoa(save_data);
	localStorage.setItem("radio_data", save_data);
	window.alert("Saved to LocalStorage!");
}

function delete_save() {
	if (window.confirm("Are you sure you want to delete your LocalStorage data?")) {
		localStorage.removeItem("radio_data");
	}
}

function load() {
	save_data = localStorage.getItem("radio_data");
	dataobj = window.atob(save_data);
	dataobj = JSON.parse(dataobj);
	
	if (dataobj.version == 0) { // Update from version 0 to 1
		if (dataobj.devlogs) {
			console.log(`Updating from version 0 to 1`);
		}
		let new_dataobj = {
			version: 1,
			extra_controls: dataobj.extra_controls,
			devlogs: dataobj.devlogs,
			iframe: dataobj.iframe,
			disabled_radios: dataobj.disabled_radios,
			secrets_found: dataobj.secrets_found,
			image_rendering: 0
		}
		
		dataobj = new_dataobj;
	}
	
	if (dataobj.version == 1) { // Update from version 1 to 2
		if (dataobj.devlogs) {
			console.log(`Updating from version 1 to 2`);
		}
		let new_dataobj = {
			version: 2,
			extra_controls: dataobj.extra_controls,
			devlogs: dataobj.devlogs,
			iframe: dataobj.iframe,
			disabled_radios: dataobj.disabled_radios,
			secrets_found: dataobj.secrets_found,
			image_rendering: dataobj.image_rendering,
			speed: 0,
			display_names: false
		}
		
		dataobj = new_dataobj;
	}
	
	if (dataobj.version == 2) { // Update from version 2 to 3
		if (dataobj.devlogs) {
			console.log(`Updating from version 2 to 3`);
		}
		let new_dataobj = {
			version: 3,
			extra_controls: dataobj.extra_controls,
			devlogs: dataobj.devlogs,
			iframe: dataobj.iframe,
			disabled_radios: dataobj.disabled_radios,
			secrets_found: dataobj.secrets_found,
			image_rendering: dataobj.image_rendering,
			speed: dataobj.speed,
			display_names: false,
			startup_pause: false,
			startup_volume: 100,
			startup_radio: 0
		}
		
		dataobj = new_dataobj;
	}
	
	if (dataobj.version == 3) { // Update from version 3 to 4
		if (dataobj.devlogs) {
			console.log(`Updating from version 3 to 4`);
		}
		let new_dataobj = {
			version: 4,
			extra_controls: dataobj.extra_controls,
			devlogs: dataobj.devlogs,
			iframe: dataobj.iframe,
			disabled_radios: [],
			disabled_radios_2k: [],
			secrets_found: dataobj.secrets_found,
			secrets_found_2k: [],
			image_rendering: dataobj.image_rendering,
			speed: dataobj.speed,
			display_names: dataobj.display_names,
			startup_pause: dataobj.startup_pause,
			startup_volume: dataobj.startup_volume,
			startup_radio: "PLGgeOJev8QMT_4I6NP_BmgSUpQkiTddNf",
			startup_radio_2k: "fungiradio"
		}
		
		dataobj = new_dataobj;
	}
	
	if (dataobj.version == 4) { // Update from version 4 to 5
		if (dataobj.devlogs) {
			console.log(`Updating from version 4 to 5`);
		}
		let new_dataobj = {
			version: 5,
			bumpers_enabled: true,
			controls: {
				extra_controls: dataobj.extra_controls,
				layout: 0,
				controls_separate: true,
				controls_size: 1,
				consoles_visible: 0
			},
			dev: {
				devlogs: dataobj.devlogs,
				iframe: dataobj.iframe
			},
			radiolist: {
				disabled_radios: dataobj.disabled_radios,
				disabled_radios_2k: dataobj.disabled_radios_2k,
				secrets_found: dataobj.secrets_found,
				secrets_found_2k: dataobj.secrets_found_2k,
				image_rendering: dataobj.image_rendering,
				speed: dataobj.speed,
				display_names: dataobj.display_names
			},
			startup: {
				startup_pause: dataobj.startup_pause,
				startup_volume: dataobj.startup_volume,
				startup_radio: dataobj.startup_radio,
				startup_radio_2k: dataobj.startup_radio,
				saveprogress_enabled: false,
				saveprogress_index: 0
			}
		}
		
		dataobj = new_dataobj;
	}
	
	begin_loading();
}

function begin_loading() {
	if (dataobj.dev.devlogs) {
		dev_logs = true;
		console.log(`console logs enabled!`);
	}
	
	$.getJSON('/radio/2k/radiolist.json', function(data) {
		//Code vomit
		radio_data = data;
		//console.log(radio_data.radiolist[1].length);
		var tag = document.createElement('script');
		document.getElementById("menu").style.display = "none";
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		var player;
		if (!save_data) {
			for (var i = 0; i < radio_data.radiolist.length; i++) {
				if (radio_data.radiolist[i].unlock_method == "toggle") {
					dataobj.radiolist.disabled_radios_2k.push(radio_data.radiolist[i].file);
				}
			}
		}

		// Create radiolist
		radiolist_string = "";
		radiolist_string = generate_radiolist(radio_data);
		radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`
		radiolist_string += `<p>This is a special instance of Fungi Radio that allows you to listen to thousands of songs rather than the most recent 200.</p>`
		radiolist_string += `<p><a href="./radio.html">Switch to Fungi Radio</a></p>`;
		radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`

		document.getElementById("radiolist").innerHTML = radiolist_string;
		document.getElementById("settings_menu").innerHTML += generate_settings();
	});
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'bzIaqFNDZkA',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onError
		}
	});
}

function onPlayerReady(event) {
	starting = false;
	document.getElementById("startcontainer").style.cursor = "pointer";
	let startstatuses = [
		"Click anywhere to play!",
		"Tune in!",
		"Turn on!",
		"Rock on!",
		"Who's gonna rock the place?",
		"We're forever gonna rock the place.",
		"(place, place)",
		"Tune in, turn on",
		"We're going all city!",
		"Won't you take me to Funkytown?",
		"Also try Terrawars!",
		"Kick it!",
		"Let's rock!",
		"Awwwwww yeaaaaaa!!!",
		"Beautiful. Give it up, baby!",
		"Why not both?",
		"Are you in or out?",
		"Ready!",
		"You're tuning into FUNGI RADIO",
		"I'm thinking miku miku ooweeoo I look just like buddy holly",
		"Zero mistakes.",
		"Aw jeez here comes (cue breakcore)",
		"Get down! Get up again!",
		"Don't stop the beat!",
		"I know you sicker than sick-uh"
	]
	document.getElementById("startstatus").innerHTML = startstatuses[Math.round(Math.random() * (startstatuses.length - 1))];
	if (!dataobj.dev.iframe) {
		document.getElementById("player").style.display = "none";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Disabled";
	} else {
		document.getElementById("player").style.display = "inline";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Enabled";
	}
	if (!dataobj.controls.extra_controls) {
		document.getElementById("control_rewind").style.display = "none";
		document.getElementById("control_loop").style.display = "none";
		document.getElementById("settingbutton_toggle_controls").innerText = "Disabled";
	} else {
		document.getElementById("control_rewind").style.display = "block";
		document.getElementById("control_loop").style.display = "block";
		document.getElementById("settingbutton_toggle_controls").innerText = "Enabled";
	}
	document.getElementById(`form_volume`).value = dataobj.startup.startup_volume;
	volume_change(-100 + (Number(dataobj.startup.startup_volume)) );
	setting_toggle_image_rendering(0);
	setting_toggle_speed(0);
	setting_toggle_radio_names(0);
	setting_toggle_startup_pause(0);
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
	
	if (dev_logs) {
		console.log(`changing volume from ${current_volume} to ${current_volume + num}`)
	}
	
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
	volume_icon_change(current_volume + num,player.isMuted())
}

function volume_icon_change(vol,muted) {
	current_volume = vol;
	if (muted == 1) {
		return document.getElementById("control_mute_img").style.backgroundPositionX = `0px`;
	} else if (current_volume >= 75) {
		return document.getElementById("control_mute_img").style.backgroundPositionX = `-64px`;
	} else if (current_volume >= 25) {
		return document.getElementById("control_mute_img").style.backgroundPositionX = `-48px`;
	} else if (current_volume >= 5) {
		return document.getElementById("control_mute_img").style.backgroundPositionX = `-32px`;
	} else {
		return document.getElementById("control_mute_img").style.backgroundPositionX = `-16px`;
	}
}

function pause() {
	if (player.getPlayerState() == 2) {
		player.playVideo()
		document.getElementById("control_pause_img").style.backgroundPositionX = `0px`;
	} else {
		player.pauseVideo()
		document.getElementById("control_pause_img").style.backgroundPositionX = `-16px`;
	}

}

function skip() {
	if (dev_logs) {
		console.log(`Skipping...`);
	}
	load_next_song();
}

function rewind() {
	if (player.getCurrentTime() > 5) {
		if (dev_logs) {
			console.log(`Restarting song...`);
		}
		player.seekTo(0);
	} else {
		if (dev_logs) {
			console.log(`Rewinding...`);
		}
		load_previous_song();
	}
}

function toggle_loop() {
	if (loop_enabled) {
		loop_enabled = false;
		document.getElementById('control_loop_img').style.backgroundPositionX = `-64px`;
	} else {
		loop_enabled = true;
		document.getElementById('control_loop_img').style.backgroundPositionX = `-80px`;
	}
}

function seek(amt) {
	player.seekTo(player.getCurrentTime() + amt);
}

function onError(event) {
	radio_array.splice(song_index, 1);
	if (dev_logs) {
		console.log(`ERROR: ${event.data}`);
		console.log(`QUEUE: ${song_index} / ${radio_array.length}`);
		console.log(`Loading: ${radio_array[song_index]}`);
	}
	if (radio_array.length > song_index) {
		player.loadVideoById(radio_array[song_index]);
	} else {
		reshuffle()
	}
}

function switch_radio(qwer) {
	if (dev_logs) {
		console.log(`SWITCH RADIO: ${qwer}`);
	}
	//player.mute();
	radio_switched = true;
	document.getElementById('status').innerHTML = "Loading...";
	player.stopVideo();
	radio_id = radio_data.radiolist[qwer].file;
	document.getElementById('favicon').href = `${radio_data.radiolist[qwer].album}`;
	document.getElementById('album_art')
		.setAttribute("src", radio_data.radiolist[qwer].album);
	radio_name = radio_data.radiolist[qwer].name;

	radio_shuffle = false;
	
	if (dev_logs) {
		console.log(`LOADING RADIO: id ${radio_id}, name ${radio_name}`);
	}
	
	reshuffle();
}

function start_radio() {
	if (dev_logs) {
		console.log(`QUEUE: ${song_index} / ${radio_array.length}`);
		console.log(`Playing: ${radio_array[song_index]}`);
	}
	player.loadVideoById(radio_array[song_index]);
}

function start() {
	if (starting == false && started == false) {
		for (i=0; i < radio_data.radiolist.length; i++) {
			if (radio_data.radiolist[i].file == dataobj.startup.startup_radio_2k) {
				radio_current = i;
				break;
			}
		}
		
		document.getElementById("body").style.backgroundImage = `url("${radio_data.radiolist[radio_current].bg}")`;
		document.getElementById("containerbg").style.backgroundImage = `url("${radio_data.radiolist[radio_current].bg}")`;
		switch_radio(radio_current);
		document.getElementById("startcontainer").style.animation = "start_fade 0.5s ease-in forwards"
		setTimeout(start2, 500);
		started = true;
	}
}

function start2() {
	document.getElementById("startcontainer").style.display = "none";
	document.getElementById("album_art").style.animation = "album_fadein 0.1s ease-in forwards";
	setTimeout(album_animate, 100);
}

function load_next_song() {
	song_index++;
	if (dev_logs) {
		console.log(`QUEUE: ${song_index} / ${radio_array.length}`);
		console.log(`Loading: ${radio_array[song_index]}`);
	}
	
	if (radio_array.length > song_index) {
		player.loadVideoById(radio_array[song_index]);
	} else {
		reshuffle()
	}
}

function load_previous_song() {
	if (song_index == 0) {
		return;
	}
	song_index--;
	if (dev_logs) {
		console.log(`REWINDING`);
		console.log(`QUEUE: ${song_index} / ${radio_array.length}`);
		console.log(`Loading: ${radio_array[song_index]}`);
	}
	if (radio_array.length > song_index) {
		player.loadVideoById(radio_array[song_index]);
	} else {
		reshuffle()
	}
}

function reshuffle() {
	$.get(`/radio/2k/radios/${radio_id}.txt`, function(data) {
		if (dev_logs) {
			console.log(data);
		}
		radio_array = data.split(`\n`);
		document.getElementById('status').innerHTML = "Reshuffling...";
		for (let i = radio_array.length -1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i+1));
			let k = radio_array[i];
			radio_array[i] = radio_array[j];
			radio_array[j] = k;
		}
		//radio_array.sort(function(){return 0.5 - Math.random()});
		if (dev_logs) {
			console.log(radio_array);
		}
		start_radio();
	});
}

function keycontrols(event) {
	if (document.getElementById("settings_menu").style.display == "block") {
		return;
	}
	switch (event.key) {
		case "m":
			mute();
			break;
		case "j":
			rewind();
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
		case "ArrowLeft":
			seek(-5);
			break;
		case "ArrowRight":
			seek(5);
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
		case -1: // UNSTARTED
			if (dev_logs) {
				console.log(`EVENT: UNSTARTED`);
			}
			if ((loop_enabled == true) && (loop_wait == true)) {
				rewind();
				loop_wait = false;
			}
			document.getElementById('status').innerHTML = "Switching Song...";
			document.getElementById('ticker').innerHTML = "";
			break;
		case 0: // ENDED
			if (dev_logs) {
				console.log(`EVENT: ENDED`);
			}
			
			load_next_song();
			break;
		case 1: //PLAYING
			if (dev_logs) {
				console.log(`EVENT: PLAYING`);
			}
			document.getElementById("control_pause_img").style.backgroundPositionX = `0px`;
			document.getElementById('status').innerHTML = "Now playing... ";
			if (!radio_shuffle) {
				player.setShuffle(true);
				radio_shuffle = true;
				player.playVideoAt(0);
			}
			if ((dataobj.startup.startup_pause == true) && (radio_switched == true)) {
				player.pauseVideo()
				radio_switched = false;
				document.getElementById("control_pause_img").style.backgroundPositionX = `-16px`;
			}
			if (document.getElementById('ticker').innerHTML.length < 1) {
				document.getElementById('ticker').innerHTML = `<a href="${player.getVideoUrl()}" target="_blank" onclick="pause()">${document.getElementById('player').title}</a> - ${radio_name}`;
			}
			loop_wait = true;
			ticker_scroll_start();
			break;
		case 2: // PAUSED
			if (dev_logs) {
				console.log(`EVENT: PAUSED`);
			}
			
			document.getElementById('status').innerHTML = "Paused... ";
			document.getElementById("control_pause_img").style.backgroundPositionX = `-16px`;
			break;
		case 3: // BUFFERING
			if (dev_logs) {
				console.log(`EVENT: BUFFERING`);
			}
			if (document.getElementById('ticker').innerHTML.length < 1) {
				document.getElementById('status').innerHTML = "Switching Song...";
			}
			break;
	}
}

function ticker_scroll_start() {
	clearTimeout(ticker_id);
	ticker_id = setTimeout(ticker_wait, 1000,0) //begins the ticker scroll. It will scroll the div right after one second
}

function ticker_scroll(dir) {
	let current_scroll_pos = document.getElementById("ticker").scrollLeft;
	switch (dir) {
		case 0: // scroll right
			document.getElementById("ticker").scrollLeft += 1;
			if (current_scroll_pos == document.getElementById("ticker").scrollLeft) {
				ticker_id = setTimeout(ticker_wait, 1000,1);
			} else {
				ticker_id = setTimeout(ticker_wait, 50,0);
			}
			break;
		case 1: // scroll left
			document.getElementById("ticker").scrollLeft -= 1;
			if (current_scroll_pos == document.getElementById("ticker").scrollLeft) {
				ticker_id = setTimeout(ticker_wait, 1000,0);
			} else {
				ticker_id = setTimeout(ticker_wait, 50,1);
			}
			break;
	}
}

function ticker_wait(dir) {
	ticker_scroll(dir);
}

function radiolist_openup() {
	if (menu_open == "true") {
		return;
	}
	document.getElementById("album_art").style.animation = "album_fadeout 0.2s ease-in forwards";
	document.getElementById("body").style.animation = "bg_fadeout 0.5s ease-in forwards";
	setTimeout(radiolist_display, 200);
}

function radiolist_display() {
	menu_open = true;
	setting_toggle_radio_names(0);
	document.getElementById("album").style.display = "none";
	document.getElementById("menu").style.display = "block";
	for (i = 0; i < radiolist_albums.length; i++) {
		radiolist_albums[i].style.animation = "album_fadein 0.1s ease-in " + (i * radiolist_speed) + "s forwards";
	}
}

function radiolist_select(id) {
	menu_open = false;
	for (i = 0; i < radiolist_albums.length; i++) {
		radiolist_albums[i].style.animation = "album_fadeout 0.2s ease-in forwards";
	}

	if (radio_current != id) {
		document.getElementById("containerbg").style.backgroundImage = `url("${radio_data.radiolist[id].bg}")`;
		radio_current = id;
		switch_radio(id);
	}
	setTimeout(album_display, 200);
}

function album_display() {
	document.getElementById("album").style.display = "flex";
	document.getElementById("menu").style.display = "none";
	document.getElementById("album_art").style.animation = "album_fadein 0.1s ease-in forwards";
	document.getElementById("body").style.animation = "bg_fadein 0.5s ease-in forwards";
	document.getElementById("containerbg").style.animation = "bg_crossfade 0.5s ease-in forwards"
	setTimeout(album_animate, 100);
	setTimeout(reset_background, 500);
}

function album_animate() {
	document.getElementById("album_art").style.animation = "albumanimation 4s infinite linear"
}

function reset_background() {
	document.getElementById("containerbg").style.animation = "";
	document.getElementById("body").style.backgroundImage = document.getElementById("containerbg").style.backgroundImage;
	document.getElementById("containerbg").style.opacity = 0;
}





/*
//////////////////////////////
	MENU
//////////////////////////////
*/

function open_settings(open_close) {
	if (open_close == 0) {
		document.getElementById("settings_menu").style.display = "none";
		document.getElementById("radiolist").style.display = "block";
		radiolist_display();
	} else {
		document.getElementById("settings_menu").style.display = "block";
		document.getElementById("radiolist").style.display = "none";
	}
	
}

function setting_toggle_controls() {
	if (dataobj.controls.extra_controls) {
		dataobj.controls.extra_controls = false;
		document.getElementById("control_rewind").style.display = "none";
		document.getElementById("control_loop").style.display = "none";
		document.getElementById("settingbutton_toggle_controls").innerText = "Disabled";
	} else {
		dataobj.controls.extra_controls = true;
		document.getElementById("control_rewind").style.display = "block";
		document.getElementById("control_loop").style.display = "block";
		document.getElementById("settingbutton_toggle_controls").innerText = "Enabled";
	}
}

function setting_toggle_iframe() {
	if (dataobj.dev.iframe) {
		dataobj.dev.iframe = false;
		document.getElementById("player").style.display = "none";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Disabled";
	} else {
		dataobj.dev.iframe = true;
		document.getElementById("player").style.display = "inline";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Enabled";
	}
}

function setting_toggle_logs() {
	if (dev_logs) {
		dev_logs = false;
		dataobj.dev.devlogs = false;
		console.log(`console logs disabled!`);
		document.getElementById("settingbutton_toggle_logs").innerText = "Disabled";
	} else {
		dev_logs = true;
		dataobj.dev.devlogs = true;
		console.log(`console logs enabled!`);
		document.getElementById("settingbutton_toggle_logs").innerText = "Enabled";
	}
}

function setting_toggle_image_rendering(type) {
	let image_renderer = dataobj.radiolist.image_rendering;
	if (type == -1) {
		image_renderer++;
		if (image_renderer > 3) {
			image_renderer = 0;
		}
	}
	dataobj.radiolist.image_rendering = image_renderer;
	if (dev_logs) {
		console.log(`Switching image-rendering to ${image_renderer}`);
	}
	switch (image_renderer) {
		case 0:
			document.getElementById("settingbutton_toggle_image_rendering").innerText = "Default";
			document.getElementById("body").style.imageRendering = "auto";
			break;
		case 1:
			document.getElementById("settingbutton_toggle_image_rendering").innerText = "Smooth";
			document.getElementById("body").style.imageRendering = "smooth";
			break;
		case 2:
			document.getElementById("settingbutton_toggle_image_rendering").innerText = "Pixelated";
			document.getElementById("body").style.imageRendering = "pixelated";
			break;
		case 3:
			document.getElementById("settingbutton_toggle_image_rendering").innerText = "Crisp Edges";
			document.getElementById("body").style.imageRendering = "crisp-edges";
			break;
	}
}

function setting_toggle_speed(type) {
	let animation_speed = dataobj.radiolist.speed;
	if (type == -1) {
		animation_speed++;
		if (animation_speed > 6) {
			animation_speed = 0;
		}
	}
	dataobj.radiolist.speed = animation_speed;
	switch (animation_speed) {
		case 0:
			document.getElementById("settingbutton_toggle_speed").innerText = "Normal";
			radiolist_speed = 0.05
			break;
		case 1:
			document.getElementById("settingbutton_toggle_speed").innerText = "Fast";
			radiolist_speed = 0.01
			break;
		case 2:
			document.getElementById("settingbutton_toggle_speed").innerText = "Faster";
			radiolist_speed = 0.005
			break;
		case 3:
			document.getElementById("settingbutton_toggle_speed").innerText = "Instant";
			radiolist_speed = 0
			break;
		case 4:
			document.getElementById("settingbutton_toggle_speed").innerText = "Slowest";
			radiolist_speed = 1
			break;
		case 5:
			document.getElementById("settingbutton_toggle_speed").innerText = "Slower";
			radiolist_speed = 0.5
			break;
		case 6:
			document.getElementById("settingbutton_toggle_speed").innerText = "Slow";
			radiolist_speed = 0.1
			break;
	}
}

function setting_toggle_startup_pause(type) {
	let startup_pause = dataobj.startup.startup_pause;
	if (type == -1) {
		if (startup_pause) {
			startup_pause = false;
		} else {
			startup_pause = true;
		}
	}
	dataobj.startup.startup_pause = startup_pause;
	if (startup_pause) {
		document.getElementById("setting_toggle_startup_pause").innerText = "Enabled";
	} else {
		document.getElementById("setting_toggle_startup_pause").innerText = "Disabled";
	}
}

function setting_toggle_radio_names(type) {
	let toggle_radio_names = dataobj.radiolist.display_names;
	if (type == -1) {
		if (toggle_radio_names) {
			toggle_radio_names = false;
		} else {
			toggle_radio_names = true;
		}
	}
	dataobj.radiolist.display_names = toggle_radio_names;
	switch (toggle_radio_names) {
		case false:
			document.getElementById("settingbutton_toggle_radio_names").innerText = "Disabled";
			for (i=0; i < radio_data.radiolist.length; i++) {
				if (document.getElementById(`radio_name_${i}`)) {
					document.getElementById(`radio_name_${i}`).style.display = "none";
					document.getElementById(`radio_name_${i}`).style.margin = "0em";
				}
			}
			break;
		case true:
			document.getElementById("settingbutton_toggle_radio_names").innerText = "Enabled";
			for (i=0; i < radio_data.radiolist.length; i++) {
				if (document.getElementById(`radio_name_${i}`)) {
					document.getElementById(`radio_name_${i}`).style.display = "block";
					document.getElementById(`radio_name_${i}`).style.marginLeft = "0.5em";
					document.getElementById(`radio_name_${i}`).style.marginRight = "0.5em";
				}
			}
			break;
	}
}

function set_start_volume() {
	let start_volume = document.getElementById("form_volume").value;
	
	dataobj.startup.startup_volume = start_volume;
	return false;
}

function generate_radiolist(r_data) {
	r_string = ""
	sections = [];
	if (dev_logs) {
		console.log(`Generating radiolist...`);
	}
	for (var i = 0; i < r_data.radiolist.length; i++) {
		if (sections.includes(r_data.radiolist[i].section) == false) {
			if (dev_logs) {
				console.log(`Pushing ${r_data.radiolist[i].section}`);
			}
			sections.push(r_data.radiolist[i].section);
		}
	}
	if (dev_logs) {
		console.log(`Sections: ${sections}`);
	}
	
	for (var a = 0; a < sections.length; a++) {
		let items_exist_in_section = false;
		if (dev_logs) {
			console.log(`Starting section loop ${a}`);
		}
		for (b = 0; b < r_data.radiolist.length; b++) {
			if (dev_logs) {
				console.log(`Reading radio ${b}...`);
			}
			if (r_data.radiolist[b].section == sections[a]) {
				if ((r_data.radiolist[b].unlock_method != "secret") || (dataobj.radiolist.secrets_found_2k.includes(r_data.radiolist[b].unlock_password))) {
					if (customizing_radiolist == false) {
						if (dataobj.radiolist.disabled_radios_2k.includes(r_data.radiolist[b].file) == false) {
							items_exist_in_section = true;
							r_string += `<div class="radiolist_album_div">`
							r_string += `<img class="radiolist_albums" draggable="false" src="${r_data.radiolist[b].album}" onclick="radiolist_select(${b})" title="${r_data.radiolist[b].name}">`;
							r_string += `<div id="radio_name_${b}">${r_data.radiolist[b].name}</div>`
							r_string += `</div>`
						}
					} else {
						if (dataobj.radiolist.disabled_radios_2k.includes(r_data.radiolist[b].file) == false) {
							items_exist_in_section = true;
							r_string += `<div class="radiolist_album_div">`
							r_string += `<img class="radiolist_albums" id="album_${r_data.radiolist[b].file}" style="filter: none;" draggable="false" src="${r_data.radiolist[b].album}" onclick="radio_disable('${r_data.radiolist[b].file}')" title="${r_data.radiolist[b].name}">`;
							r_string += `<div id="radio_name_${b}">${r_data.radiolist[b].name}</div>`
							r_string += `</div>`
						} else {
							items_exist_in_section = true;
							r_string += `<div class="radiolist_album_div">`
							r_string += `<img class="radiolist_albums" id="album_${r_data.radiolist[b].file}" style="filter: blur(5px);" draggable="false" src="${r_data.radiolist[b].album}" onclick="radio_disable('${r_data.radiolist[b].file}')" title="${r_data.radiolist[b].name}">`;
							r_string += `<div id="radio_name_${b}">${r_data.radiolist[b].name}</div>`
							r_string += `</div>`
						}
					}
				}
			}
		}
		if ((items_exist_in_section == true)) {
			r_string += `<hr>`;
		}
	}
	
	if (dev_logs) {
		console.log(`r_string: ${r_string}`);
	}
	
	return r_string;
}

function generate_settings() {
	settings_string = "";
	settings_string += `<p>Toggle Extra Controls: <button onclick="setting_toggle_controls()" id="settingbutton_toggle_controls" class="settings_button">Disabled</button></p>`;
	settings_string += `<p>Toggle iframe: <button onclick="setting_toggle_iframe()" id="settingbutton_toggle_iframe" class="settings_button">Disabled</button></p>`;
	if (dev_logs) {
		settings_string += `<p>Toggle console logs: <button onclick="setting_toggle_logs()" id="settingbutton_toggle_logs" class="settings_button">Enabled</button></p>`;
	} else {
		settings_string += `<p>Toggle console logs: <button onclick="setting_toggle_logs()" id="settingbutton_toggle_logs" class="settings_button">Disabled</button></p>`;
	}
	settings_string += `<p>Image-rendering: <button onclick="setting_toggle_image_rendering(-1)" id="settingbutton_toggle_image_rendering" class="settings_button">???</button></p>`;
	settings_string += `<p>Animation Speed: <button onclick="setting_toggle_speed(-1)" id="settingbutton_toggle_speed" class="settings_button">???</button></p>`;
	settings_string += `<p>Radio Names: <button onclick="setting_toggle_radio_names(-1)" id="settingbutton_toggle_radio_names" class="settings_button">???</button></p>`;
	settings_string += `<p>Pause on Selecting Radio: <button onclick="setting_toggle_startup_pause(-1)" id="setting_toggle_startup_pause" class="settings_button">???</button></p>`;
	settings_string += `<form onsubmit="return set_start_volume()"><label for="form_volume">Volume on Startup: </label><input autocomplete="off" type="number" min="0" max="100" id="form_volume" name="form_volume" value="100" class="form_input"></form>`;
	
	settings_string += `<p>Customize Radiolist: <button onclick="setting_customize()" class="settings_button">Customize Radiolist</button></p>`;
	settings_string += `<form onsubmit="return run_code()"><label for="form_code">Code: </label><input class="form_input" autocomplete="off" type="text" id="form_code" name="form_code" value=""><input type="submit" class="settings_button" value="Submit"></form>`;
	settings_string += `<p><button class="settings_button" onclick="open_settings(0)">Close Settings</button></p>`
	settings_string += `<p><button class="settings_button" onclick="save()">Save settings to LocalStorage</button></p>`
	settings_string += `<p><button class="settings_button" onclick="delete_save()">Delete LocalStorage data</button></p>`
	return settings_string;
}

function setting_customize() {
	customizing_radiolist = true;
	selecting_first_radio = false;
	radiolist_string = "";
	radiolist_string = generate_radiolist(radio_data);
	radiolist_string += `<p><img style="width: 8em;" id="change_first_radio" src="/radio/svg/star_empty.png" onclick="change_first_radio()" title="Change radio on startup"></p>`
	radiolist_string += `<p><button class="settings_button" onclick="finish_customization()">Finish Customization</button></p>`
	
	document.getElementById("radiolist").innerHTML = radiolist_string;
	let radiolist_custom_albums = document.getElementsByClassName("radiolist_albums");
	document.getElementById(`album_${dataobj.startup.startup_radio_2k}`).style.border = "yellow 2px solid";
	open_settings(0);
}

function change_first_radio() {
	if (selecting_first_radio) {
		selecting_first_radio = false;
		document.getElementById(`change_first_radio`).src = "/radio/svg/star_empty.png";
	} else {
		selecting_first_radio = true;
		document.getElementById(`change_first_radio`).src = "/radio/svg/star_full.png";
	}
	
}

function radio_disable(id) {
	if (selecting_first_radio == true) {
		document.getElementById(`album_${dataobj.startup.startup_radio_2k}`).style.border = "yellow 2px none";
		dataobj.startup.startup_radio_2k = id;
		document.getElementById(`album_${id}`).style.border = "yellow 2px solid";
		return;
	}
	
	if (dataobj.radiolist.disabled_radios_2k.includes(id)) {
		if (dev_logs) {
			console.log(`Enabling: ${id}`);
		}
		dataobj.radiolist.disabled_radios_2k.splice(dataobj.radiolist.disabled_radios_2k.indexOf(id),1);
		document.getElementById(`album_${id}`).style.filter = "none";
	} else {
		if (dev_logs) {
			console.log(`Disabling: ${id}`);
		}
		dataobj.radiolist.disabled_radios_2k.push(id);
		document.getElementById(`album_${id}`).style.filter = "blur(5px)";
	}
}

function finish_customization() {
	customizing_radiolist = false;
	// Create radiolist
	radiolist_string = "";
	radiolist_string = generate_radiolist(radio_data);
	radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`
	radiolist_string += `<p>This is a special instance of Fungi Radio that allows you to listen to thousands of songs rather than the most recent 200.</p>`
	radiolist_string += `<p><a href="./radio.html">Switch to Fungi Radio</a></p>`;
	radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`

	document.getElementById("radiolist").innerHTML = radiolist_string;
	open_settings(1);
}

function run_code() {
	let ran_code = document.getElementById("form_code").value;
	let secret_found = false;
	
	if (dataobj.radiolist.secrets_found_2k.includes(ran_code)) {
		window.alert("You already found this secret!");
		return false;
	}
	
	for (var i = 0; i < radio_data.radiolist.length; i++) {
		if (radio_data.radiolist[i].unlock_method == "secret") {
			if (radio_data.radiolist[i].unlock_password == ran_code) {
				secret_found = true;
			}
		}
	}
	
	if (secret_found) {
		dataobj.radiolist.secrets_found_2k.push(ran_code);
		window.alert("Secret found!");
		radiolist_string = "";
		radiolist_string = generate_radiolist(radio_data);
		radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`;
		radiolist_string += `<p><a href="./radio2000.html">Switch to Fungi Radio 2000</a></p>`;
		radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`;
		
		document.getElementById("radiolist").innerHTML = radiolist_string;
	} else {
		window.alert("Invalid code!");
	}
	
	document.getElementById("form_code").value = "";
	
	return false;
}