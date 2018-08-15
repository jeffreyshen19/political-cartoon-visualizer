# Downloading Images
Images are downloaded with [download-images.js](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/parser/download-images.js). 

## Objective 
The goal of download-images.js is to call the LoC API and download all the images (in two sizes) for the data visualization into [data/cartoons](https://github.com/jeffreyshen19/political-cartoon-visualizer/tree/master/data/cartoons) so the website does not need to strain the LoC's servers everytime it starts up. These images are also zipped in [data/downloads](https://github.com/jeffreyshen19/political-cartoon-visualizer/tree/master/data/downloads) for the public to download. 

## Implementation
The main challenge is the LoC's rate limiting, which prevents our program from downloading all 800+ images at once. Instead, our program needs to download each image one by one so the API does not block us. 

First, we read [data.json](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/data/data.json). This file contains a JSON object, containing the URLs of the images we want to download:
```
var data = JSON.parse(fs.readFileSync("../data/data.json"));
```
Next, we send this data to a recursive function called `downloadImages`. This function will download each image contained in the data one by one. 
```
downloadImages(data, 0, 0, true);
```
`downloadImages` will start downloading images in the large size first (as denoted by the boolean argument `isLarge`). It will download the first large image, recursively call the next image, and so on until all large images are downloaded. Then, the function is called again, this time with the `isLarge` argument set to false. The process is repeated until all images are downloaded. See the (annotated) function below: 
```
function downloadImages(data, i, j, isLarge){
  var results = data[i].cartoons,
    cartoon = results[j],
    uri = "http:" + cartoon.image_url[isLarge ? (cartoon.image_url.length - 1) : 0]; //THIS is the URL of the image to download

  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream("../data/cartoons/" + (isLarge ? "large" : "small") + "/" + cartoon.index + ".jpg")).on("close", function(){ //Pipe this image the correct location
      if(isLarge){
        setTimeout(function () { //Set a small timeout so as not to override the server
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
```
