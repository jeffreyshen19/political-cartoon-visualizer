/*
  Controls the cartoon image slideshow
  Jeffrey Shen
*/

//Trims up a title for display
function truncate(str){
  return str.replace(/\[|\]/g, "").substring(0, 20) + "...";
}

//Filter by year
function generateYearDropdown(data){
  d3.select("#select-year").selectAll("*").remove();
  d3.select("#select-year").selectAll("option")
    .data(data.filter(function(d){
      return d.cartoons.length != 0;
    }))
    .enter()
    .append("option")
      .attr("value", function(d){
        return d.year;
      })
      .html(function(d){
        return d.year + " (" + d.cartoons.length + ")";
      });

  d3.select("#select-year")
    .insert("option", ":first-child")
      .attr("value", "Everything")
      .attr("selected", "selected")
      .html("All Years");
}

function selectYear(){
  var e = document.getElementById("select-year");
  var subject = e.options[e.selectedIndex].value;

  if(subject == "Everything") updateSlideshow(currentData);
  else updateSlideshow(currentData.filter(function(d){
    return d.year == subject;
  }));
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
