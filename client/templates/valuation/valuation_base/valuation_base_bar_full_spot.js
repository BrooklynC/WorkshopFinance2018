//Determines coloring of bar
Template.ValuationBaseBarFullSpot.helpers({
    barContentType: function () {
        var valuationType = this.valuationType;
        switch (valuationType) {
            case "comps":
                return "bar-full-comps";
                break;
            case "deals":
                return "bar-full-deals";
                break;
            case "models":
                return "bar-full-models";
                break;
            case "custom":
                return "bar-full-custom";
                break;
        }
    },
    valuationId: function() {
        return this._id;
    }
});

//Bar dimensions depend on valuation results and range calculations
//Text is formatted and added for labels
Template.ValuationBaseBarFullSpot.onRendered (function () {
    const self = this;

    var footballId = Template.parentData(1)._id;
    var valuationId = Template.parentData(0)._id;

    var valuationStartPct = getValuationCalcs(footballId, valuationId).startPct;

    var valuationHighSpace = getValuationText(footballId, valuationId).valuationHighSpace;
    var valuationHighText = getValuationText(footballId, valuationId).valuationHighText;

    var numberFormat = getBarFormat(footballId).number;
    var symCurrency = getBarFormat(footballId).currency;
    var symMultiple = getBarFormat(footballId).multiple;
    var themeText = UI._globalHelpers.themeStyle().barText;

    var barContainer = d3.select("#spot" + valuationId)
        .append("svg")
        .attr("id", "svg-bar");

    var barSpot = barContainer.append("circle")
        .attr("cx", valuationStartPct + "%")
        .attr("cy", 50+"%")
        .attr("r", 10)
        .attr("id", "bar-spot" + valuationId);

    var barSpotHigh = barContainer.append("text")
        .attr("x", valuationHighSpace + "%")
        .attr("y", "25px")
        .text(symCurrency + numberFormat(valuationHighText) + symMultiple)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("fill", themeText)
        .style("left", "5px")
        .attr("id", "bar-spot-high" + valuationId);

    self.autorun(function() {
        var footballId = Template.parentData(1)._id;
        var valuationId = Template.parentData(0)._id;
        var valuationStartPct = getValuationCalcs(footballId, valuationId).startPct;

        var valuationHighSpace = getValuationText(footballId, valuationId).valuationHighSpace;
        var valuationHighText = getValuationText(footballId, valuationId).valuationHighText;

        var numberFormat = getBarFormat(footballId).number;
        var symCurrency = getBarFormat(footballId).currency;
        var symMultiple = getBarFormat(footballId).multiple;
        var themeText = UI._globalHelpers.themeStyle().barText;

        barContainer.select("#bar-spot" + valuationId)
            .transition()
            .duration(0)
            .attr("cx", valuationStartPct + "%")
            .attr("cy", 50+"%")
            .attr("r", 10);

        barContainer.select("#bar-spot-high" + valuationId)
            .transition()
            .duration(0)
            .attr("x", valuationHighSpace + "%")
            .attr("y", "25px")
            .text(symCurrency + numberFormat(valuationHighText) + symMultiple)
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", themeText)
            .style("left", "5px");

    });
});