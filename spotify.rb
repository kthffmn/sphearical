require 'open-uri'
require 'json'

class Spotify
  attr_reader :country, :url, :title, :artist, :album, :artwork

  def initialize(country)
    @country = country
    song = JSON.parse(open("http://charts.spotify.com/api/charts/most_shared/" + country + "/latest").first)["tracks"][0]
    @url = song["track_url"]
    @title = song["track_name"]
    @artist = song["artist_name"]
    @album = song["album_name"]
    @artwork = song["artwork_url"]
  end
  
end