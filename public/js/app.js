/**
 * Created by nirum on 11/9/14.
 */
console.log('hello!');

// get the experiment name from the hidden element
expt = d3.select("#name").html();
var colors = d3.scale.category10().domain([0,1,2,3,4,5]);

// store data indices to plot in an object
// init the values
var cols = d3.selectAll(".dataselect")[0];
var dataplots = new Array(cols.length);
_.each(cols, function (value, idx) {
    dataplots[idx] = {
        label: value.name,
        active: value.checked
    }
});

// chart dimensions
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
    .scale(x)
    //.tickFormat(d3.time.format("%X"))
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(15)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(15)
    .ticks(10, "");

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

svg.append("g")
    .attr("class", "y axis");

/*
 * Main draw function
 *
 * Takes:
 *     an array of data objects with time and value fields,
 *     and an options object (with radius, color, label, xlim and ylim fields)
 *
 * Updates circles with the class {label} with values in data
 *
 */
function draw(data, options) {

    // measure the domain (for x, unique letters) (for y [0,maxFrequency])
    // now the scales are finished and usable
    x.domain(options.xlim);
    y.domain(options.ylim);

    // another g element, this time to move the origin to the bottom of the svg element
    // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
    //   for everything in the selection\
    // the end result is g populated with text and lines!
    svg.select('.x.axis').transition().duration(300).call(xAxis);

    // same for yAxis but with more transform and a title
    svg.select(".y.axis").transition().duration(300).call(yAxis);

    // select / data pattern
    var circles = svg.selectAll("." + options.name).data(data, function(d) { return d.time; });

    circles.exit()
        .transition()
        .duration(300)
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    circles.enter().append("circle")
        .attr("class", options.name)
        .style("fill", options.color)
        .attr("cy", y(0))
        .attr("height", height - y(0));

    // the "UPDATE" set:
    circles.transition().duration(300)
        .attr("r", options.radius) // constant, so no callback function(d) here
        .attr("cx", function (d) {
            return x(d.time);
        }) // (d) is one item from the data array, x is the scale object from above
        .attr("cy", function (d) {
            return y(d.value);
        });

}

function getval(str) {
    return d3.select(str).property("value");
}

d3.select("#update").on("click", function () {

    d3.json('/api/' + expt, function (data) {

        var startTime = moment(data[0].date); //.unix();
        var rad = parseInt(getval("#radius"));
        var ylim = [parseFloat(getval("#ymin")), parseFloat(getval("#ymax"))];

        // Parse data
        _.each(dataplots, function (metadata, dataIdx) {

            // make options object
            options = {
                radius: rad,
                label: S(metadata.label).humanize().s,
                name: S(metadata.label).slugify().s,
                color: colors(dataIdx),
                ylim: ylim,
                xlim: [0, _.max(_.map(_.pluck(data, 'date'), function (date) {
                    return moment(date).unix() - startTime.unix();
                }))]
            };

            // make data array
            var dataArray = [];
            if (metadata.active) {
                dataArray = _.map(data, function (d) {
                    return {
                        time: moment(d.date).unix() - startTime.unix(),
                        value: d.data[dataIdx]
                    }
                });
            }

            //console.log(dataArray);
            draw(dataArray, options);

        });

        //var labels = _.pluck(dataplots, 'label');
        //var arrayData = new Array(data.length);
        //_.each(data, function (d, dataIdx) {
        //
        //    // Init
        //    arrayData[dataIdx] = {
        //        time: (moment(d.date).unix()-startTime.unix()),
        //        data: []
        //    };
        //
        //    // Pull out requested column indices
        //    _.each(dataplots, function (value, colIdx) {
        //        if (dataplots[colIdx].active) {
        //            arrayData[dataIdx].data.push(d.data[colIdx]);
        //        }
        //    });
        //    //_.each(_.where(dataplots, {'active': true}), function (value, colIdx) {
        //    //    arrayData[dataIdx].data.push(d.data[colIdx]);
        //    //});
        //    //var rad = parseInt(d3.select("#radius").property("value"));
        //
        //});

        //draw(arrayData, labels);
        //for (var j=0; j<dataplots.length; j++) {
        //    if (dataplots[j].active) {
        //        draw(data, j, dataplots[j].label);
        //    }
        //}
    });
});

d3.selectAll(".dataselect").on("change", function() {
    dataplots[parseInt(this.value)].active = this.checked;
    //console.log(dataplots);
});