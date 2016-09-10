var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var xScale = d3.scaleBand()
	.range([0, width]);

var yScale = d3.scaleLinear()
	.range([height,0]);

var colScale = d3.scaleOrdinal(d3.schemeCategory20);

var BAR_WIDTH = 30;

var svg1 = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis1 = svg1.append("g")
	.attr("class", "axis x--axis");
var yAxis1 = svg1.append("g")
	.attr("class", "axis y--axis");

var xAxis2 = svg2.append("g")
	.attr("class", "axis x--axis");
var yAxis2 = svg2.append("g")
	.attr("class", "axis y--axis");

function update(svgChart, myData, attrX, attrY, xAxis, yAxis) {

	var fnAccX = function(d) { return d[attrX]; };
  var fnAccY = function(d) { return d[attrY]; };

  var spaceForBar = (width/myData.length) - BAR_WIDTH;

	xScale.domain(myData.map(fnAccX));
  yScale.domain([0, d3.max(myData, fnAccY) ]);

	var bars = svgChart.selectAll(".bars")
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
  	.attr("x", function(d,i) {return (spaceForBar/2 + i * (BAR_WIDTH + spaceForBar));})
    .attr("y", height)
    .style("fill", function(d,i) { return colScale(i); })
    .attr("width", BAR_WIDTH)
  	.transition().duration(1000)
  	.attr("y", function(d) {
        return (yScale(fnAccY(d)));
      })
    .attr("height", function(d) {return (height - yScale(fnAccY(d))); });

  xAxis
  	.transition()
    .duration(1000)
  	.call(d3.axisBottom(xScale)
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

  var dataChart1 = [];
  for (var attr1 in myData["Enviromental Healh"]) {
    dataChart1.push( {"key":attr1, "value":myData["Enviromental Healh"][attr1]} );
  }

  var dataChart2 = [];
  for (var attr2 in myData["Ecosystem Vitality"]) {
    dataChart2.push( {"key":attr2, "value":myData["Ecosystem Vitality"][attr2]} );
  }

  console.log(dataChart1);
  update(svg1, dataChart1, "key", "value", xAxis1, yAxis1);
  update(svg2, dataChart2, "key", "value", xAxis2, yAxis2);

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
  	.text(function (d) {
      if (typeof(d.value) === "object"){
        return d.key + ": " + d.value.Value;
      }
      return d.key + ": " + d.value;
    });

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
        if(d.properties.name.indexOf(e.Country) !== -1 || e.Country.indexOf(d.properties.name) !== -1 ){
          d.properties.indicators = {};
          d.properties.indicators.Country = e.Country;
          d.properties.indicators.Rank = +e.Rank;
          d.properties.indicators.EPI = +e["EPI Score"];
          d.properties.indicators["10-Year Percent Change"] = +e["10-Year Percent Change"];
          d.properties.indicators["Enviromental Healh"] = {};
          d.properties.indicators["Ecosystem Vitality"] = {};
          d.properties.indicators["Enviromental Healh"].Value = +e["Environmental Health"];
          d.properties.indicators["Ecosystem Vitality"].Value = +e["Ecosystem Vitality"];
          d.properties.indicators["Enviromental Healh"]["Health Impacts"] = +e["EH - Health Impacts"];
          d.properties.indicators["Enviromental Healh"]["Air Quality"] = +e["EH - Air Quality"];
          d.properties.indicators["Enviromental Healh"]["Water and Sanitation"] = +e["EH -Water and Sanitation"];
          d.properties.indicators["Ecosystem Vitality"]["Water Resources"] = +e["EV - Water Resources"];
          d.properties.indicators["Ecosystem Vitality"].Agriculture = +e["EV - Agriculture"];
          d.properties.indicators["Ecosystem Vitality"].Forests = +e["EV - Forests"];
          d.properties.indicators["Ecosystem Vitality"].Fisheries = +e["EV - Fisheries"];
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"] = +e["EV- Biodiversity and Habitat"];
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"] = +e["EV - Climate and Energy"];
          d.properties.indicators["Enviromental Healh"]["Child Mortality"] = +e["Child Mortality"];
          d.properties.indicators["Enviromental Healh"]["Household Air Quality"] = +e["Household Air Quality"];
          d.properties.indicators["Enviromental Healh"]["Air Pollution - Average Exposure to PM2.5"] = +e["Air Pollution - Average Exposure to PM2.5"];
          d.properties.indicators["Enviromental Healh"]["Air Pollution - Average PM2.5 Exceedance"] = +e["Air Pollution - Average PM2.5 Exceedance"];
          d.properties.indicators["Enviromental Healh"]["Access to Sanitation"] = +e["Access to Sanitation"];
          d.properties.indicators["Enviromental Healh"]["Access to Drinking Water"] = +e["Access to Drinking Water"];
          d.properties.indicators["Ecosystem Vitality"]["Wastewater Treatment"] = +e["Wastewater Treatment"];
          d.properties.indicators["Ecosystem Vitality"]["Agricultural Subsidies"] = +e["Agricultural Subsidies"];
          d.properties.indicators["Ecosystem Vitality"]["Pesticide Regulation"] = +e["Pesticide Regulation"];
          d.properties.indicators["Ecosystem Vitality"]["Change in Forest Cover "] = +e["Change in Forest Cover "];
          d.properties.indicators["Ecosystem Vitality"]["Fish Stocks"] = +e["Fish Stocks"];
          d.properties.indicators["Ecosystem Vitality"]["Coastal Shelf Fishing Pressure"] = +e["Coastal Shelf Fishing Pressure"];
          d.properties.indicators["Ecosystem Vitality"]["Terrestrial Protected Areas (National Biome Weights)"] = +e["Terrestrial Protected Areas (National Biome Weights)"];
          d.properties.indicators["Ecosystem Vitality"]["Terrestrial Protected Areas (Global Biome Weights)"] = +e["Terrestrial Protected Areas (Global Biome Weights)"];
          d.properties.indicators["Ecosystem Vitality"]["Marine Protected Areas"] = +e["Marine Protected Areas"];
          d.properties.indicators["Ecosystem Vitality"]["Critical Habitat Protection"] = +e["Critical Habitat Protection"];
          d.properties.indicators["Ecosystem Vitality"]["Trend in Carbon Intensity"] = +e["Trend in Carbon Intensity"];
          d.properties.indicators["Ecosystem Vitality"]["Change of Trend in Carbon Intensity"] = +e["Change of Trend in Carbon Intensity"];
          d.properties.indicators["Ecosystem Vitality"]["Trend in CO2 Emissions per KwH"] = +e["Trend in CO2 Emissions per KwH"];
          d.properties.indicators["Ecosystem Vitality"]["Access to Electricity"] = +e["Access to Electricity"];
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
        	click: function(e) {
            if (e.target.feature.properties.indicators === undefined){
              console.log(feature);
            }
            selectedCountry(e.target.feature.properties.indicators);
          }
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
    if (indicators === undefined) return "#ffffbf";
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
