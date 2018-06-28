/*
  Generate a list of all subjects
  Jeffrey Shen
*/

var fs = require("fs");
var blacklist = fs.readFileSync("../data/blacklisted-subjects.txt").toString().split("\n");
var data = JSON.parse(fs.readFileSync("../data/data.json"));

var subjects = [],
    output = "";

data.forEach(function(year){
  year.cartoons.forEach(function(cartoon){
    cartoon.subject.forEach(function(subject){
      if(subjects.indexOf(subject) == -1 && blacklist.indexOf(subject) == -1) subjects.push(subject);
    });
  });
});

subjects.forEach(function(subject){
  output += subject + "\n";
});

fs.writeFileSync("../data/subjects.txt", output);
