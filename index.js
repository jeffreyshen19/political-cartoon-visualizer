var request = require("request");

request.get({
  url: "http://beyondwords.labs.loc.gov/data"
}, function(err, res, body){
  if(!err && res.statusCode == 200){
    var images = JSON.parse(body).data.filter(function(image){ //Only get cartoons
      var data = image.data.values ? image.data.values[0] : image.data;
      return data.category == "Editorial Cartoon" || data.category == "Comics/Cartoon";
    });

    console.log(images[0]);
  }
});

// data:
//    { caption: 'HUNGER',
//      creator: 'UNITED STATES FOOD ADMINISTRATION',
//      category: 'Illustration' }


// data:
//    { values: [{ caption: 'Fire Due to Spontaneous Ignition.',
//     category: 'Photograph' }],
//      task_prompt: 'Enter picture\'s caption, illustrator or photographer and category.' } }
//NOTE: only possible for there to be one value in data
