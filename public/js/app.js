/**
 * Created by nirum on 11/9/14.
 */
console.log('hello!');

// get the chart object
//var c = new Chart(document.getElementById("container").getContext("2d"));
//var colors = d3.scale.category10().domain([0,1,2,3,4,5]);

// get form data
expt = document.getElementById("name").innerHTML;
function getval(str) {
    return d3.select(str).property("value");
}

// store data indices to plot in an object
// init the values
var cols = d3.selectAll(".dataselect")[0];
var dataplots = new Array(cols.length);
_.each(cols, function (value, idx) {
    dataplots[idx] = {
        label: value.name,
        desc: "description goes here"
    }
});

d3.selectAll(".dataselect").on("change", function() {
    var idx = parseInt(this.value);

    d3.json('/api/' + expt, function (data) {

        foo = _.map(data, function(d) {
            return { time: moment(d.date).second(), value: d.data[idx] };
        });

        data_graphic({
            title: dataplots[idx].label,
            description: dataplots[idx].desc,
            data: foo,
            area: false,
            interpolate: 'linear',
            width: 600,
            height: 250,
            target: '#container',
            x_accessor: 'time',
            y_accessor: 'value'
        });
    });
});