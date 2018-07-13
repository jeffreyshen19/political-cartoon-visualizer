/*
  Responsible for the subject dropdown menu
  Jeffrey Shen
*/

//Generates the "option" elements of the select dropdown using subjects.txt
function generateSubjectDropdown(){
  $.get("./data/subjects.txt", function(subjectStr){
    var subjects = subjectStr.split("\n");
    d3.select("#select-subject").selectAll("option")
      .data(subjects)
      .enter()
      .append("option")
        .attr("value", function(d){
          return d;
        })
        .html(function(d){
          return d;
        });
  });
}

//Onchange event handler for the select dropdown. Should update the line chart with the new subject selection
function selectSubject(){
  //var dropdown = d3.select("#select-subject").select("selected=true");

  var subject = "german";

  if(subject == "All Subjects") currentData = originalData;
  else currentData = originalData.map(function(year){
    year.cartoons = year.cartoons.filter(function(cartoon){
      return cartoon.subject.indexOf(subject) != -1;
    });
    return year;
  });

  drawGraph(currentData);
}
