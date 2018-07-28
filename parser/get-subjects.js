/*
  Generate a list of all subjects
  Jeffrey Shen
*/

//Converts a subject name into something more redoadable: Remove random characters and capitalize
function stylize(subject){
  return subject.replace(/\(|\)/g, "").split(" ").map(function(word){
    return word.charAt(0).toUpperCase() + word.substring(1);
  }).join(" ");
}

var fs = require("fs");
var blacklist = fs.readFileSync("../data/blacklisted-subjects.txt").toString().split("\n");
var data = JSON.parse(fs.readFileSync("../data/data-min.json"));

var subjects = [],
    occurences = [],
    output = "";

data.forEach(function(year){
  year.cartoons.forEach(function(cartoon){
    cartoon.subject.forEach(function(subject){
      if(blacklist.indexOf(subject) == -1){
        if(subjects.indexOf(subject) == -1){
          occurences.push(1);
          subjects.push(subject);
        }
        else occurences[subjects.indexOf(subject)]++;
      }
    });
  });
});

subjects.map(function(subject, i){
  return {
    "subject": subject,
    "occurences": occurences[i],
    "name": stylize(subject)
  };
}).sort(function(a, b){ //Sort in descending order
  return b.occurences - a.occurences;
}).forEach(function(subject){
  output += subject.subject + "|" + subject.occurences + "|" + subject.name + "\n";
});

fs.writeFileSync("../data/subjects.txt", output);
