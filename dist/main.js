/*
  Responsible for the frequency analysis visualizations
  Jeffrey Shen
*/

var frequencyData;

function updateRelatedTopicsHelper(subject){
  var referenced_subjects;
  for(var i = 0; i < frequencyData.length; i++){
    if(subject == frequencyData[i].subject) {
      referenced_subjects = frequencyData[i]["referenced-subjects"];
      break;
    }
  }

  d3.select("#related-topics").classed("hidden", false)
    .select("#related-topics-list")
    .html(referenced_subjects.length > 0 ? referenced_subjects.map(function(d){
      return "<a href = '#' onclick = 'updateDropdownValue(\"" + d.subject + "\");selectSubjectHelper(\"" + d.subject + "\")'>" + stylize(d.subject) + " (" + d.occurences + ")</a>";
    }).join(", ") : "No related subjects");
}

//Updates the list of related topics
function updateRelatedTopics(subject){
  if(subject == "Everything"){
    d3.select("#related-topics").classed("hidden", true);
  }
  else{
    if(!frequencyData) $.get("./data/frequency-min.json", function(fd){
      frequencyData = fd;
      updateRelatedTopicsHelper(subject);
    });
    else updateRelatedTopicsHelper(subject);
  }
}

/*
  Draws the data visualizations
  Jeffrey Shen
*/

var margin = {left: 70, right: 20, top: 30, bottom: 50};
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
  var subject = e.options[e.selectedIndex].value;

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
    .attr("y2", margin.top + 10)
    .style("stroke", "black")
    .style("stroke-width", "1");
  eventSelection.append("text")
    .text(function(d){return d.name;})
    .attr("x", function(d){return x(d.year) + margin.left - this.getBBox().width / 2;})
    .attr("y", margin.top);

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

//Filter by year
function generateYearDropdown(data){
  d3.select("#select-year").selectAll("*").remove();
  d3.select("#select-year").selectAll("option")
    .data(data.filter(function(d){
      return d.cartoons.length != 0;
    }))
    .enter()
    .append("option")
      .attr("value", function(d){
        return d.year;
      })
      .html(function(d){
        return d.year + " (" + d.cartoons.length + ")";
      });

  d3.select("#select-year")
    .insert("option", ":first-child")
      .attr("value", "Everything")
      .attr("selected", "selected")
      .html("All Years");
}

function selectYear(){
  var e = document.getElementById("select-year");
  var subject = e.options[e.selectedIndex].value;

  if(subject == "Everything") updateSlideshow(currentData);
  else updateSlideshow(currentData.filter(function(d){
    return d.year == subject;
  }));
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

  $('#images').slick("unslick");
  $("#images").slick({
    dots: false,
    slidesToShow: 1,
    variableWidth: true,
    accessibility: true,
    arrows: true,
    infinite: false
  });


}

/*
  Responsible for the website's initialization script
  Jeffrey Shen
*/

var currentData, //Data that has been filtered by subject(s)
    originalData, //Unaltered data
    eventData;

$.get("./data/data-min.json", function(d){
  originalData = d;
  currentData = d.slice();

  generateYearDropdown(currentData);
  generateSubjectDropdown();

  $.get("./data/events.json", function(d){
    eventData = d;
    drawGraph(currentData);
    //Make sure graph sizes responsively
    $(window).on("resize", function(){
      drawGraph(currentData);
    });
  });


  $('#images').slick({
    dots: false,
    slidesToShow: 1,
    variableWidth: true,
    accessibility: true,
    arrows: true
  });
  updateSlideshow(currentData);
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
    subjects = subjects.slice(0, subjects.length - 1).filter(function(subject){
      return +subject[1] >= 10;
    });

    d3.select("#select-subject").selectAll("option")
      .data(subjects)
      .enter()
      .append("option")
        .attr("value", function(d){
          return d[0];
        })
        .html(function(d){
          return d[2] + " (" + d[1] + ")";
        });

    d3.select("#select-subject")
      .insert("option", ":first-child")
        .attr("value", "Everything")
        .attr("selected", "selected")
        .html("Everything");
  });
}

//Onchange event handler for the select dropdown. Should update the line chart with the new subject selection
function selectSubject(){
  var e = document.getElementById("select-subject");
  var subject = e.options[e.selectedIndex].value;
  selectSubjectHelper(subject);
}

function selectSubjectHelper(subject){
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

  //Update the dropdown for year selection
  generateYearDropdown(currentData);
  drawGraph(currentData);
  updateSlideshow(currentData);
  updateRelatedTopics(subject);
}

//Updates what the dropdown says
function updateDropdownValue(subject){
  document.getElementById("select-subject").value = subject;
}
