var currentData,originalData,margin={left:70,right:20,top:30,bottom:50},blue="#0984e3";function drawGraph(t){var e=300-margin.top-margin.bottom,a=d3.select("#graphs").node().offsetWidth-margin.left-margin.right,n=d3.scalePoint().rangeRound([0,a]).padding(.1),r=d3.scaleLinear().rangeRound([e,0]),l=d3.select("#main-graph");l.select("svg").selectAll("*").remove(),l.select("svg").append("line").attr("class","tooltip-line hidden").attr("x1",n(0)).attr("y1",r(0)+margin.top).attr("x2",n(0)).attr("y2",margin.top).style("stroke","black").style("stroke-width","1").style("stroke-dasharray","5,5"),l.append("div").attr("class","tooltip hidden").style("position","absolute").style("background","white").style("padding","10px").style("bottom","70px").style("white-space","nowrap");var i=l.select(".tooltip"),o=l.select(".tooltip-line"),s=d3.line().x(function(t){return n(t.year)}).y(function(t){return r(t.cartoons.length)});n.domain(t.map(function(t){return""+t.year})),r.domain([0,d3.max(t,function(t){return t.cartoons.length})]),n.invert=d3.scaleQuantize().domain(n.range()).range(n.domain());var d=l.select("svg").attr("width",a+margin.left+margin.right).attr("height",e+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")");l.on("mousemove",function(){for(var e,r=n.invert(d3.mouse(this)[0]-margin.left),l=0;l<t.length;l++)if(t[l].year==r){e=t[l];break}i.classed("hidden",!1).html("<h3>"+e.year+"</h3><p>"+e.cartoons.length+" cartoons</p>").style("left",(20+n(e.year)+i.node().offsetWidth>a?n(e.year)+margin.left-20-i.node().offsetWidth:n(e.year)+margin.left+20)+"px"),o.attr("x1",n(e.year)+margin.left).attr("x2",n(e.year)+margin.left).classed("hidden",!1)}).on("mouseout",function(t){var e=d3.event.toElement;e&&e.parentNode.parentNode!=this.parentNode&&e.parentNode!=this.parentNode&&e!=this.parentNode&&(i.classed("hidden",!0),o.classed("hidden",!0))}),d.append("path").data([t]).attr("class","line").style("stroke",blue).style("stroke-width","2px").style("fill","none").attr("d",s),d.selectAll(".dot").data(t).enter().append("circle").attr("class","dot").style("fill",blue).attr("cx",function(t){return n(t.year)}).attr("cy",function(t){return r(t.cartoons.length)}).attr("r",5),d.append("g").style("font-family","Libre_Baskerville").attr("transform","translate(0,"+e+")").call(d3.axisBottom(n)),d.append("g").style("font-family","Libre_Baskerville").call(d3.axisLeft(r)),d.append("text").attr("transform","rotate(-90)").attr("y",0-margin.left+10).attr("x",0-e/2).attr("dy","1em").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Number of Cartoons"),d.append("text").attr("transform","translate("+a/2+" ,"+(e+margin.top+10)+")").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Year")}function updateSlideshow(t){var e=[];t.forEach(function(t){t.cartoons.forEach(function(t){e.push(t)})}),d3.select("#images").selectAll("*").remove(),d3.select("#images").selectAll(".image").data(e).enter().append("div").attr("class","image").html(function(t){return"<img src = '/data/cartoons/large/"+t.index+".jpg'><div class = 'caption'><a href = '"+t.url+"'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>"})}function stylize(t){return t.replace(/\(|\)/g,"").split(" ").map(function(t){return t.charAt(0).toUpperCase()+t.substring(1)}).join(" ")}function generateSubjectDropdown(){$.get("./data/subjects.txt",function(t){var e=t.split("\n").map(function(t){return t.split("|")});d3.select("#select-subject").selectAll("option").data(e.slice(0,e.length-1).filter(function(t){return+t[1]>=10})).enter().append("option").attr("value",function(t){return t[0]}).html(function(t){return t[2]+" ("+t[1]+")"})})}function selectSubject(){var t=document.getElementById("select-subject"),e=t.options[t.selectedIndex].value;"All Subjects"==e?(currentData=originalData,d3.select("#slideshow-subject-name").html("All Images:")):(currentData=originalData.map(function(t){var a=Object.assign({},t);return a.cartoons=t.cartoons.filter(function(t){return-1!=t.subject.indexOf(e)}),a}),d3.select("#slideshow-subject-name").html('Images with the Subject "'+stylize(e)+'":')),drawGraph(currentData),updateSlideshow(currentData)}$.get("./data/data-min.json",function(t){originalData=t,currentData=t.slice(),generateSubjectDropdown(),drawGraph(currentData),updateSlideshow(currentData),$(window).on("resize",function(){drawGraph(currentData)})});