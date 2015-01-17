# ioMarks
## About
[ioMarks](http://iomarks.vaskas.lt) - unofficial simple front end for [saved.io](http://saved.io) bookmarking website (by Anthony Feint). It lets you perform Google search for content only in your bookmarked websites. Works in local computer or on any server. ioMarks uses responsive design so you can use it from your tablets and smartphones.

As I use bookmarks as long-term memories, I've always forget what I've already bookmarked
and I'm searching same things again and again (and bookmarking them too). So I decided to write tool
which lets me search for content within my bookmarks before performing deep search.

## Live preview
You can check live demo at [iomarks.vaskas.lt](http://iomarks.vaskas.lt)

## Usage
- Create account at [saved.io](http://saved.io);
- at the bottom of saved.io site there are link to generate your API key, generate one and copy it;
- clone this repo;
- in the [js/main.js](https://github.com/andrius-v/ioMarks/blob/master/js/main.js) file replace token string with your API token:
```javascript
// ------ Replace this API token with yours -----
var ioToken = "0ceb21edbfbc00680f9c3c061b5d731a";
// ----------------------------------------------
```
- open [index.html](https://github.com/andrius-v/ioMarks/blob/master/index.html) in browser and search something with some or all categories selected.
