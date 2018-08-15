/*
  Downloads all the political cartoon images in public domain. Outputs in data/cartoons/
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs");

//Recursive function that downloads images synchronously to prevent the LoC API from failing.
function downloadImages(data, i, j, isLarge){
  var results = data[i].cartoons,
    cartoon = results[j],
    uri = "http:" + cartoon.image_url[isLarge ? (cartoon.image_url.length - 1) : 0];

  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream("../data/cartoons/" + (isLarge ? "large" : "small") + "/" + cartoon.index + ".jpg")).on("close", function(){ //Once the image is downloaded, download the next one
      if(isLarge){
        setTimeout(function () {
          if(j + 1 < results.length) downloadImages(data, i, j + 1, isLarge);
          else if(i + 1 < data.length) downloadImages(data, i + 1, 0, isLarge);
        }, 100);
      }
      else{
        if(j + 1 < results.length) downloadImages(data, i, j + 1, isLarge);
        else if(i + 1 < data.length) downloadImages(data, i + 1, 0, isLarge);
      }
    });
  });
}

var data = JSON.parse(fs.readFileSync("../data/data.json"));
downloadImages(data, 0, 0, true);
