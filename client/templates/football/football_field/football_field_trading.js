Template.FootballFieldTrading.helpers({
    footballId: function() {
        return this._id;
    }
});

//D3 shape to show current value.  Toggle exists to turn shape on and off.  Value is calculated in targetCurrent helper
//For now, high and low values are assumed to be 10% spread away from current value.  Proper values would be
// included in third-party data feed
//BC-note: need to revisit targetCurrent calculations
Template.FootballFieldTrading.onRendered (function () {
    const self = this;
    var footballId = Template.parentData(0)._id;
    var startPct = getTradingCalcs(footballId).startPct;
    var widthPct = getTradingCalcs(footballId).widthPct;

    var colorTrading = "rgba(128, 128, 128, 0.2)"
    var tradingContainer = d3.select("#football-trading-svg" + footballId)
        .append("svg")
        .attr("id", "svg-trading");

    var trading = tradingContainer.append("rect")
        .attr("x", startPct + "%")
        .attr("y", 0 + "%")
        .attr("width", widthPct + "%")
        .attr("height", 100 + "%")
        .style("fill", colorTrading)
        .style("opacity", "1")
        .attr("id", "trading" + footballId);

    self.autorun(function() {
        var footballId = Template.parentData(0)._id;
        var startPct = getTradingCalcs(footballId).startPct;
        var widthPct = getTradingCalcs(footballId).widthPct;

        tradingContainer.select("rect")
            .transition()
            .duration(250)
            .attr("x", startPct + "%")
            .attr("y", 0 + "%")
            .attr("width", widthPct + "%")
            .attr("height", 100 + "%")
            .style("fill", colorTrading)
            .style("opacity", "1");
    });
});

