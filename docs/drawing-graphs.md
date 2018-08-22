# Drawing Graphs
The main timeline for this app (see below) is created using D3 in [graph.js](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/src/JS/graphs.js). 

![](./graphics/screenshot-timeline.png) 

## Objective 
The goal of the timeline is to show the number of cartoons, per year, sorted by subject. Therefore, the graph should be able to update in accordance with user input. Hovering on the graph should also display a relevant tooltip (see below).

![](./graphics/screenshot-timeline-tooltip.png) 

Also, for several subjects, events should show up on the timeline (see below) to historically contextualize the graph.

![](./graphics/screenshot-timeline-event.png) 

## Implementation
This is done through the `drawGraph` function. Most of this function is just drawing a standard D3 line graph, so I won't go into that here, but there are several unique features to discuss, namely the tooltip, superimposing event data, and how the graph updates.

### Tooltip
The x-axis of the D3 graph is using `scalePoint`, which, due to a peculiarity of D3, makes the tooltip particularly difficult. I want the tooltip to show up at the data point nearest to the mouse, and therefore need to figure out at what `x` position to place the tooltip at. I want the `y` position to always be constant. 

First, identifying which data point is closer. I create the method `x.invert`, which will output the `x` value ("1881", for example) nearest to the mouse pointer. 

```
x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());
```

Next, when the graph is actually hovered over: 

```
var x0 = x.invert(d3.mouse(this)[0] - margin.left),
        d;

for(var i = 0; i < data.length; i++) {
  if(data[i].year == x0) {
    d = data[i];
    break;
  }
}
    
... (display the data on the tooltip)
```

This code takes the mouse position, converts it into a value on the x-axis (say "1881") using the invert function, and then finds the data value corresponding to that year. This data is then used to display the tooltip text.  

### Event Data
When the script is initialized in [init.js](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/src/JS/init.js), the object `eventData` is set to the JSON contained in [events.json](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/data/events.json)

```
$.get("./data/events-min.json", function(d){
  eventData = d;
  drawGraph(currentData);
  ...
});
```

`eventData` will contain all the events we want to display on the timeline. This is displayed through `drawGraph`. The first part (see below) gets the currently selected subject from the dropdown, and filters eventData so it is only events with that subject.  

```
var e = document.getElementById("select-subject");
var subject = e.options[e.selectedIndex];
subject = subject ? subject.value : "Everything";

var specificEventData = [];
for(var i = 0; i < eventData.length; i++){
  if(eventData[i].subject == subject){
    specificEventData = eventData[i].data;
    break;
  }
}
```
The next part (see below) displays this data on the graph. For each event, the code appends a group tag (g) which contains the line drawn on the timeline, and the text label.
```
var eventSelection = thisNode.select('svg').selectAll("g")
    .data(specificEventData).enter().append("g");

  eventSelection.append("line").attr("x1", function(d){return x(d.year) + margin.left;})
    .attr("x2", function(d){return x(d.year) + margin.left;})
    .attr("y1", y(0) + margin.top)
    .attr("y2", function(d, i){return 15;})
    .style("stroke", "black")
    .style("stroke-width", "1");
  eventSelection.append("text")
    .html(function(d){
      return d.name.split("\n").map(function(el){ //This part enters the line breaks in the labels
        return "<tspan x = '" + (x(d.year) + margin.left + 10) + "' dy = '15px'>" + el + "</tspan>";
      }).join("");
    })
    .attr("x", function(d){return x(d.year) + margin.left + 10;})
    .attr("y", function(d, i){return 10;});
``` 

### Updating the graph

The graph is updated upon resize, so it can remain responsive. The way this is done, is that the existing graph is deleted and completely redrawn with the new dimensions of the screen. 

The script is initialized within [init.js](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/src/JS/init.js): 

```
var currentData, //Data that has been filtered by subject(s)
    originalData, //Unaltered data
    eventData;

$.get("./data/data-min.json", function(d){
  originalData = d;
  currentData = d.slice();

  ...

  $.get("./data/events-min.json", function(d){
    eventData = d;
    drawGraph(currentData);
    //Make sure graph sizes responsively
    $(window).on("resize", function(){
      drawGraph(currentData);
    });
  });
  ...
});

This code grabs the data for the graph, sets it to a global variable (bad practice, technically, but fine for the purposes of this project) and draws the graph for the first time. This is done so the data needs only be called once. This code also initializes the resize handler (done through Jquery) for the graph. Everytime the window is resized, `drawGraph` will be called again with the `currentData` (a variable storing the data currently being displayed). 

The graph can also be updated through the dropdown menu. This does roughly the same thing, as everytime the dropdown is updated (in [subjects.js](https://github.com/jeffreyshen19/political-cartoon-visualizer/blob/master/src/JS/subjects.js)), the graph is redrawn using a new `currentData`.

In the actual `drawGraph` function, the code does not change. The `drawGraph` function takes the currentData, and recalculates the proper width everytime it is called. 
