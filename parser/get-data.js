/*
  Extracts the data on each comic, and outputs them out sorted by year.
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs")
    blacklist = fs.readFileSync("../data/blacklisted-subjects.txt").toString().split("\n");

request.get({
  url: "https://www.loc.gov/collections/cartoon-drawings/?fa=online-format:image%7Caccess-restricted:false&fo=json&c=1000" //Request the entire list w/o pagination for simplicity
}, function(err, res, body){
  if(!err && res.statusCode == 200) {
    var years = [],
        cartoons = [];

    //Get the raw results, clean them up (to save space), and organize by year
    JSON.parse(body).results.filter(function(cartoon){
      return +cartoon.date <= 1910; //Ensure it's in the public domain && in the relevant timespan
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

    //Generate the subjects for each year
    years = years.map(function(year){
      var subjects = [],
          occurences = [];

      year.cartoons.forEach(function(cartoon){
        cartoon.subject.forEach(function(subject){
          var i = subjects.indexOf(subject);
          if(i == -1 && blacklist.indexOf(subject) == -1){
            subjects.push(subject);
            occurences.push(1);
          }
          else occurences[i]++;
        });
      });

      subjects = subjects.map(function(subject, i){
        return {
          "subject": subject,
          "occurences": occurences[i]
        };
      }).sort(function(a, b){
        return b.occurences - a.occurences;
      });

      return {
        "year": year.year,
        "subjects": subjects.slice(0, Math.min(subjects.length, 5)),
        "cartoons": year.cartoons
      };
    });

    fs.writeFileSync("../data/data-min.json", JSON.stringify(years));
    fs.writeFileSync("../data/data.json", JSON.stringify(years));

  }
});
