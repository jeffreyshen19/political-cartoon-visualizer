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
        cartoons = [];
        
    //Get the raw results, clean them up (to save space), and organize by year
    JSON.parse(body).results.filter(function(cartoon){
      return +cartoon.date <= 1923; //Ensure it's in the public domain
    })
    .forEach(function(cartoon){
      if(years.indexOf(cartoon.date) == -1) {
        years.push(cartoon.date);
        cartoons.push([]);
      }

      var yearI = years.indexOf(cartoon.date);

      if(cartoons[yearI].length == 0 || cartoons[yearI][cartoons[yearI].length - 1].title != cartoon.title) {
        cartoons[yearI].push({
          index: cartoon.index,
          subject: cartoon.subject,
          title: cartoon.title,
          description: cartoon.description,
          date: cartoon.date,
          url: cartoon.url,
          image_url: cartoon.image_url
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
    fs.writeFileSync("../data/data.json", JSON.stringify(years));

  }
});
