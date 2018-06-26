var margin = {left: 70, right: 20, top: 30, bottom: 50};
var blue = "#0984e3";

function drawGraph(data){
  var height = 300 - margin.top - margin.bottom,
      width = d3.select("#graphs").node().offsetWidth - margin.left - margin.right;

  var x = d3.scalePoint().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var thisNode = d3.select("#main-graph");
  thisNode.append("svg");
  thisNode.append("div").attr("class", "tooltip");
  thisNode.select('svg').selectAll("*").remove();

  var tooltip = thisNode.select(".tooltip"),
      tooltipText;

  var line = d3.line()
    .x(function(d){ return x(d.year);})
    .y(function(d){ return y(d.cartoons.length);});

    x.domain(data.map(function(d) { return "" + d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.cartoons.length; })]);
    x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());

  var svg = thisNode.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .on("mousemove", function(){
      //TODO: add tooltip
    })
    .on("mouseout", function(d){
      var e = d3.event.toElement;
      if(e && e.parentNode.parentNode != this.parentNode && e.parentNode != this.parentNode && e != this.parentNode) tooltip.classed("hidden", true);
    })
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", blue)
    .style("stroke-width", "2px")
    .style("fill", "none")
    .attr("d", line);

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .style("fill", blue)
      .attr("cx", function(d){return x(d.year);})
      .attr("cy", function(d){return y(d.cartoons.length);})
      .attr("r", 5);

  //Add the X Axis
  svg.append("g")
    .style("font-family", "Libre_Baskerville")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //Add the Y Axis
  svg.append("g")
    .style("font-family", "Libre_Baskerville")
    .call(d3.axisLeft(y));

  //Label for Y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-family", "Libre_Baskerville")
    .style("font-weight", "bold")
    .text("Number of Cartoons");

  //Label for X axis
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .style("font-family", "Libre_Baskerville")
    .style("font-weight", "bold")
    .text("Year");
}
