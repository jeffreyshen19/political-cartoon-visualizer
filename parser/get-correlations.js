/*
  Gets important correlations from the data downloaded. Namely, most common subjects per year and frequency analysis.
  Jeffrey Shen
*/

var fs = require("fs");
va

fs.readFile("../data/data-min.json", function(err, res){
  var output = "year,subject,num_occurences\n";

  JSON.parse(res).forEach(function(el){
    output += el.year + ",";

    var subjects = [],
        numOccurences = [];

    el.cartoons.forEach(function(cartoon){
      cartoon.subject.forEach(function(subject){
        var i = subjects.indexOf(subject);
        if(i == -1) {
          subjects.push(subject);
          numOccurences.push(1);
        }
        else numOccurences[i]++;
      });
    });

    var maxI = numOccurences.indexOf(Math.max(...numOccurences));
    output += subjects[maxI] + "," + numOccurences[maxI] + "\n";

  });

  fs.writeFileSync("../data/correlations.csv", output);

});
