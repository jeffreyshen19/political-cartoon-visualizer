/*
  Downloads all the political cartoon images in public domain. Outputs in data/cartoons/
  Jeffrey Shen
*/

var request = require("request"),
    fs = require("fs");

//Recursive function that downloads images synchronously to prevent the LoC API from failing.
function downloadImages(data, i, j){
  var results = data[i].cartoons,
    cartoon = results[j],
    uri = "http:" + cartoon.image_url[2];

  console.log(cartoon.index);

  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream("../data/cartoons/large/" + cartoon.index + ".jpg")).on("close", function(){ //Once the image is downloaded, download the next one
      if(j + 1 < results.length) downloadImages(data, i, j + 1);
      else if(i + 1 < data.length) downloadImages(data, i + 1, 0);
    });
  });
}

var data = JSON.parse(fs.readFileSync("../data/data.json"));
downloadImages(data, 0, 0);
