var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var xScale = d3.scaleOrdinal()
	.range([0, width]);

var yScale = d3.scaleLinear()
	.range([height,0]);

var colScale = d3.scaleOrdinal(d3.schemeCategory20);

var BAR_HEIGHT = 4;

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = svg.append("g")
	.attr("class", "axis x--axis");
var yAxis = svg.append("g")
	.attr("class", "axis y--axis");


function filter(myData, attr, value) {
	myData = myData.filter(function (d) {
  	return d[attr] = value;
  });
}

function update(myData, attrX, attrY) {

	var fnAccX = function(d) { return d[attrX]; };
  var fnAccY = function(d) { return d[attrY]; };

	xScale.domain(myData.map(fnAccX));
  yScale.domain([0, d3.max(myData, fnAccY) ]);

	var bars = svg.selectAll(".bars")
  	.data(myData);

  //Enter
  var barsEnter = bars.enter()
  	.append("rect")
    .attr("class", "bars")
    .attr("width", 0);

  //Exit
 	bars.exit()
  	.transition()
    .duration(1000)
    .attr("width", 0)
  	.remove();

  //Update
  bars.merge(barsEnter)
  	.attr("x", function(d,i) {return i * (BAR_HEIGHT+1);})
    .attr("y", height)
    .style("fill", function(d,i) { return colScale(i); })
    .attr("width", 2)
  	.transition().duration(1000)
  	.attr("y", function(d) {return (yScale(fnAccY(d))); })
    .attr("height", function(d) {return (height - yScale(fnAccY(d))); });

  xAxis
  	.transition()
    .duration(1000)
  	.call(d3.axisBottom()
  		.scale(xScale)
      .tickArguments(function(d) {return xScale(fnAccX(d));}));

  yAxis
  	.transition()
    .duration(1000)
  	.call(d3.axisLeft()
  		.scale(yScale)
    	.ticks(10));
}

function selectedCountry(myData) {
  console.log(myData);
	var info = d3.select("#info");
	var infoCountry =  info.selectAll("h1")
  	.data(myData);

  //Enter
	var infoCountryEnter =  infoCountry.enter()
  	.append("h1");

  infoCountry
    .merge(infoCountryEnter)
    .style("font-size", "30" )
  	.text(myData.name);

  infoCountry.exit().remove();
}

d3.csv("epi2014.csv", function(err, data) {
  if(err) {
  	console.err(err);
    alert(err);
    return;
  }

	$.getJSON("world.json",function(worldMap){

    worldMap.features.forEach(function(d){
      data.forEach(function (e){
        if(d.properties.name === e.Country){
          d.properties.Rank = e.Rank;
          d.properties.EPI = e["EPI Score"];
          d.properties["10-Year Percent Change"] = e["10-Year Percent Change"];
          d.properties["Environmental Health"] = e["Environmental Health"];
          d.properties["Ecosystem Vitality"] = e["Ecosystem Vitality"];
          d.properties["EH - Health Impacts"] = e["EH - Health Impacts"];
          d.properties["EH - Air Quality"] = e["EH - Air Quality"];
          d.properties["EH -Water and Sanitation"] = e["EH -Water and Sanitation"];
          d.properties["EV - Water Resources"] = e["EV - Water Resources"];
          d.properties["EV - Agriculture"] = e["EV - Agriculture"];
          d.properties["EV - Forests"] = e["EV - Forests"];
          d.properties["EV - Fisheries"] = e["EV - Fisheries"];
          d.properties["EV- Biodiversity and Habitat"] = e["EV- Biodiversity and Habitat"];
          d.properties["EV - Climate and Energy"] = e["EV - Climate and Energy"];
          d.properties["Child Mortality"] = e["Child Mortality"];
          d.properties["Household Air Quality"] = e["Household Air Quality"];
          d.properties["Air Pollution - Average Exposure to PM2.5"] = e["Air Pollution - Average Exposure to PM2.5"];
          d.properties["Air Pollution - Average PM2.5 Exceedance"] = e["Air Pollution - Average PM2.5 Exceedance"];
          d.properties["Access to Sanitation"] = e["Access to Sanitation"];
          d.properties["Access to Drinking Water"] = e["Access to Drinking Water"];
          d.properties["Wastewater Treatment"] = e["Wastewater Treatment"];
        }
      })
    });

		var map = L.map('map').setView([39, -1], 1.6);
		var layer = L.geoJson(worldMap, {
			clickable: true,
			style: function(feature) {
        return {
          stroke: true,
          color: "#0d174e",
          weight: 1,
          fill: true,
          fillColor: setColorByEPI(feature.properties.EPI),
          fillOpacity: 1
        };
      },
      onEachFeature: function (feature, layer) {
    		layer.on({
        	click: function(e) {selectedCountry(e.target.feature.properties);}
    		});
			},
    });
    layer.addTo(map);
    var legend = L.control({
    	position: 'topleft'
    });
    legend.onAdd = function() {
    	var div = L.DomUtil.create('div', 'Legend'),
      	values = [10,20,30,40,50,60,70,80,90];
      div.innerHTML += 'EPI SCORE<br>';
      for (var i = 0; i < values.length; i++) {
      	div.innerHTML +=
        	'<i style="background:' + setColorByEPI(values[i] + 1) + '"></i> ' 									+ values[i] + (values[i + 1] ? ' &ndash; ' + values[i + 1] + 												'<br>' : '+');
      }
      return div;
    };
    legend.addTo(map);
	});


  function setColorByEPI(epiScore) {
    if (epiScore === undefined) return "#d9ef8b";
    else if (epiScore > 90) return "#1a9850";
    else if (epiScore > 80) return "#66bd63";
    else if (epiScore > 70) return "#a6d96a";
    else if (epiScore > 60) return "#d9ef8b";
    else if (epiScore > 50) return "#ffffbf";
    else if (epiScore > 40) return "#fee08b";
    else if (epiScore > 30) return "#fdae61";
    else if (epiScore > 20) return "#f46d43";
    else if (epiScore > 10) return "#d73027";
  }
});
