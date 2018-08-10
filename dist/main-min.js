var frequencyData;function updateRelatedTopicsHelper(e){for(var t,a=0;a<frequencyData.length;a++)if(e==frequencyData[a].subject){t=frequencyData[a]["referenced-subjects"];break}d3.select("#related-topics").classed("hidden",!1).select("#related-topics-list").html(t.length>0?t.map(function(e){return"<a href = '#' onclick = 'updateDropdownValue(\""+e.subject+'");selectSubjectHelper("'+e.subject+"\")'>"+stylize(e.subject)+" ("+e.occurences+")</a>"}).join(", "):"No related subjects")}function updateRelatedTopics(e){"Everything"==e?d3.select("#related-topics").classed("hidden",!0):frequencyData?updateRelatedTopicsHelper(e):$.get("./data/frequency-min.json",function(t){frequencyData=t,updateRelatedTopicsHelper(e)})}var currentData,originalData,eventData,margin={left:70,right:20,top:30,bottom:50},blue="#0984e3";function drawGraph(e){var t=250-margin.top-margin.bottom,a=d3.select("#graphs").node().offsetWidth-margin.left-margin.right,n=d3.scalePoint().rangeRound([0,a]).padding(.1),r=d3.scaleLinear().rangeRound([t,0]),l=document.getElementById("scale-graph").checked,i=d3.select("#main-graph");i.select("svg").selectAll("*").remove(),i.select("svg").append("line").attr("class","tooltip-line hidden").attr("x1",n(0)).attr("y1",r(0)+margin.top).attr("x2",n(0)).attr("y2",margin.top).style("stroke","black").style("stroke-width","1").style("stroke-dasharray","5,5"),i.append("div").attr("class","tooltip hidden").style("position","absolute").style("background","white").style("padding","10px").style("bottom","70px").style("white-space","nowrap");var o=i.select(".tooltip"),s=i.select(".tooltip-line"),c=d3.line().x(function(e){return n(e.year)}).y(function(e,t){return r(l?e.cartoons.length/originalData[t].cartoons.length:e.cartoons.length)});n.domain(e.map(function(e){return""+e.year})),r.domain([0,d3.max(e,function(e,t){return l?e.cartoons.length/originalData[t].cartoons.length:e.cartoons.length})]),n.invert=d3.scaleQuantize().domain(n.range()).range(n.domain());for(var d=document.getElementById("select-subject"),u=d.options[d.selectedIndex].value,p=[],g=0;g<eventData.length;g++)if(eventData[g].subject==u){p=eventData[g].data;break}var f=i.select("svg").selectAll("g").data(p).enter().append("g");f.append("line").attr("x1",function(e){return n(e.year)+margin.left}).attr("x2",function(e){return n(e.year)+margin.left}).attr("y1",r(0)+margin.top).attr("y2",margin.top+10).style("stroke","black").style("stroke-width","1"),f.append("text").text(function(e){return e.name}).attr("x",function(e){return n(e.year)+margin.left-this.getBBox().width/2}).attr("y",margin.top);var h=i.select("svg").attr("width",a+margin.left+margin.right).attr("height",t+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")");i.on("mousemove",function(){for(var t,r=n.invert(d3.mouse(this)[0]-margin.left),l=0;l<e.length;l++)if(e[l].year==r){t=e[l];break}o.classed("hidden",!1).html("<h3>"+t.year+" ("+t.cartoons.length+" cartoons)</h3>"+(u&&"Everything"!=u?"":"<p>Most common subjects:</p><ul>"+t.subjects.map(function(e){return"<li>"+stylize(e.subject)+" ("+e.occurences+")</li>"}).join("")+"</ul>")).style("left",(20+n(t.year)+o.node().offsetWidth>a?n(t.year)+margin.left-20-o.node().offsetWidth:n(t.year)+margin.left+20)+"px"),s.attr("x1",n(t.year)+margin.left).attr("x2",n(t.year)+margin.left).classed("hidden",!1)}).on("mouseout",function(e){var t=d3.event.toElement;t&&t.parentNode.parentNode!=this.parentNode&&t.parentNode!=this.parentNode&&t!=this.parentNode&&(o.classed("hidden",!0),s.classed("hidden",!0))}),h.append("path").data([e]).attr("class","line").style("stroke",blue).style("stroke-width","2px").style("fill","none").attr("d",c),h.selectAll(".dot").data(e).enter().append("circle").attr("class","dot").style("fill",blue).attr("cx",function(e){return n(e.year)}).attr("cy",function(e,t){return r(l?e.cartoons.length/originalData[t].cartoons.length:e.cartoons.length)}).attr("r",5),h.append("g").style("font-family","Libre_Baskerville").attr("transform","translate(0,"+t+")").call(d3.axisBottom(n)),h.append("g").style("font-family","Libre_Baskerville").call(d3.axisLeft(r)),h.append("text").attr("transform","rotate(-90)").attr("y",0-margin.left+10).attr("x",0-t/2).attr("dy","1em").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Number of Cartoons"+(l?" (Scaled)":"")),h.append("text").attr("transform","translate("+a/2+" ,"+(t+margin.top+10)+")").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Year")}function truncate(e){return e.replace(/\[|\]/g,"").substring(0,20)+"..."}function generateYearDropdown(e){d3.select("#select-year").selectAll("*").remove(),d3.select("#select-year").selectAll("option").data(e.filter(function(e){return 0!=e.cartoons.length})).enter().append("option").attr("value",function(e){return e.year}).html(function(e){return e.year+" ("+e.cartoons.length+")"}),d3.select("#select-year").insert("option",":first-child").attr("value","Everything").attr("selected","selected").html("All Years")}function selectYear(){var e=document.getElementById("select-year"),t=e.options[e.selectedIndex].value;updateSlideshow("Everything"==t?currentData:currentData.filter(function(e){return e.year==t}))}function updateSlideshow(e){var t=[];e.forEach(function(e){e.cartoons.forEach(function(e){t.push(e)})}),d3.select("#images").selectAll("*").remove(),d3.select("#images").selectAll(".image").data(t).enter().append("div").attr("class","image").html(function(e){return"<img src = '/data/cartoons/large/"+e.index+".jpg'><div class = 'caption'><h3>"+truncate(e.title)+"</h3><p>"+e.date+"</p><a href = '"+e.url+"' target = '_blank'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>"}),$("#images").slick("unslick"),$("#images").slick({dots:!1,slidesToShow:1,variableWidth:!0,accessibility:!0,arrows:!0,infinite:!1})}function stylize(e){return e.replace(/\(|\)/g,"").split(" ").map(function(e){return e.charAt(0).toUpperCase()+e.substring(1)}).join(" ")}function generateSubjectDropdown(){$.get("./data/subjects.txt",function(e){var t=e.split("\n").map(function(e){return e.split("|")});t=t.slice(0,t.length-1).filter(function(e){return+e[1]>=10}),d3.select("#select-subject").selectAll("option").data(t).enter().append("option").attr("value",function(e){return e[0]}).html(function(e){return e[2]+" ("+e[1]+")"}),d3.select("#select-subject").insert("option",":first-child").attr("value","Everything").attr("selected","selected").html("Everything")})}function selectSubject(){var e=document.getElementById("select-subject");selectSubjectHelper(e.options[e.selectedIndex].value)}function selectSubjectHelper(e){"Everything"==e?(currentData=originalData,d3.select("#slideshow-subject-name").html("All Images:")):(currentData=originalData.map(function(t){var a=Object.assign({},t);return a.cartoons=t.cartoons.filter(function(t){return-1!=t.subject.indexOf(e)}),a}),d3.select("#slideshow-subject-name").html('Images with the Subject "'+stylize(e)+'":')),generateYearDropdown(currentData),drawGraph(currentData),updateSlideshow(currentData),updateRelatedTopics(e)}function updateDropdownValue(e){document.getElementById("select-subject").value=e}$.get("./data/data-min.json",function(e){originalData=e,generateYearDropdown(currentData=e.slice()),generateSubjectDropdown(),$.get("./data/events.json",function(e){eventData=e,drawGraph(currentData),$(window).on("resize",function(){drawGraph(currentData)})}),$("#images").slick({dots:!1,slidesToShow:1,variableWidth:!0,accessibility:!0,arrows:!0}),updateSlideshow(currentData)});