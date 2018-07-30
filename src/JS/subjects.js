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
  updateRelatedTopics(subject);
}
