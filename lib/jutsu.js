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
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
    return data;
}

function _barChart (domElement, data, xLabel, yLabel) {
    var id = _createSvg(domElement);

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .margin({bottom: 65})
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true);

        chart.xAxis.axisLabel(xLabel);
        chart.yAxis.axisLabel(yLabel);
        chart.yAxis.tickFormat(d3.format(''));

        d3.select('#' + id)
            .datum([{values: data}])
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });

    return data;
}

function _scatterPlot (domElement, data, xLabel, yLabel) {
    var id = _createSvg(domElement);

    nv.addGraph(function() {
        var chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .showLegend(false)
            .color(d3.scale.category10().range());

        chart.xAxis.axisLabel(xLabel);
        chart.yAxis.axisLabel(yLabel);

        chart.tooltip.contentGenerator(function(graph) {
            return '<h3>' + graph.point.label + '</h3>' +
                '<p>' + xLabel + ': ' + graph.point.x + '</p>' +
                '<p>' + yLabel + ': ' + graph.point.y + '</p>';
        });

        d3.select('#' + id)
            .datum([{key: '', values: data}])
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });

    return data;
}

function _lineChart (domElement, data, xLabel, yLabel) {
    data.sort(function(a, b) { return a.x - b.x; });
    var id = _createSvg(domElement);

    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .useInteractiveGuideline(true)
            .showLegend(false);

        chart.xAxis.axisLabel(xLabel);
        chart.yAxis.axisLabel(yLabel);

        chart.interactiveLayer.tooltip.contentGenerator(function(graph) {
            var data = graph.series[0].data;
            return '<h3>' + data.label + '</h3>' +
                '<p>' + xLabel + ': ' + data.x + '</p>' +
                '<p>' + yLabel + ': ' + data.y + '</p>';
        });

        d3.select('#' + id)
            .datum([{key: '', values: data}])
            .transition().duration(500)
            .call(chart);

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
    },
    scatterPlot: {
        data: [
            {
                x: 'Number',
                y: 'Number',
                label: 'String'
            }
        ]
    },
    lineChart: {
        data: [
            {
                x: 'Number',
                y: 'Number',
                label: 'String'
            }
        ]
    }

}

function Jutsu (domElement) {
    if (domElement) {
        d3.select(domElement).selectAll('*').remove();
    }
    return {
        __SMOLDER_SCHEMA: schema,
        pieChart: function (data) {
            return _pieChart(domElement, data);
        },
        barChart: function (data, xLabel, yLabel) {
            return _barChart(domElement, data, xLabel, yLabel);
        },
        scatterPlot: function (data, xLabel, yLabel) {
            return _scatterPlot(domElement, data, xLabel, yLabel);
        },
        lineChart: function (data, xLabel, yLabel) {
            return _lineChart(domElement, data, xLabel, yLabel);
        }
    };
}

module.exports = Jutsu;
