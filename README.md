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
