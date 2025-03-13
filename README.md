# Fungi Radio
Fungi Radio is a radio-like music player created using YouTube's iframe API. It can switch between different "stations," it can mute, change volume, pause, and skip, and the stations have unique backgrounds and "album" arts.

[Access it here!](https://colind8.neocities.org/radio)

## Instances
There are currently two separate instances of Fungi Radio with major changes to its functionality.

[Fungi Radio: Default](https://colind8.neocities.org/radio)
> Fungi Radio: Default loads a youtube playlist using YouTube's iframe API and then shuffles it. Because of how YouTube's iframe API works, playlists are limited to the top 200 videos.

[Fungi Radio: 2000](https://colind8.neocities.org/radio2000)
> Fungi Radio: 2000 loads a text document containing a list of video IDs and it converts this list into an array and shuffles it. Each ID from the array will be read and then played on the iframe. When the video ends, the next item of the array will be selected. This allows for more than 200 videos to be played per playlist at the cost of automation (playlists do not update automatically and must be manually changed).

## Build Instructions
Fungi Radio is a static website. Simply download the source code and host a server. Note: YouTube severely limits what videos are played on non-public servers.

## Creating your own "radios" (Fungi Radio: Default)
Creating your own radios is as simple as editing a JSON file. Specifically, you need to edit the `radio2.json` file in the `radio` folder.

How it works is simple, this json file contains an array of "radio objects" that each define specific things about the radio. Adding a radio is as simple as adding a new radio object to the array.

Below is a sample of a radio object.
```
{
  "id": "PLGgeOJev8QMT_4I6NP_BmgSUpQkiTddNf",
  "name": "Fungi Radio",
  "section": "Main",
  "unlock_method": "default",
  "unlock_password": "NA",
  "album": "https://i.imgur.com/flXLkQI.png",
  "bg": "https://i.imgur.com/ksRPfI7.png"
}
```
`id` is the YouTube playlist ID. You can find it in the URL of a playlist's page.

`name` is the name of your radio. It can be whatever you want.

`section` is the name of the section its apart of. Sections are separated by horizontal rules. It's entirely an aesthetic thing. All radios with the same section name will be in the same section.

`unlock_method` determines how you'll be able to see the radio. This has three settings:

- `"default"` means that the radio will be available from the start.
- `"toggle"` means that the radio will be disabled from the start, but can be enabled in the "customize radiolist" menu.
- `"secret"` means that the radio needs to be unlocked by entering its password at the settings menu. The password is determined by `unlock_password`.

`unlock_password` is the password you have to enter to unlock the radio if its unlock_method is set to "secret". If multiple radios have the same password, they will all be unlocked when its entered.

`album` is an image link for the icon that appears on the radiolist and spins.

`bg` is an image link for the background that appears when the radio is selected.

## Creating your own "radios" (Fungi Radio: 2000)
Creating a radio for Fungi Radio 2000 is a much more complicated process. It's not recommended unless your playlist has over 200 songs and you want to listen to it all.

Rather than loading a playlist directly, Fungi Radio 2000 reads text files that have a list of YouTube video IDs (separated by new lines). These text files are placed in `/radio/2k/radios`. To create these text files, you can create them manually (lol) or use a tool like this: https://github.com/Colind8/YT-Playlist-Extractor. After creating your text file make sure you get rid of any non-printing characters that aren't `\n`. I've personally had issues where `\r` would be there.

After you create the text file, you need to edit `radiolist.json` found in `/radio/2k`. Fungi Radio 2000 as of now has less features than Fungi Radio default, so it's slightly different. The main difference is the multiple arrays which determine sections and the new "file" attribute.

`file` is simply the name of your text file. Do not include the file extension. 
