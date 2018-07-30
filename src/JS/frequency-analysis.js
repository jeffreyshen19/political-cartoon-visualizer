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
    .html(referenced_subjects.map(function(d){
      return "<a href = '" + "" + "'>" + stylize(d.subject) + " (" + d.occurences + ")</a>";
    }).join(", "));
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
