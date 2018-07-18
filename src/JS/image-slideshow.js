/*
  Controls the cartoon image slideshow
  Jeffrey Shen
*/

function updateSlideshow(data){
  var images = [];
  data.forEach(function(year){
    year.cartoons.forEach(function(cartoon){
      images.push(cartoon);
    });
  });

  d3.select("#images").selectAll(".image")
    .data(images)
    .enter().append("div")
      .attr("class", "image")
      .html(function(d){
        return "<img src = '/data/cartoons/large/" + d.index +  ".jpg'><div class = 'caption'><a href = '" + d.url + "'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>";
      });

}
