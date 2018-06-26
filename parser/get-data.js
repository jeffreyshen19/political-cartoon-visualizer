/*
  Extracts the data on each comic, and outputs them out sorted by year.
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs");

request.get({
  url: "https://www.loc.gov/collections/cartoon-drawings/?fa=online-format:image%7Caccess-restricted:false&fo=json&c=1000" //Request the entire list w/o pagination for simplicity
}, function(err, res, body){
  if(!err && res.statusCode == 200) {
    var years = [],
        cartoons = [],
        subjects = [];

    //Get the raw results, clean them up (to save space), and organize by year
    JSON.parse(body).results.forEach(function(cartoon){
      if(years.indexOf(cartoon.date) == -1) {
        years.push(cartoon.date);
        cartoons.push([]);
      }

      var yearI = years.indexOf(cartoon.date);

      if(cartoons[yearI].length == 0 || cartoons[yearI][cartoons[yearI].length - 1].title != cartoon.title) {
        cartoon.subject.forEach(function(subject){
          if(subjects.indexOf(subject) == -1) subjects.push(subject);
        });

        cartoons[yearI].push({
          index: cartoon.index,
          subject: cartoon.subject,
          title: cartoon.title,
          description: cartoon.description,
          date: cartoon.date,
          url: cartoon.url
        });
      }
    });

    //Refactor, and sort into ascending year
    years = years.map(function(year, i){
      return {
        "year": year,
        "cartoons": cartoons[i]
      };
    }).sort(function(a, b){
      return a.year - b.year;
    });

    fs.writeFileSync("../data/data-min.json", JSON.stringify(years));
    fs.writeFileSync("../data/subjects.json", JSON.stringify(subjects));

  }
});
