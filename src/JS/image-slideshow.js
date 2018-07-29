/*
  Controls the cartoon image slideshow
  Jeffrey Shen
*/

//Trims up a title for display
function truncate(str){
  return str.replace(/\[|\]/g, "").substring(0, 20) + "...";
}

function updateSlideshow(data){
  var images = [];
  data.forEach(function(year){
    year.cartoons.forEach(function(cartoon){
      images.push(cartoon);
    });
  });

  d3.select("#images").selectAll("*").remove();
  d3.select("#images").selectAll(".image")
    .data(images)
    .enter().append("div")
      .attr("class", "image")
      .html(function(d){
        return "<img src = '/data/cartoons/large/" + d.index +  ".jpg'><div class = 'caption'><h3>" + truncate(d.title) + "</h3><p>" + d.date + "</p><a href = '" + d.url + "' target = '_blank'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>";
      });

}
