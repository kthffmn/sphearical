require 'open-uri'
require 'json'

class Spotify
  attr_reader :song, :country, :url, :title, :artist, :album, :artwork

  def initialize(country)
    @country = country
    @song = JSON.load(open("http://charts.spotify.com/api/charts/most_streamed/" + @country + "/latest"))["tracks"][0]
  end

  def info_hash
    {:country => song["country"], 
    :url     => song["track_url"], 
    :title   => song["track_name"],
    :artist  => song["artist_name"],
    :album   => song["album_name"],
    :artwork => song["artwork_url"]}
  end

end
