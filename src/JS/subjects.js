/*
  Responsible for the subject dropdown menu
  Jeffrey Shen
*/

//Generates the "option" elements of the select dropdown using subjects.txt
function generateSubjectDropdown(){
  $.get("./data/subjects.txt", function(subjectStr){
    var subjects = subjectStr.split("\n").map(function(line){
      return line.split("|");
    });
    d3.select("#select-subject").selectAll("option")
      .data(subjects.slice(0, subjects.length - 1))
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
  //var dropdown = d3.select("#select-subject").select("selected=true");

  var subject = "german"; //TODO: make this work properly

  if(subject == "All Subjects") currentData = originalData;
  else currentData = originalData.map(function(year){
    year.cartoons = year.cartoons.filter(function(cartoon){
      return cartoon.subject.indexOf(subject) != -1;
    });
    return year;
  });

  drawGraph(currentData);
}
