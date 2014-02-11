require 'open-uri'
require 'json'

hash = JSON.parse(open("http://charts.spotify.com/api/charts/most_shared/es/latest").first)
song = hash["tracks"][0]

# song = {
#
#       "date"=>"2014-02-09", 
#       "country"=>"ES", 
#       "track_url"=>"https://play.spotify.com/track/77FoFBReRTPrYr3Ul5He1n", 
#       "track_name"=>"Monteperdido", 
#       "artist_name"=>"Carlos Sadness", 
#       "artist_url"=>"https://play.spotify.com/artist/2LCcy9CZWwZ7Vvykt8IVVq", 
#       "album_name"=>"Monteperdido", 
#       "album_url"=>"https://play.spotify.com/album/4enSPnojjMXibtfd5454gq", 
#       "artwork_url"=>"http://o.scdn.co/300/249a1fc127bf96707058af45d7de675b5e189849", 
#       "num_streams"=>18823
#
#         }