/*
  Extracts the data on each comic, and outputs them out sorted by year.
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs");

request.get({
  url: "https://www.loc.gov/collections/cartoon-drawings/?fa=online-format:image%7Caccess-restricted:false&fo=json&c=10" //Request the entire list w/o pagination for simplicity
}, function(err, res, body){
  if(!err && res.statusCode == 200) {
    var years = [];
    var cartoons = [];

    //Get the raw results, clean them up (to save space), and organize by year
    JSON.parse(body).results.forEach(function(cartoon){
      if(years.indexOf(cartoon.date) == -1) {
        years.push(cartoon.date);
        cartoons.push([]);
      }

      cartoons[years.indexOf(cartoon.date)].push({
        index: cartoon.index,
        subject: cartoon.subject,
        title: cartoon.title,
        description: cartoon.description,
        date: cartoon.date,
      });
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

    fs.writeFileSync("../data/data.json", JSON.stringify(years));

  }
});
