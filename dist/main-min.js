var frequencyData;function updateRelatedTopicsHelper(t){for(var e,a=0;a<frequencyData.length;a++)if(t==frequencyData[a].subject){e=frequencyData[a]["referenced-subjects"];break}d3.select("#related-topics").classed("hidden",!1).select("#related-topics-list").html(e.length>0?e.map(function(t){return"<a href = '#' onclick = 'updateDropdownValue(\""+t.subject+'");selectSubjectHelper("'+t.subject+"\")'>"+stylize(t.subject)+" ("+t.occurences+")</a>"}).join(", "):"No related subjects")}function updateRelatedTopics(t){"Everything"==t?d3.select("#related-topics").classed("hidden",!0):frequencyData?updateRelatedTopicsHelper(t):$.get("./data/frequency-min.json",function(e){frequencyData=e,updateRelatedTopicsHelper(t)})}var currentData,originalData,eventData,margin={left:70,right:20,top:30,bottom:50},blue="#0984e3";function drawGraph(t){var e=250-margin.top-margin.bottom,a=d3.select("#graphs").node().offsetWidth-margin.left-margin.right,n=d3.scalePoint().rangeRound([0,a]).padding(.1),r=d3.scaleLinear().rangeRound([e,0]),l=document.getElementById("scale-graph").checked,i=d3.select("#main-graph");i.select("svg").selectAll("*").remove(),i.select("svg").append("line").attr("class","tooltip-line hidden").attr("x1",n(0)).attr("y1",r(0)+margin.top).attr("x2",n(0)).attr("y2",margin.top).style("stroke","black").style("stroke-width","1").style("stroke-dasharray","5,5"),i.append("div").attr("class","tooltip hidden").style("position","absolute").style("background","white").style("padding","10px").style("bottom","70px").style("white-space","nowrap");var o=i.select(".tooltip"),s=i.select(".tooltip-line"),c=d3.line().x(function(t){return n(t.year)}).y(function(t,e){return r(l?t.cartoons.length/originalData[e].cartoons.length:t.cartoons.length)});n.domain(t.map(function(t){return""+t.year})),r.domain([0,d3.max(t,function(t,e){return l?t.cartoons.length/originalData[e].cartoons.length:t.cartoons.length})]),n.invert=d3.scaleQuantize().domain(n.range()).range(n.domain());for(var d=document.getElementById("select-subject"),u=d.options[d.selectedIndex].value,p=[],g=0;g<eventData.length;g++)if(eventData[g].subject==u){p=eventData[g].data;break}var f=i.select("svg").selectAll("g").data(p).enter().append("g");f.append("line").attr("x1",function(t){return n(t.year)+margin.left}).attr("x2",function(t){return n(t.year)+margin.left}).attr("y1",r(0)+margin.top).attr("y2",function(t,e){return margin.top+10+20*e}).style("stroke","black").style("stroke-width","1"),f.append("text").text(function(t){return t.name}).attr("x",function(t){return n(t.year)+margin.left-this.getBBox().width/2}).attr("y",function(t,e){return margin.top+20*e});var m=i.select("svg").attr("width",a+margin.left+margin.right).attr("height",e+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")");i.on("mousemove",function(){for(var e,r=n.invert(d3.mouse(this)[0]-margin.left),l=0;l<t.length;l++)if(t[l].year==r){e=t[l];break}o.classed("hidden",!1).html("<h3>"+e.year+" ("+e.cartoons.length+" cartoons)</h3>"+(u&&"Everything"!=u?"":"<p>Most common subjects:</p><ul>"+e.subjects.map(function(t){return"<li>"+stylize(t.subject)+" ("+t.occurences+")</li>"}).join("")+"</ul>")).style("left",(20+n(e.year)+o.node().offsetWidth>a?n(e.year)+margin.left-20-o.node().offsetWidth:n(e.year)+margin.left+20)+"px"),s.attr("x1",n(e.year)+margin.left).attr("x2",n(e.year)+margin.left).classed("hidden",!1)}).on("mouseout",function(t){var e=d3.event.toElement;e&&e.parentNode.parentNode!=this.parentNode&&e.parentNode!=this.parentNode&&e!=this.parentNode&&(o.classed("hidden",!0),s.classed("hidden",!0))}),m.append("path").data([t]).attr("class","line").style("stroke",blue).style("stroke-width","2px").style("fill","none").attr("d",c),m.selectAll(".dot").data(t).enter().append("circle").attr("class","dot").style("fill",blue).attr("cx",function(t){return n(t.year)}).attr("cy",function(t,e){return r(l?t.cartoons.length/originalData[e].cartoons.length:t.cartoons.length)}).attr("r",5),m.append("g").style("font-family","Libre_Baskerville").attr("transform","translate(0,"+e+")").call(d3.axisBottom(n)),m.append("g").style("font-family","Libre_Baskerville").call(d3.axisLeft(r)),m.append("text").attr("transform","rotate(-90)").attr("y",0-margin.left+10).attr("x",0-e/2).attr("dy","1em").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Number of Cartoons"+(l?" (Scaled)":"")),m.append("text").attr("transform","translate("+a/2+" ,"+(e+margin.top+10)+")").style("text-anchor","middle").style("font-family","Libre_Baskerville").style("font-weight","bold").text("Year")}function truncate(t){return t.replace(/\[|\]/g,"").substring(0,20)+"..."}function generateYearDropdown(t){d3.select("#select-year").selectAll("*").remove(),d3.select("#select-year").selectAll("option").data(t.filter(function(t){return 0!=t.cartoons.length})).enter().append("option").attr("value",function(t){return t.year}).html(function(t){return t.year+" ("+t.cartoons.length+")"}),d3.select("#select-year").insert("option",":first-child").attr("value","Everything").attr("selected","selected").html("All Years")}function selectYear(){var t=document.getElementById("select-year"),e=t.options[t.selectedIndex].value;updateSlideshow("Everything"==e?currentData:currentData.filter(function(t){return t.year==e}))}function updateSlideshow(t){var e=[];t.forEach(function(t){t.cartoons.forEach(function(t){e.push(t)})}),d3.select("#images").selectAll("*").remove(),d3.select("#images").selectAll(".image").data(e).enter().append("div").attr("class","image").html(function(t){return"<img src = '/data/cartoons/large/"+t.index+".jpg'><div class = 'caption'><h3>"+truncate(t.title)+"</h3><p>"+t.date+"</p><a href = '"+t.url+"' target = '_blank'><i class='fas fa-external-link-alt'></i> View on loc.gov</a></div>"}),$("#images").slick("unslick"),$("#images").slick({dots:!1,slidesToShow:1,variableWidth:!0,accessibility:!0,arrows:!0,infinite:!1})}function stylize(t){return t.replace(/\(|\)/g,"").split(" ").map(function(t){return t.charAt(0).toUpperCase()+t.substring(1)}).join(" ")}function generateSubjectDropdown(){$.get("./data/subjects.txt",function(t){var e=t.split("\n").map(function(t){return t.split("|")});e=e.slice(0,e.length-1).filter(function(t){return+t[1]>=10}),d3.select("#select-subject").selectAll("option").data(e).enter().append("option").attr("value",function(t){return t[0]}).html(function(t){return t[2]+" ("+t[1]+")"}),d3.select("#select-subject").insert("option",":first-child").attr("value","Everything").attr("selected","selected").html("Everything")})}function selectSubject(){var t=document.getElementById("select-subject");selectSubjectHelper(t.options[t.selectedIndex].value)}function selectSubjectHelper(t){"Everything"==t?(currentData=originalData,d3.select("#slideshow-subject-name").html("All Images:")):(currentData=originalData.map(function(e){var a=Object.assign({},e);return a.cartoons=e.cartoons.filter(function(e){return-1!=e.subject.indexOf(t)}),a}),d3.select("#slideshow-subject-name").html('Images with the Subject "'+stylize(t)+'":')),generateYearDropdown(currentData),drawGraph(currentData),updateSlideshow(currentData),updateRelatedTopics(t)}function updateDropdownValue(t){document.getElementById("select-subject").value=t}$.get("./data/data-min.json",function(t){originalData=t,generateYearDropdown(currentData=t.slice()),generateSubjectDropdown(),$.get("./data/events-min.json",function(t){eventData=t,drawGraph(currentData),$(window).on("resize",function(){drawGraph(currentData)})}),$("#images").slick({dots:!1,slidesToShow:1,variableWidth:!0,accessibility:!0,arrows:!0}),updateSlideshow(currentData)});