var nv = require('nvd3');

var svgCounter = 0;

function _createSvg (domElement) {
    var id = 'jutsu-graph-' + svgCounter++;
    d3.select(domElement).append('svg')
        .attr('id', id)
        .attr('width', '100%')
        .attr('height', '600');
    return id;
}

function _pieChart (domElement, data) {
    var id = _createSvg(domElement);

    nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showLabels(false);

        d3.select('#' + id)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
    return data;
}

function _barChart (domElement, data) {
    var id = _createSvg(domElement);

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            .showValues(true);

        d3.select('#' + id)
            .datum([{values: data}])
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
        });

    return data;
}

var schema = {
    pieChart: {
        data: [
            {
                label: 'String',
                value: 'Number'
            }
        ]
    },
    barChart: {
        data: [
            {
                label: 'String',
                value: 'Number'
            }
        ]
    }
}

function Jutsu (domElement) {
    d3.select(domElement).selectAll('*').remove();
    return {
        __SMOLDER_SCHEMA: schema,
        pieChart: function (data) {
            return _pieChart(domElement, data);
        },
        barChart: function (data) {
            return _barChart(domElement, data);
        }
    };
}

module.exports = Jutsu;
