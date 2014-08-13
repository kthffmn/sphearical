$(function() {

var countryName;

var width = 800,
    height = 800;

var projection = d3.geo.orthographic()
                       .scale(350)
                       .translate([width/2, height/2])
                       .clipAngle(90);

var path = d3.geo.path().projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);

var names = {};

var countryCodes = {};

svg.append("path")
   .datum({type: "Sphere"})
   .attr("id", "globe")
   .attr("d", path);

queue()
.defer(d3.json, "world.json")
.defer(d3.tsv, "countryNumbers.tsv")
.defer(d3.tsv, "countryAbbreviations.tsv")
.await(ready);



function ready(error, world, countries, abbreviations) {
  countries.forEach(function(d) {
    names[d.id] = d.name;
  });

  abbreviations.forEach(function(d) {
    countryCodes[d.name] = d.abb;
  });

  svg.selectAll("path.land")
     .data(topojson.feature(world, world.objects.countries).features)
     .enter().append("path")
     .attr("class", "land")
     .attr("cursor", "pointer")
     .attr("d", path)
     .on("mouseover", function(d) {
        d3.select(this).attr("class", "active");
        svg.append("text")
           .text(names[d.id])
           .attr("x", d3.event.pageX - 127)
           .attr("y", d3.event.pageY + 25);
     })
     .on("mousemove", function(d) {
        d3.select("text")
          .attr("x", d3.event.pageX - 127)
          .attr("y", d3.event.pageY + 25);
      })
     .on("mouseout", function(d) {
        d3.select(this).classed('active', false).classed('land', true);
        d3.select("text").remove();
      })
     .on("click", function(d) {
        countryName = names[d.id];
        var country = countryCodes[countryName];
        if (country) {
          var country_url =  "http://charts.spotify.com/api/tracks/most_streamed/" + country + "/weekly/latest"
          $.ajax({
            url : country_url,
            dataType : "jsonp",
            success : function(data) {
              var song = data.tracks[0];
              var url = song.track_url;
              var myReg = /track\/(.+)/g;
              var trackNum = myReg.exec(url)[1];
              $("#music").empty().append('<p class="countryName">#1 streamed track in ' + countryName + ' is:</p><iframe src="https://embed.spotify.com/?uri=spotify:track:' + trackNum + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
            }
          });
        } else {
          $("#music").empty().append('<p>Sorry, Spotify is not available in ' + countryName + '</p>');
        }
     });

  svg.insert("path", ".graticule")
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  svg.call(drag);
}

var drag = d3.behavior.drag().on('drag', function() {
  var start = { 
    lon: projection.rotate()[0], 
    lat: projection.rotate()[1]
  },

  delta = { 
    x: d3.event.dx,
    y: d3.event.dy  
  },
    
  scale = 0.25,

  end = { 
    lon: start.lon + delta.x * scale, 
    lat: start.lat - delta.y * scale 
  };

  end.lat = end.lat >  30 ?  30 :
            end.lat < -30 ? -30 :
            end.lat;
  
  projection.rotate([end.lon,end.lat]);

  svg.selectAll("path").attr("d", path);
});

});
