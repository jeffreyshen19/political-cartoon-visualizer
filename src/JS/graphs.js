var margin = {left: 50, right: 20, top: 20, bottom: 40};
var height = 300 - margin.top - margin.bottom,
    width = d3.select("#graphs").node().offsetWidth - margin.left - margin.right;

    var x = d3.scalePoint().rangeRound([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);

var blue = "#0984e3";

var tooltipText;
var thisNode = d3.select("#main-graph");
thisNode.append("svg");
thisNode.append("div").attr("class", "tooltip");

var tooltip = thisNode.select(".tooltip");

//Create the line
var line = d3.line()
  .x(function(d){ return x(d.year);})
  .y(function(d){ return y(d.num);});

var data = [{year: 1900, num: 5}, {year: 2018, num: 10}];

thisNode.select('svg').selectAll("*").remove();

x.domain(data.map(function(d) { return "" + d.year; }));
y.domain([0, d3.max(data, function(d) { return d.num; })]);
x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());

var svg = thisNode.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .on("mousemove", function(){
    var x0 = x.invert(d3.mouse(this)[0]),
        d;

    for(var i = 0; i < data.length; i++) {
      if(data[i].x == x0) {
        d = data[i - 1];
        break;
      }
    }

    var tooltipText = "hi";
    tooltip.classed("hidden", false).html(tooltipText);

    tooltip.style("left", x(d.year) + margin.left - Math.round(tooltip.node().offsetWidth / 2) + "px")
      .style("top", y(d3.max(d.num)) - Math.round(tooltip.node().offsetHeight) - 12 + margin.top + "px");

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
        .attr("cy", function(d){return y(d.num);})
        .attr("r", 5);

//Add the X Axis
svg.append("g")
  .style("font-family", "source_sans_pro")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

//Add the Y Axis
svg.append("g")
  .style("font-family", "source_sans_pro")
  .call(d3.axisLeft(y));

//Label for Y axis
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 10)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-family", "source_sans_pro")
  .style("font-weight", "bold")
  .text("Number of Cartoons");

//Label for X axis
svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
  .style("text-anchor", "middle")
  .style("font-family", "source_sans_pro")
  .style("font-weight", "bold")
  .text("Year");
