Template.FootballFieldCurrent.helpers({
    footballId: function() {
        return this._id;
    },
    startPct: function() {
        var footballId = Template.parentData(0)._id;
        //var footballRangeLow = 0;
        //var footballRangeHigh = 20000;
        var footballRangeLow = getRangeCaps(footballId).min;
        var footballRangeHigh = getRangeCaps(footballId).max;
        var footballRange = footballRangeHigh - footballRangeLow;

        var targetCurrent = getTargetCurrent(footballId);
        var start = targetCurrent - footballRangeLow;
        return start / footballRange * 100;
    }
});

//D3 shape to show current value.  Toggle exists to turn shape on and off.  Value is calculated in targetCurrent helper
Template.FootballFieldCurrent.onRendered (function () {
    const self = this;

    var footballId = Template.parentData(0)._id;
    var startPct = getCurrentCalcs(footballId).startPct;

    var colorCurrent = "rgba(38, 106, 46, 1)";

    var currentContainer = d3.select("#football-current-svg" + footballId)
        .append("svg")
        .attr("id", "svg-current");

    var current = currentContainer.append("line")
        .attr("x1", startPct + "%")
        .attr("y1", 0)
        .attr("x2", startPct + "%")
        .attr("y1", 100 + "%")
        .attr("stroke-width", 4)
        .attr("stroke", colorCurrent)
        .attr("id", "current" + footballId);

    self.autorun(function() {
        var footballId = Template.parentData(0)._id;
        var startPct = getCurrentCalcs(footballId).startPct;

        currentContainer.select("line")
            .transition()
            .duration(250)
            .attr("x1", startPct + "%")
            .attr("y1", 0)
            .attr("x2", startPct + "%")
            .attr("y1", 100 + "%")
            .attr("stroke-width", 4)
            .attr("stroke", colorCurrent);
    });
});