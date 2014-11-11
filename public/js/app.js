/**
 * Created by nirum on 11/9/14.
 */
console.log('hello!');

// get the experiment name from the hidden element
expt = d3.select("#name").html();

// chart dimensions
var m = [40, 80, 40, 80];   // margins
var w = 1000 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2];  // height

var redraw = function (idx) {

    // make the AJAX request for data
    d3.json('/api/' + expt, function (data) {

        // get the title of this plot
        var title = d3.select("#dataidx").selectAll("option")[0][idx].innerHTML;

        // create the scales
        var x = d3.time.scale()
            .domain(d3.extent(data, function (d) {
                return new Date(d.date);
            }))
            .range([0, w]);
        var y = d3.scale.linear()
            .domain([0, d3.max(data, function (d) {
                    return d.data[idx];
                })
            ])
            .range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
            .x(function (d) {
                return x(new Date(d.date));
            })
            .y(function (d) {
                return y(d.data[idx]);
            });

        // clear the chart
        d3.select("#container").html("");

        // select the chart
        var graph = d3.select("#container").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create xAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
        graph.append("svg:g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis)
            .append("text")
                .attr("class", "x label")
                .style("text-anchor", "end")
                .attr("x", w/2)
                .attr("y", 30)
                .text("Time (min)");

        // create yAxis
        var yAxis = d3.svg.axis().scale(y).ticks(4).orient("left");
        graph.append("svg:g")
                .attr("class", "y axis")
                .attr("transform", "translate(-25,0)")
                .call(yAxis)
            .append("text")
                .attr("class", "y label")
                .attr("x", 50)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text(title);

        // add the line
        graph.append("svg:path")
            .attr("d", line(data));

    });
};

// which index?
dataIndex = 2;

d3.select("#redraw").on("click", function () {
    dataIndex = parseInt(d3.select("#dataidx").property("value"));
    redraw(dataIndex);
});