$(function() {

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
           .attr("x", d3.event.pageX + 10)
           .attr("y", d3.event.pageY - 100);
     })
     .on("mousemove", function(d) {
        d3.select("text")
          .attr("x", d3.event.pageX + 10)
          .attr("y", d3.event.pageY - 100);
      })
     .on("mouseout", function(d) {
        d3.select(this).classed('active', false).classed('land', true);
        d3.select("text").remove();
      })
     .on("click", function(d) {
        var countryName = names[d.id];
        var country = countryCodes[countryName];
        if (country) {
          $.get("http://charts.spotify.com/api/charts/most_streamed/" + country + "/latest", function(data) {
            var song = data.tracks[0];
            $("#music").empty().append('<a href="' + song.track_url + '">' + song.track_name + '</a>');
          }, "jsonp");
        } else {
          $("#music").empty().append('<p>Sorry, Spotify is not available in ' + countryName);
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