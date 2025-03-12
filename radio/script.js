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
const radiolist_albums = document.getElementsByClassName("radiolist_albums");
const delay = ms => new Promise(res => setTimeout(res, ms));

if (save_data) {
	console.log(`localStorage data found! Loading...`);
	load();
} else {
	console.log(`localStorage data not found! Loading...`);
	dataobj = JSON.parse(`{
	"version": 1,
	"extra_controls": false,
	"devlogs": false,
	"iframe": false,
	"disabled_radios": [],
	"secrets_found": [],
	"image_rendering": 0
}`);
	begin_loading();
}

function save() {
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
		if (dev_logs) {
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
	
	begin_loading();
}

function begin_loading() {
	if (dataobj.devlogs) {
		dev_logs = true;
		console.log(`console logs enabled!`);
	}
	
	$.getJSON('/radio/radio2.json', function(data) {
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
					dataobj.disabled_radios.push(i);
				}
			}
		}

		// Create radiolist
		
		radiolist_string = "";/*
		for (a = 0; a < radio_data.radiolist.length; a++) {
			for (b = 0; b < radio_data.radiolist[a].length; b++) {
				radiolist_string += `<img class="radiolist_albums" draggable="false" src="${radio_data.radiolist[a][b].album}" onclick="radiolist_select(${a},${b})" title="${radio_data.radiolist[a][b].name}">`;
			}
			if (a < radio_data.radiolist.length - 1) {
				radiolist_string += `<hr>`
			}
		}*/
		radiolist_string = generate_radiolist(radio_data);
		radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`
		radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`
		
		
		
		
		document.getElementById("radiolist").innerHTML += radiolist_string;
		
		// Create Settings
		settings_string = "";
		
		settings_string += `<p>Toggle Extra Controls: <button onclick="setting_toggle_controls()" id="settingbutton_toggle_controls" class="settings_button">Disabled</button></p>`;
		settings_string += `<p>Toggle iframe: <button onclick="setting_toggle_iframe()" id="settingbutton_toggle_iframe" class="settings_button">Disabled</button></p>`;
		if (dev_logs) {
			settings_string += `<p>Toggle console logs: <button onclick="setting_toggle_logs()" id="settingbutton_toggle_logs" class="settings_button">Enabled</button></p>`;
		} else {
			settings_string += `<p>Toggle console logs: <button onclick="setting_toggle_logs()" id="settingbutton_toggle_logs" class="settings_button">Disabled</button></p>`;
		}
		settings_string += `<p>Image-rendering: <button onclick="setting_toggle_image_rendering(-1)" id="settingbutton_toggle_image_rendering" class="settings_button">???</button></p>`;
		
		settings_string += `<p>Customize Radiolist: <button onclick="setting_customize()" class="settings_button">Customize Radiolist</button></p>`;
		settings_string += `<form onsubmit="return run_code()"><label for="form_code">Code: </label><input autocomplete="off" type="text" id="form_code" name="form_code" value=""><input type="submit" class="settings_button" value="Submit"></form>`;
		settings_string += `<p><button class="settings_button" onclick="open_settings(0)">Close Settings</button></p>`
		settings_string += `<p><button class="settings_button" onclick="save()">Save settings to LocalStorage</button></p>`
		settings_string += `<p><button class="settings_button" onclick="delete_save()">Delete LocalStorage data</button></p>`
		document.getElementById("settings_menu").innerHTML += settings_string;
		
		
	});
}



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
	//event.target.playVideo();
	starting = false;
	document.getElementById("startstatus").innerHTML = `Click anywhere to play!`
	if (!dataobj.iframe) {
		document.getElementById("player").style.display = "none";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Disabled";
	} else {
		document.getElementById("player").style.display = "inline";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Enabled";
	}
	if (!dataobj.extra_controls) {
		document.getElementById("control_rewind").style.display = "none";
		document.getElementById("control_loop").style.display = "none";
		document.getElementById("settingbutton_toggle_controls").innerText = "Disabled";
	} else {
		document.getElementById("control_rewind").style.display = "block";
		document.getElementById("control_loop").style.display = "block";
		document.getElementById("settingbutton_toggle_controls").innerText = "Enabled";
	}
	setting_toggle_image_rendering(0);
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
	if (dev_logs) {
		console.log(`Skipping: ${player.getPlaylist().length} > ${player.getPlaylistIndex() + 1}\n${player.getPlaylist().length > (player.getPlaylistIndex() + 1)}`);
	}
	if (player.getPlaylist().length > (player.getPlaylistIndex() + 1)) {
		player.nextVideo();
	} else {
		reshuffle(0);
	}
}

function rewind() {
	player.previousVideo();
}

function toggle_loop() {
	if (loop_enabled) {
		loop_enabled = false;
		document.getElementById('control_loop').innerHTML = `<img draggable="false" width="16px" src="./radio/svg/loop_disabled.svg">`;
	} else {
		loop_enabled = true;
		document.getElementById('control_loop').innerHTML = `<img draggable="false" width="16px" src="./radio/svg/loop_enabled.svg">`;
	}
}

function seek(amt) {
	player.seekTo(player.getCurrentTime() + amt);
}

function onError(event) {
	if (dev_logs) {
		console.log(`Error: ${event.data}`);
	}
	if (player.getPlaylistIndex() < 199) {
		if (dev_logs) {
			console.log("ERROR: SKIPPING");
		}
		skip();
	} else {
		if (dev_logs) {
			console.log("ERROR: RESHUFFLING")
		}
		reshuffle_index = 0;
		reshuffle(reshuffle_index);
	}
}

function switch_radio(qwer) {
	if (dev_logs) {
		console.log(`SWITCH RADIO: ${qwer}`);
	}
	player.mute();
	unmutein = 0;
	document.getElementById('status').innerHTML = "Loading...";
	player.stopVideo();
	radio_id = radio_data.radiolist[qwer].id;
	document.getElementById('album_art')
		.setAttribute("src", radio_data.radiolist[qwer].album);
	radio_name = radio_data.radiolist[qwer].name;
	if (dev_logs) {
		console.log(`LOADING RADIO: id ${radio_id}, name ${radio_name}`);
	}
	//player.setShuffle(true);
	reshuffle_index = 0;
	reshuffle(reshuffle_index);
}

function reshuffle(ri) {
	if (dev_logs) {
		console.log(`reshuffling`);
	}
	
	radio_shuffle = false;

	player.loadPlaylist({
		list: radio_id,
		listType: "playlist",
		index: ri,
		startSeconds: 0
	});
}

function start() {
	if (starting == false && started == false) {
		switch_radio(0);
		//console.log("Epic");
		document.getElementById("startcontainer").style.animation = "start_fade 0.5s ease-in forwards"
		setTimeout(start2, 500);
		started = true;
	}
}

function start2() {
	document.getElementById("startcontainer").style.display = "none";
	document.getElementById("album_art").style.animation = "album_fadein 0.1s ease-in forwards";
	if (player.getPlayerState() == 5) {
		if (dev_logs) {
			console.log(`Playlist failed to load, starting reshuffle search.`);
		}
		reshuffle_search();
	} else {
		player.playVideo();
	}
	setTimeout(album_animate, 100);
}

function keycontrols(event) {
	if (document.getElementById("settings_menu").style.display == "block") {
		return;
	}
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
		case "j":
			rewind();
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
	switch (event.data) {
		case -1: // UNSTARTED
			if (dev_logs) {
				console.log(`EVENT: UNSTARTED`);
			}
			
			if ((loop_enabled == true) && (loop_wait == true)) {
				player.previousVideo();
				loop_wait = false;
			}
			
			document.getElementById('status').innerHTML = "Switching Song...";
			document.getElementById('ticker').innerHTML = "";
			break;
		case 0: // ENDED
			if (dev_logs) {
				console.log(`EVENT: ENDED`);
			}
			
			document.getElementById('status').innerHTML = "Reshuffling...";
			reshuffle_index = 0;
			reshuffle(reshuffle_index);
			break;
		case 1: // PLAYING
			if (dev_logs) {
				console.log(`EVENT: PLAYING`);
			}
			document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/pause.svg">`;
			document.getElementById('status').innerHTML = "Now playing... ";
			if (!radio_shuffle) {
				player.setShuffle(true);
				radio_shuffle = true;
				player.playVideoAt(0);
			}
			if (unmutein < 2) {
				unmutein++;
			}
			if (unmutein == 2) {
				unmutein++;
				player.unMute();
			}
			if (unmutein > 2) {
				document.getElementById('ticker').innerHTML = `${document.getElementById('player').title} <a href="${player.getVideoUrl()}" target="_blank" onclick="pause()">🔗</a> - ${radio_name}`;
			}
			if (dev_logs) {
				console.log(`unmutein = ${unmutein}`);
			}
			loop_wait = true;
			ticker_scroll_start();
			break;
		case 2: // PAUSED
			if (dev_logs) {
				console.log(`EVENT: PAUSED`);
			}
			
			document.getElementById('status').innerHTML = "Paused... ";
			document.getElementById("control_pause").innerHTML = `<img draggable="false" width="16px" src="./radio/svg/play.svg">`;
			break;
		case 3: // BUFFERING
			if (dev_logs) {
				console.log(`EVENT: BUFFERING`);
			}
			
			document.getElementById('status').innerHTML = "Switching Song...";
			document.getElementById('ticker').innerHTML = "";
			break;
		case 5: // CUED
			if (dev_logs) {
				console.log(`EVENT: CUED`);
			}
			
			document.getElementById('status').innerHTML = "Loading... ";
			reshuffle_search();
			break;
	}
}

reshuffle_search = async () => {
	while (player.getPlayerState() == 5) {
		if (dev_logs) {
			console.log(`playlist failed to load, raising index to ${reshuffle_index + 1}`);
		}
		reshuffle_index++;
		reshuffle(reshuffle_index);
		await delay(1000);
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
	if (menu_open == "true") {
		return;
	}
	document.getElementById("album_art").style.animation = "album_fadeout 0.2s ease-in forwards";
	document.getElementById("body").style.animation = "bg_fadeout 0.5s ease-in forwards";
	setTimeout(radiolist_display, 200);
}

function radiolist_display() {
	menu_open = true;
	document.getElementById("album").style.display = "none";
	document.getElementById("menu").style.display = "block";
	for (i = 0; i < radiolist_albums.length; i++) {
		radiolist_albums[i].style.animation = "album_fadein 0.1s ease-in " + (i * 0.05) + "s forwards";
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
	if (dataobj.extra_controls) {
		dataobj.extra_controls = false;
		document.getElementById("control_rewind").style.display = "none";
		document.getElementById("control_loop").style.display = "none";
		document.getElementById("settingbutton_toggle_controls").innerText = "Disabled";
	} else {
		dataobj.extra_controls = true;
		document.getElementById("control_rewind").style.display = "block";
		document.getElementById("control_loop").style.display = "block";
		document.getElementById("settingbutton_toggle_controls").innerText = "Enabled";
	}
}

function setting_toggle_iframe() {
	if (dataobj.iframe) {
		dataobj.iframe = false;
		document.getElementById("player").style.display = "none";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Disabled";
	} else {
		dataobj.iframe = true;
		document.getElementById("player").style.display = "inline";
		document.getElementById("settingbutton_toggle_iframe").innerText = "Enabled";
	}
}

function setting_toggle_logs() {
	if (dev_logs) {
		dev_logs = false;
		dataobj.devlogs = false;
		console.log(`console logs enabled!`);
		document.getElementById("settingbutton_toggle_logs").innerText = "Disabled";
	} else {
		dev_logs = true;
		dataobj.devlogs = true;
		console.log(`console logs enabled!`);
		document.getElementById("settingbutton_toggle_logs").innerText = "Enabled";
	}
}

function setting_toggle_image_rendering(type) {
	let image_renderer = dataobj.image_rendering;
	if (type == -1) {
		image_renderer++;
		if (image_renderer > 3) {
			image_renderer = 0;
		}
	}
	dataobj.image_rendering = image_renderer;
	console.log(`Switching image-rendering to ${image_renderer}`);
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
				if ((r_data.radiolist[b].unlock_method != "secret") || (dataobj.secrets_found.includes(r_data.radiolist[b].unlock_password))) {
					if (customizing_radiolist == false) {
						if (dataobj.disabled_radios.includes(b) == false) {
							items_exist_in_section = true;
							r_string += `<img class="radiolist_albums" draggable="false" src="${r_data.radiolist[b].album}" onclick="radiolist_select(${b})" title="${r_data.radiolist[b].name}">`;
						}
					} else {
						if (dataobj.disabled_radios.includes(b) == false) {
							items_exist_in_section = true;
							r_string += `<img class="radiolist_albums" id="album_${b}" style="filter: none;" draggable="false" src="${r_data.radiolist[b].album}" onclick="radio_disable(${b})" title="${r_data.radiolist[b].name}">`;
						} else {
							items_exist_in_section = true;
							r_string += `<img class="radiolist_albums" id="album_${b}" style="filter: blur(5px);" draggable="false" src="${r_data.radiolist[b].album}" onclick="radio_disable(${b})" title="${r_data.radiolist[b].name}">`;
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

function setting_customize() {
	customizing_radiolist = true;
	radiolist_string = "";
	radiolist_string = generate_radiolist(radio_data);
	radiolist_string += `<p><button class="settings_button" onclick="finish_customization()">Finish Customization</button></p>`
	
	document.getElementById("radiolist").innerHTML = radiolist_string;
	let radiolist_custom_albums = document.getElementsByClassName("radiolist_albums");
	open_settings(0);
	/*for (i = 0; i < radiolist_custom_albums.length; i++) {
		radiolist_custom_albums[i].style.animation = "album_fadein 0.1s ease-in " + (i * 0.05) + "s forwards";
	}*/
}

function radio_disable(id) {
	if (dataobj.disabled_radios.includes(id)) {
		if (dev_logs) {
			console.log(`Enabling: ${id}`);
		}
		dataobj.disabled_radios.splice(dataobj.disabled_radios.indexOf(id),1);
		document.getElementById(`album_${id}`).style.filter = "none";
	} else {
		if (dev_logs) {
			console.log(`Disabling: ${id}`);
		}
		dataobj.disabled_radios.push(id);
		document.getElementById(`album_${id}`).style.filter = "blur(5px)";
	}
}

function finish_customization() {
	customizing_radiolist = false;
	radiolist_string = "";
	radiolist_string = generate_radiolist(radio_data);
	radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`;
	radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`;
	
	document.getElementById("radiolist").innerHTML = radiolist_string;
	open_settings(1);
}

function run_code() {
	let ran_code = document.getElementById("form_code").value;
	let secret_found = false;
	
	if (dataobj.secrets_found.includes(ran_code)) {
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
		dataobj.secrets_found.push(ran_code);
		window.alert("Secret found!");
		radiolist_string = "";
		radiolist_string = generate_radiolist(radio_data);
		radiolist_string += `<p><button class="settings_button" onclick="open_settings(1)">Open Settings</button></p>`;
		radiolist_string += `<p>Created by <a target="_blank" href="https://colind8.neocities.org/">Colind8</a></p>`;
		
		document.getElementById("radiolist").innerHTML = radiolist_string;
	} else {
		window.alert("Invalid code!");
	}
	
	document.getElementById("form_code").value = "";
	
	return false;
}