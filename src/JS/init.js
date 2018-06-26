var data;

$.get("./data/data-min.json", function(d){
  data = d;
  // drawGraph(data);
  var subject = "german";
  drawGraph(data.map(function(year){
    year.cartoons = year.cartoons.filter(function(cartoon){
      return cartoon.subject.indexOf(subject) != -1;
    });
    return year;
  }));
});
