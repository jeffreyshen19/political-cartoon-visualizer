/*
  Analyzes which subjects are referenced in conjuction w/ one another.
  Jeffrey Shen
*/

var fs = require("fs");
var data = JSON.parse(fs.readFileSync("../data/data-min.json")),
    blacklist = fs.readFileSync("../data/blacklisted-subjects.txt").toString().split("\n"),
    subjects = fs.readFileSync("../data/subjects.txt").toString().split("\n").filter(function(subject){ //Map correlations only for those w/ more than 10 occurences
      return +subject.split("|")[1] >= 10;
    }).map(function(subject){
      return {
        "subject": subject.split("|")[0],
        "referenced-subjects": [],
        "occurences": []
      };
    });

//Find the correct index of the subject within subjects
function getIndex(subject){
  for(var i = 0; i < subjects.length; i++){
    if(subjects[i].subject == subject) return i;
  }
  return -1;
}

//Organize each subject so it contains its "related subjects", and how many times those subjects have appeared
data.forEach(function(year){
  year.cartoons.forEach(function(cartoon){
    cartoon.subject.forEach(function(subject, i){
      var subjectToChange = subjects[getIndex(subject)];
      if(subjectToChange){
        for(var j = 0; j < cartoon.subject.length; j++){
          if(j != i && blacklist.indexOf(cartoon.subject[j]) == -1){
            var k = subjectToChange["referenced-subjects"].indexOf(cartoon.subject[j]);
            if(k == -1){
              subjectToChange["referenced-subjects"].push(cartoon.subject[j]);
              subjectToChange.occurences.push(1);
            }
            else subjectToChange.occurences[k]++;
          }
        }
      }
    });
  });
});

//Now, sort each subject's related subject by occurence
subjects = subjects.map(function(subject){
  return {
    "subject": subject.subject,
    "referenced-subjects": subject["referenced-subjects"].map(function(el, i){
      return {
        "subject": el,
        "occurences": subject.occurences[i]
      };
    }).filter(function(el){ //Filter out the related subjects that have too little occurences
      return el.occurences >= 5;
    }).sort(function(a, b){ //Sort in descending order
      return b.occurences - a.occurences;
    })
  };
});

fs.writeFileSync("../data/frequency-min.json", JSON.stringify(subjects));
fs.writeFileSync("../data/frequency.json", JSON.stringify(subjects));
