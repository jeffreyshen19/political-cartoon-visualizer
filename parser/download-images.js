/*
  Downloads all the political cartoon images in public domain in 2 sizes. Outputs in data/cartoons/
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs");

//Recursive function that downloads images synchronously to prevent the LoC API from failing.
function downloadImages(i, results, isLarge){
  var uri = "http:" + results[i].image_url[isLarge ? 2 : 0];
  var filename = (isLarge ? "../data/cartoons/large/" : "../data/cartoons/small/") + i + ".jpg";

  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on("close", function(){ //Once the image is downloaded, download the next one
      i++;
      if(i < results.length) downloadImages(i, results, isLarge);
      else if(!isLarge) downloadImages(0, results, true);
    });
  });
}

request.get({
  url: "https://www.loc.gov/collections/cartoon-drawings/?fa=online-format:image%7Caccess-restricted:false&fo=json&c=1000" //Request the entire list w/o pagination for simplicity
}, function(err, res, body){
  if(!err && res.statusCode == 200) downloadImages(0, JSON.parse(body).results.filter(function(cartoon){
    return +cartoon.date <= 1923;
  }), false);
});
