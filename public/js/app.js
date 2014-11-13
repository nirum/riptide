/**
 * Created by nirum on 11/9/14.
 */
console.log('hello!');

// get the chart object
var c = new Chart(document.getElementById("container").getContext("2d"));
var colors = d3.scale.category10().domain([0,1,2,3,4,5]);

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
        active: value.checked
    }
});

d3.selectAll(".dataselect").on("change", function() {
    dataplots[parseInt(this.value)].active = this.checked;
});

d3.select("#update").on("click", function () {
    d3.json('/api/' + expt, function (data) {

        var start = moment(data[0].date);
        var rad = parseInt(getval("#radius"));
        var bezier = d3.select("#bezier")[0][0].checked;

        var lineoptions = {
            datasetFill: false,
            pointDotRadius : rad,
            bezierCurve : bezier
        };

        // the line data object for chartjs
        var linedata = {
            labels: _.map(data, function (d) {
                return moment(d.date).diff(start, 'minutes');
            }),
            datasets: []
        };

        // loop
        _.each(dataplots, function (metadata, colIdx) {
            if (metadata.active) {
                linedata.datasets.push({
                    label: metadata.label,
                    strokeColor: colors(colIdx),
                    pointColor: colors(colIdx),
                    data: _.map(data, function (d) {
                        return d.data[colIdx];
                    })
                })
            }
        });
        c.Line(linedata, lineoptions);
    });
});