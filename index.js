var request = require("request");

request.get({
  url: "http://beyondwords.labs.loc.gov/data"
}, function(err, res, body){
  if(!err && res.statusCode == 200){
    var images = JSON.parse(body).data.map(function(image){ //Parse data into a more usable format
      var data = image.data.values ? image.data.values[0] : image.data;

      var date = new Date(image.meta_data.subject_description.split(".")[1].trim());

      return {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getUTCDate(),
        },
        caption: data.caption,
        category: data.category,
        description: image.meta_data.subject_description,
        id: image.id,
        img: {
          url: image.location.standard,
          region: image.region
        },
        width: image.width,
        height: image.height
      };
    }).filter(function(image){ //Only get cartoons
      return image.category == "Editorial Cartoon" || image.category == "Comics/Cartoon";
    });

    console.log(images.length);

    console.log(images[0]);

    // images.forEach(function(image){
    //   console.log(image.meta_data.date);
    // });
    //
    // console.log(images.length);


    // console.log(images[0]);
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
