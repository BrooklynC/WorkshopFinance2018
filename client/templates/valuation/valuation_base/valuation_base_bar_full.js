//Determines coloring of bar
Template.ValuationBaseBarFull.helpers({
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
Template.ValuationBaseBarFull.onRendered (function () {
    const self = this;

    var footballId = Template.parentData(1)._id;
    var valuationId = Template.parentData(0)._id;

    var valuationStartPct = getValuationCalcs(footballId, valuationId).startPct;
    var valuationWidthPct = getValuationCalcs(footballId, valuationId).widthPct;

    var valuationLowSpace = getValuationText(footballId, valuationId).valuationLowSpace;
    var valuationHighSpace = getValuationText(footballId, valuationId).valuationHighSpace;
    var valuationLowText = getValuationText(footballId, valuationId).valuationLowText;
    var valuationHighText = getValuationText(footballId, valuationId).valuationHighText;

    var numberFormat = getBarFormat(footballId).number;
    var symCurrency = getBarFormat(footballId).currency;
    var symMultiple = getBarFormat(footballId).multiple;
    var themeText = UI._globalHelpers.themeStyle().barText;

    var barContainer = d3.select("#bar" + valuationId)
        .append("svg")
        .attr("id", "svg-bar");

    var spread = Valuations.findOne({_id:valuationId}).valuationSpread;
    if(spread > 0) {
        var bar = barContainer.append("rect")
            .attr("x", valuationStartPct + "%")
            .attr("y", 0)
            .attr("height", 35)
            .attr("width", valuationWidthPct + "%")
            .attr("id", "bar" + valuationId);

        var barLow = barContainer.append("text")
            .attr("x", valuationLowSpace + "%")
            .attr("y", "20px")
            .text(symCurrency + numberFormat(valuationLowText) + symMultiple)
            .attr("text-anchor", "end")
            .attr("font-size", "12px")
            .attr("fill", themeText)
            .style("left", "5px")
            .attr("id", "bar-low" + valuationId);

        var barHigh = barContainer.append("text")
            .attr("x", valuationHighSpace + "%")
            .attr("y", "20px")
            .text(symCurrency + numberFormat(valuationHighText) + symMultiple)
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", themeText)
            .style("right", "5px")
            .attr("id", "bar-high" + valuationId);
    } else {
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
            .style("right", "5px")
            .attr("id", "bar-spot-high" + valuationId);
    }

    self.autorun(function() {
        var footballId = Template.parentData(1)._id;
        var valuationId = Template.parentData(0)._id;
        var valuationStartPct = getValuationCalcs(footballId, valuationId).startPct;
        var valuationWidthPct = getValuationCalcs(footballId, valuationId).widthPct;

        var valuationLowSpace = getValuationText(footballId, valuationId).valuationLowSpace;
        var valuationHighSpace = getValuationText(footballId, valuationId).valuationHighSpace;
        var valuationLowText = getValuationText(footballId, valuationId).valuationLowText;
        var valuationHighText = getValuationText(footballId, valuationId).valuationHighText;

        var numberFormat = getBarFormat(footballId).number;
        var symCurrency = getBarFormat(footballId).currency;
        var symMultiple = getBarFormat(footballId).multiple;
        var themeText = UI._globalHelpers.themeStyle().barText;

        var spread = Valuations.findOne({_id:valuationId}).valuationSpread;
        if(spread > 0) {
            barContainer.select("#bar" + valuationId)
                .transition()
                .duration(0)
                .attr("x", valuationStartPct + "%")
                .attr("y", 0)
                .attr("height", 35)
                .attr("width", valuationWidthPct + "%");

            barContainer.select("#bar-low" + valuationId)
                .transition()
                .duration(0)
                .attr("x", valuationLowSpace + "%")
                .attr("y", "20px")
                .text(symCurrency + numberFormat(valuationLowText) + symMultiple)
                .attr("text-anchor", "end")
                .attr("font-size", "12px")
                .style("left", "5px")
                .attr("fill", themeText);

            barContainer.select("#bar-high" + valuationId)
                .transition()
                .duration(0)
                .attr("x", valuationHighSpace + "%")
                .attr("y", "20px")
                .text(symCurrency + numberFormat(valuationHighText) + symMultiple)
                .attr("text-anchor", "start")
                .attr("font-size", "12px")
                .style("right", "5px")
                .attr("fill", themeText);
        } else {
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
                .attr("text-anchor", "end")
                .attr("font-size", "12px")
                .attr("fill", themeText)
                .style("right", "5px");

        }
    });
});