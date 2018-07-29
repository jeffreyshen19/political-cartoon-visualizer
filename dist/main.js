/*
  Draws the data visualizations
  Jeffrey Shen
*/

var margin = {left: 70, right: 20, top: 30, bottom: 50};
var blue = "#0984e3";

//Draws the line chart
function drawGraph(data){
  var height = 300 - margin.top - margin.bottom,
      width = d3.select("#graphs").node().offsetWidth - margin.left - margin.right;

  var x = d3.scalePoint().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

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
    .y(function(d){ return y(d.cartoons.length);});

    x.domain(data.map(function(d) { return "" + d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.cartoons.length; })]);
    x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());

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
      .html("<h3>" + d.year + "</h3><p>" + d.cartoons.length + " cartoons</p>")
      .style("left", (20 + x(d.year) + tooltip.node().offsetWidth > width ? x(d.year) + margin.left - 20 - tooltip.node().offsetWidth : x(d.year) + margin.left + 20) + "px");

    tooltipLine.attr("x1", x(d.year) + margin.left)
      .attr("x2", x(d.year) + margin.left)
      .classed("hidden", false);


    //TODO: add the subjects for each yea
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

/*
  Controls the cartoon image slideshow
  Jeffrey Shen
*/

//Trims up a title for display
function truncate(str){
  return str.replace(/\[|\]/g, "").substring(0, 20) + "...";
}

function updateSlideshow(data){
  var images = [];
  data.forEach(function(year){
    year.cartoons.forEach(function(cartoon){
      images.push(cartoon);
    });
  });

  d3.select("#images").selectAll("*").remove();
  d3.select("#images").selectAll(".image")
    .data(images)
    .enter().append("div")
      .attr("class", "image")
      .html(function(d){
        return "<img src = '/data/cartoons/large/" + d.index +  ".jpg'><div class = 'caption'><h3>" + truncate(d.title) + "</h3><p>" + d.date + "</p><a href = '" + d.url + "' target = '_blank'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>";
      });

}

/*
  Responsible for the website's initialization script
  Jeffrey Shen
*/

var currentData, //Data that has been filtered by subject(s)
    originalData; //Unaltered data

$.get("./data/data-min.json", function(d){
  originalData = d;
  currentData = d.slice();

  generateSubjectDropdown();
  drawGraph(currentData);
  updateSlideshow(currentData);

  //Make sure graph sizes responsively
  $(window).on("resize", function(){
    drawGraph(currentData);
  });

});

/*
  Responsible for the subject dropdown menu
  Jeffrey Shen
*/

//Converts a subject name into something more redoadable: Remove random characters and capitalize
function stylize(subject){
  return subject.replace(/\(|\)/g, "").split(" ").map(function(word){
    return word.charAt(0).toUpperCase() + word.substring(1);
  }).join(" ");
}

//Generates the "option" elements of the select dropdown using subjects.txt
function generateSubjectDropdown(){
  $.get("./data/subjects.txt", function(subjectStr){
    var subjects = subjectStr.split("\n").map(function(line){
      return line.split("|");
    });
    d3.select("#select-subject").selectAll("option")
      .data(subjects.slice(0, subjects.length - 1).filter(function(subject){
        return +subject[1] >= 10;
      }))
      .enter()
      .append("option")
        .attr("value", function(d){
          return d[0];
        })
        .html(function(d){
          return d[2] + " (" + d[1] + ")";
        });
  });
}

//Onchange event handler for the select dropdown. Should update the line chart with the new subject selection
function selectSubject(){
  var e = document.getElementById("select-subject");
  var subject = e.options[e.selectedIndex].value;

  if(subject == "Everything"){
    currentData = originalData;
    d3.select("#slideshow-subject-name").html("All Images:");
  }
  else {
    currentData = originalData.map(function(year){
      var newYear = Object.assign({}, year);
      newYear.cartoons = year.cartoons.filter(function(cartoon){
        return cartoon.subject.indexOf(subject) != -1;
      });

      return newYear;
    });
    d3.select("#slideshow-subject-name").html("Images with the Subject \"" + stylize(subject) + "\":");
  }

  drawGraph(currentData);
  updateSlideshow(currentData);
}
