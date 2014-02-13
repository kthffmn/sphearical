var string = "https://play.spotify.com/track/3cHyrEgdyYRjgJKSOiOtcS";
var myReg = /track\/(.+)/g;
var array = myReg.exec(string);
var trackNum = array[1];
'<iframe src="https://embed.spotify.com/?uri=spotify:track:' + trackNum + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'