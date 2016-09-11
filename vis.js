
var margin = {top: 20, right: 10, bottom: 30, left: 200},
    width = 830 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var xScale = d3.scaleLinear().range([0, width]);

var yScale = d3.scaleBand().range([0, height]);

var colScale = d3.scaleOrdinal(d3.schemeCategory20);

var cat1 = [
  {"key":"Health Impacts", "value":"#fee8c8"},
  {"key":"Air Quality", "value": "#fdbb84"},
  {"key":"Water and Sanitation", "value":"#e34a33"},
];

var cat2 = [
  {"key":"Water Resources", "value": "#edf8fb"},
  {"key":"Agriculture", "value":"#bfd3e6"},
  {"key":"Forests", "value":"#9ebcda"},
  {"key":"Fisheries", "value":"#8c96c6"},
  {"key":"Biodiversity and Habitat", "value": "#8856a7"},
  {"key":"Climate and Energy", "value":"#810f7c"}
];

var BAR_WIDTH = 10;

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

var legend1 = d3.select("#legend1");
var legend2 = d3.select("#legend2");

function update(svgChart, myData, attrX, attrY, xAxis, yAxis, legend, colorCategories){
    var fnAccX = function(d) { return d[attrX]; };
    var fnAccY = function(d) { return d[attrY]; };

    var spaceForBar = (height/myData.length) - BAR_WIDTH;

    xScale.domain([0, d3.max(myData, fnAccX)]);
    yScale.domain(myData.map(fnAccY));

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
    	.attr("x", 0)
      .attr("y", function(d,i) {return (spaceForBar/2 + i * (BAR_WIDTH + spaceForBar));})
      .style("fill", function (d) {return setColorByCategory(d.category);})
      .attr("height", BAR_WIDTH)
    	.transition().duration(1000)
    	.attr("width", function(d) {
            var value = xScale(fnAccX(d));
            if(isNaN(value)){
                return 0;
            }
            else {
                return value;
            }
        });

      xAxis.transition()
        .duration(1000)
      	.call(d3.axisTop(xScale).ticks(10));

      yAxis.transition()
        .duration(1000)
      	.call(d3.axisLeft()
      		.scale(yScale).tickArguments(function(d) {return yScale(fnAccY(d));}));

      var group = legend.selectAll("div")
          .data(colorCategories.map(function(d){return d.key;}))
          .enter().append("div")
          .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

      group.append("i")
          .attr("width", 18)
          .attr("height", 18)
          .style("background", function(d,i){
            console.log(colorCategories[i].key + " " + colorCategories[i].value);
            return colorCategories[i].value;}
          );

      group.append("text")
          .style("font-size","9pt")
          .text(function(d,i){return colorCategories[i].key;});
}

function setColorByCategory(category) {
  for (var i=0; i < cat1.length; i++){
    if(cat1[i].key === category){
      return cat1[i].value;
    }
  }
  for (i=0; i < cat2.length; i++){
    if(cat2[i].key === category){
      return cat2[i].value;
    }
  }
}

function selectedCountry(myData) {
  window.location.hash = '#country';
	var country = d3.select("#country");
  country.select("h1").text(myData.Country);

  var rank = d3.select("#rank");
  rank.select("p").text("Overall Rank: " + myData.Rank + "/178");

  var EPI = d3.select("#EPI");
  EPI.select("p").text("EPI Score: " + myData.EPI);

  var change = d3.select("#change");
  change.select("p").text("10-Year Change: " + myData["10-Year Percent Change"] + "%");

  var dataChart1 = [];
  var dataChart2 = [];
  for (var attr in myData["Enviromental Healh"]["Health Impacts"]){
    dataChart1.push( {
      "key":attr,
      "value":myData["Enviromental Healh"]["Health Impacts"][attr],
      "category":"Health Impacts"
    });
  }
  for (attr in myData["Enviromental Healh"]["Air Quality"]){
    dataChart1.push( {
      "key":attr,
      "value":myData["Enviromental Healh"]["Air Quality"][attr],
      "category":"Air Quality"
    });
  }
  for (attr in myData["Enviromental Healh"]["Water and Sanitation"]){
    dataChart1.push( {
      "key":attr,
      "value":myData["Enviromental Healh"]["Water and Sanitation"][attr],
      "category":"Water and Sanitation"
    });
  }
  for (attr in myData["Ecosystem Vitality"]["Water Resources"]){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"]["Water Resources"][attr],
      "category":"Water Resources"
    });
  }
  for (attr in myData["Ecosystem Vitality"].Agriculture){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"].Agriculture[attr],
      "category":"Agriculture"
    });
  }
  for (attr in myData["Ecosystem Vitality"].Forests){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"].Forests[attr],
      "category":"Forests"
    });
  }
  for (attr in myData["Ecosystem Vitality"].Fisheries){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"].Fisheries[attr],
      "category":"Fisheries"
    });
  }
  for (attr in myData["Ecosystem Vitality"]["Biodiversity and Habitat"]){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"]["Biodiversity and Habitat"][attr],
      "category":"Biodiversity and Habitat"
    });
  }
  for (attr in myData["Ecosystem Vitality"]["Climate and Energy"]){
    dataChart2.push( {
      "key":attr,
      "value":myData["Ecosystem Vitality"]["Climate and Energy"][attr],
      "category":"Climate and Energy"
    });
  }
  var title1 = d3.select("#titleChart1").select("p")
    .text("Enviromental Healh Score: " + myData["Enviromental Healh"].Value);
  var title2 = d3.select("#titleChart2").select("p")
    .text("Ecosystem Vitality Score: " + myData["Ecosystem Vitality"].Value);

  update(svg1, dataChart1, "value", "key", xAxis1, yAxis1, legend1, cat1);
  update(svg2, dataChart2, "value", "key", xAxis2, yAxis2, legend2, cat2);

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
          d.properties.indicators["Enviromental Healh"]["Health Impacts"] = {};
          d.properties.indicators["Enviromental Healh"]["Air Quality"] = {};
          d.properties.indicators["Enviromental Healh"]["Water and Sanitation"] = {};
          d.properties.indicators["Ecosystem Vitality"]["Water Resources"] = {};
          d.properties.indicators["Ecosystem Vitality"].Agriculture = {};
          d.properties.indicators["Ecosystem Vitality"].Forests = {};
          d.properties.indicators["Ecosystem Vitality"].Fisheries = {};
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"] = {};
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"] = {};
          d.properties.indicators["Enviromental Healh"]["Health Impacts"]["Child Mortality"] = +e["Child Mortality"];
          d.properties.indicators["Enviromental Healh"]["Air Quality"]["Household Air Quality"] = +e["Household Air Quality"];
          d.properties.indicators["Enviromental Healh"]["Air Quality"]["Air Pollution - Average Exposure to PM2.5"] = +e["Air Pollution - Average Exposure to PM2.5"];
          d.properties.indicators["Enviromental Healh"]["Air Quality"]["Air Pollution - Average PM2.5 Exceedance"] = +e["Air Pollution - Average PM2.5 Exceedance"];
          d.properties.indicators["Enviromental Healh"]["Water and Sanitation"]["Access to Sanitation"] = +e["Access to Sanitation"];
          d.properties.indicators["Enviromental Healh"]["Water and Sanitation"]["Access to Drinking Water"] = +e["Access to Drinking Water"];
          d.properties.indicators["Ecosystem Vitality"]["Water Resources"]["Wastewater Treatment"] = +e["Wastewater Treatment"];
          d.properties.indicators["Ecosystem Vitality"].Agriculture["Agricultural Subsidies"] = +e["Agricultural Subsidies"];
          d.properties.indicators["Ecosystem Vitality"].Agriculture["Pesticide Regulation"] = +e["Pesticide Regulation"];
          d.properties.indicators["Ecosystem Vitality"].Forests["Change in Forest Cover "] = +e["Change in Forest Cover "];
          d.properties.indicators["Ecosystem Vitality"].Fisheries["Fish Stocks"] = +e["Fish Stocks"];
          d.properties.indicators["Ecosystem Vitality"].Fisheries["Coastal Shelf Fishing Pressure"] = +e["Coastal Shelf Fishing Pressure"];
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"]["Terrestrial Protected Areas (National Biome Weights)"] = +e["Terrestrial Protected Areas (National Biome Weights)"];
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"]["Terrestrial Protected Areas (Global Biome Weights)"] = +e["Terrestrial Protected Areas (Global Biome Weights)"];
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"]["Marine Protected Areas"] = +e["Marine Protected Areas"];
          d.properties.indicators["Ecosystem Vitality"]["Biodiversity and Habitat"]["Critical Habitat Protection"] = +e["Critical Habitat Protection"];
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"]["Trend in Carbon Intensity"] = +e["Trend in Carbon Intensity"];
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"]["Change of Trend in Carbon Intensity"] = +e["Change of Trend in Carbon Intensity"];
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"]["Trend in CO2 Emissions per KwH"] = +e["Trend in CO2 Emissions per KwH"];
          d.properties.indicators["Ecosystem Vitality"]["Climate and Energy"]["Access to Electricity"] = +e["Access to Electricity"];
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
    	var div = L.DomUtil.create('div', 'legend'),
      	values = [10,20,30,40,50,60,70,80,90];
      div.innerHTML += 'EPI SCORE<br>';
      for (var i = 0; i < values.length; i++) {
      	div.innerHTML +=
        	'<i style="background:' + setColorByForLegend(values[i] + 1) + '"></i> '+ values[i] + (values[i + 1] ? ' &ndash; ' + values[i + 1] +'<br>' : '+');
      }
      return div;
    };
    legend.addTo(map);
	});

  function setColorByForLegend(epi) {
    if (epi > 90) return "#1a9850";
    else if (epi > 80) return "#66bd63";
    else if (epi > 70) return "#a6d96a";
    else if (epi> 60) return "#d9ef8b";
    else if (epi > 50) return "#ffffbf";
    else if (epi > 40) return "#fee08b";
    else if (epi > 30) return "#fdae61";
    else if (epi > 20) return "#f46d43";
    else if (epi > 10) return "#d73027";
  }

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
