var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var xScale = d3.scaleBand()
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
  	.attr("y", function(d) {
        return (yScale(fnAccY(d)));
      })
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
  window.location.hash = '#detail';
	var info = d3.select("#detail");
  var myDataArray = [];

  for (var attr in myData) {
    myDataArray.push( {"key":attr, "value":myData[attr]} );
  }

  info.select("h1").text(myData.Country);

	var infoCountry =  info.selectAll(".legendRow")
  	.data(myDataArray);

  //Enter
	var infoCountryEnter =  infoCountry.enter()
  	.append("div")
    .attr("class", "legendRow");

  infoCountry
    .merge(infoCountryEnter)
    .style("font-size", "12pt" )
  	.text(function (d) { return d.key + ": " + d.value; });

  infoCountry.exit().remove();
}

d3.csv("epi2014.csv", function(err, data) {
  if(err) {
  	console.err(err);
    alert(err);
    return;
  }

  data.forEach(function (d) {
    d["EPI Score"]=+d["EPI Score"];
  });

	$.getJSON("world.json",function(worldMap){

    worldMap.features.forEach(function(d){
      data.forEach(function (e){
        if(d.properties.name === e.Country){
          d.properties.indicators = {};
          d.properties.indicators.Country = e.Country;
          d.properties.indicators.Rank = +e.Rank;
          d.properties.indicators.EPI = +e["EPI Score"];
          d.properties.indicators["10-Year Percent Change"] = +e["10-Year Percent Change"];
          d.properties.indicators.EnviromentalHealh = {};
          d.properties.indicators.EcosystemVitality = {};
          d.properties.indicators.EnviromentalHealh.Value = +e["Environmental Health"];
          d.properties.indicators.EcosystemVitality.Value = +e["Ecosystem Vitality"];
          d.properties.indicators.EnviromentalHealh["Health Impacts"] = +e["EH - Health Impacts"];
          d.properties.indicators.EnviromentalHealh["Air Quality"] = +e["EH - Air Quality"];
          d.properties.indicators.EnviromentalHealh["Water and Sanitation"] = +e["EH -Water and Sanitation"];
          d.properties.indicators.EcosystemVitality["Water Resources"] = +e["EV - Water Resources"];
          d.properties.indicators.EcosystemVitality.Agriculture = +e["EV - Agriculture"];
          d.properties.indicators.EcosystemVitality.Forests = +e["EV - Forests"];
          d.properties.indicators.EcosystemVitality.Fisheries = +e["EV - Fisheries"];
          d.properties.indicators.EcosystemVitality["Biodiversity and Habitat"] = +e["EV- Biodiversity and Habitat"];
          d.properties.indicators.EcosystemVitality["Climate and Energy"] = +e["EV - Climate and Energy"];
          d.properties.indicators.EnviromentalHealh["Child Mortality"] = +e["Child Mortality"];
          d.properties.indicators.EnviromentalHealh["Household Air Quality"] = +e["Household Air Quality"];
          d.properties.indicators.EnviromentalHealh["Air Pollution - Average Exposure to PM2.5"] = +e["Air Pollution - Average Exposure to PM2.5"];
          d.properties.indicators.EnviromentalHealh["Air Pollution - Average PM2.5 Exceedance"] = +e["Air Pollution - Average PM2.5 Exceedance"];
          d.properties.indicators.EnviromentalHealh["Access to Sanitation"] = +e["Access to Sanitation"];
          d.properties.indicators.EnviromentalHealh["Access to Drinking Water"] = +e["Access to Drinking Water"];
          d.properties.indicators.EcosystemVitality["Wastewater Treatment"] = +e["Wastewater Treatment"];
          d.properties.indicators.EcosystemVitality["Agricultural Subsidies"] = +e["Agricultural Subsidies"];
          d.properties.indicators.EcosystemVitality["Pesticide Regulation"] = +e["Pesticide Regulation"];
          d.properties.indicators.EcosystemVitality["Change in Forest Cover "] = +e["Change in Forest Cover "];
          d.properties.indicators.EcosystemVitality["Fish Stocks"] = +e["Fish Stocks"];
          d.properties.indicators.EcosystemVitality["Coastal Shelf Fishing Pressure"] = +e["Coastal Shelf Fishing Pressure"];
          d.properties.indicators.EcosystemVitality["Terrestrial Protected Areas (National Biome Weights)"] = +e["Terrestrial Protected Areas (National Biome Weights)"];
          d.properties.indicators.EcosystemVitality["Terrestrial Protected Areas (Global Biome Weights)"] = +e["Terrestrial Protected Areas (Global Biome Weights)"];
          d.properties.indicators.EcosystemVitality["Marine Protected Areas"] = +e["Marine Protected Areas"];
          d.properties.indicators.EcosystemVitality["Critical Habitat Protection"] = +e["Critical Habitat Protection"];
          d.properties.indicators.EcosystemVitality["Trend in Carbon Intensity"] = +e["Trend in Carbon Intensity"];
          d.properties.indicators.EcosystemVitality["Change of Trend in Carbon Intensity"] = +e["Change of Trend in Carbon Intensity"];
          d.properties.indicators.EcosystemVitality["Trend in CO2 Emissions per KwH"] = +e["Trend in CO2 Emissions per KwH"];
          d.properties.indicators.EcosystemVitality["Access to Electricity"] = +e["Access to Electricity"];
        }
      })
    });

		var map = L.map('map', { zoomControl:false }).setView([39, -1], 1.8);
    map.dragging.disable();
    map.scrollWheelZoom.disable();
		var layer = L.geoJson(worldMap, {
			clickable: true,
			style: function(feature) {
        return {
          stroke: true,
          color: "#0d174e",
          weight: 1,
          fill: true,
          fillColor: setColorByEPI(feature.properties.indicators),
          fillOpacity: 1
        };
      },
      onEachFeature: function (feature, layer) {
    		layer.on({
        	click: function(e) {selectedCountry(e.target.feature.properties.indicators);}
    		});
			},
    });
    layer.addTo(map);
    var legend = L.control({
    	position: 'bottomleft'
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


  function setColorByEPI(indicators) {
    if (indicators === undefined) return "#d9ef8b";
    else if (indicators.EPI > 90) return "#1a9850";
    else if (indicators.EPI > 80) return "#66bd63";
    else if (indicators.EPI > 70) return "#a6d96a";
    else if (indicators.EPI > 60) return "#d9ef8b";
    else if (indicators.EPI > 50) return "#ffffbf";
    else if (indicators.EPI > 40) return "#fee08b";
    else if (indicators.EPI > 30) return "#fdae61";
    else if (indicators.EPI > 20) return "#f46d43";
    else if (indicators.EPI > 10) return "#d73027";
  }


});
