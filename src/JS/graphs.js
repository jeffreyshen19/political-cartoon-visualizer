/*
  Draws the data visualizations
  Jeffrey Shen
*/

var margin = {left: 70, right: 20, top: 50, bottom: 50};
var blue = "#0984e3";

//Draws the line chart
function drawGraph(data){
  var height = 250 - margin.top - margin.bottom,
      width = d3.select("#graphs").node().offsetWidth - margin.left - margin.right;

  var x = d3.scalePoint().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var checked = document.getElementById("scale-graph").checked;

  var thisNode = d3.select("#main-graph");

  thisNode.select('svg').selectAll("*").remove();
  thisNode.select('svg')
    .append("line")
      .attr("class", "tooltip-line hidden")
      .attr("x1", x(0))
      .attr("y1", y(0) + margin.top)
      .attr("x2", x(0))
      .attr("y2", margin.top)
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");

  thisNode.append("div")
    .attr("class", "tooltip hidden")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "10px")
    .style("bottom", "70px")
    .style("white-space", "nowrap");

  var tooltip = thisNode.select(".tooltip"),
      tooltipLine = thisNode.select(".tooltip-line");

  var line = d3.line()
    .x(function(d){ return x(d.year);})
    .y(function(d, i){ return y(checked ? d.cartoons.length / originalData[i].cartoons.length: d.cartoons.length);});

    x.domain(data.map(function(d) { return "" + d.year; }));
    y.domain([0, d3.max(data, function(d, i) { return (checked ? d.cartoons.length / originalData[i].cartoons.length: d.cartoons.length); })]);
    x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());

  //Add the event markers
  var e = document.getElementById("select-subject");
  var subject = e.options[e.selectedIndex];
  subject = subject ? subject.value : "Everything";

  var specificEventData = [];
  for(var i = 0; i < eventData.length; i++){
    if(eventData[i].subject == subject){
      specificEventData = eventData[i].data;
      break;
    }
  }

  var eventSelection = thisNode.select('svg').selectAll("g")
    .data(specificEventData).enter().append("g");

  eventSelection.append("line").attr("x1", function(d){return x(d.year) + margin.left;})
    .attr("x2", function(d){return x(d.year) + margin.left;})
    .attr("y1", y(0) + margin.top)
    .attr("y2", function(d, i){return 15;})
    .style("stroke", "black")
    .style("stroke-width", "1");
  eventSelection.append("text")
    .html(function(d){
      return d.name.split("\n").map(function(el){
        return "<tspan x = '" + (x(d.year) + margin.left + 10) + "' dy = '15px'>" + el + "</tspan>";
      }).join("");
    })
    .attr("x", function(d){return x(d.year) + margin.left + 10;})
    .attr("y", function(d, i){return 10;});

  var svg = thisNode.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  thisNode.on("mousemove", function(){
    var x0 = x.invert(d3.mouse(this)[0] - margin.left),
        d;

    for(var i = 0; i < data.length; i++) {
      if(data[i].year == x0) {
        d = data[i];
        break;
      }
    }

    tooltip.classed("hidden", false)
      .html("<h3>" + d.year + " (" + d.cartoons.length + " cartoons)</h3>" + (!subject || subject == "Everything" ? "<p>Most common subjects:</p><ul>" + d.subjects.map(function(subject){
        return "<li>" + stylize(subject.subject) + " (" + subject.occurences + ")</li>";
      }).join("") + "</ul>" : ""))
      .style("left", (20 + x(d.year) + tooltip.node().offsetWidth > width ? x(d.year) + margin.left - 20 - tooltip.node().offsetWidth : x(d.year) + margin.left + 20) + "px");

    tooltipLine.attr("x1", x(d.year) + margin.left)
      .attr("x2", x(d.year) + margin.left)
      .classed("hidden", false);
  })
  .on("mouseout", function(d){
    var e = d3.event.toElement;
    if(e && e.parentNode.parentNode != this.parentNode && e.parentNode != this.parentNode && e != this.parentNode) {
      tooltip.classed("hidden", true);
      tooltipLine.classed("hidden", true);
    }
  });

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
      .attr("cy", function(d, i){return y(checked ? d.cartoons.length / originalData[i].cartoons.length: d.cartoons.length);})
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
    .text("Number of Cartoons" + (checked ? " (Scaled)" : ""));

  //Label for X axis
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .style("font-family", "Libre_Baskerville")
    .style("font-weight", "bold")
    .text("Year");
}
