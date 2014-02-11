require 'open-uri'
require 'json'

class Spotify
  attr_reader :song, :country, :url, :title, :artist, :album, :artwork
  def initialize(country)
    @country = country
    @song = JSON.parse(open("http://charts.spotify.com/api/charts/most_shared/" + country + "/latest").first)["tracks"][0]
  end
  def info_hash
    {song["country"] => 
      [
        {"url"     => song["track_url"]}, 
        {"title"   => song["track_name"]}, 
        {"artist"  => song["artist_name"]},
        {"album"   => song["album_name"]},
        {"artwork" => song["artwork_url"]}
      ]
    }
  end
end

class GenerateCountry
  attr_reader :country, :array
  def initialize
    @array = ["au", "es", "us"]
  end
  def choose
    country = array.sample
  end
end

my_country = GenerateCountry.new.choose
my_hash = Spotify.new(my_country).info_hash
puts my_hash.inspect