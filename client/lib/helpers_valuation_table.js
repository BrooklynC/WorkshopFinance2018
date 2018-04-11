////VALUATION TABLE

//Format for multiples in active values at bottom of Valuation table
//Redundant right now, but keeping in case I expand options
Template.registerHelper('build', function() {
    var footballId = Template.parentData(1)._id;
    var valuationId = this._id;
    var valuationType = this.valuationType;
    var valuationMetric = this.valuationMetric;
    var existingCustom = this.existingCustom;
    var footballOutput = Template.parentData(1).footballOutput;
    var buildMultiple = getBuildMultiple(footballId, valuationId);
    if(buildMultiple) {
        switch(valuationType) {
            case "comps":
                switch (valuationMetric) {
                    case "EV/Revenue":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                    case "EV/EBITDA":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                    case "P/E":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                }
                break;
            case "deals":
                switch (valuationMetric) {
                    case "EV/Revenue":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                    case "EV/EBITDA":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                    case "P/E":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                }
                break;
            case "models":
                if(footballOutput == "Multiple") {
                    switch (valuationMetric) {
                        case "EV/Revenue":
                            return {
                                currency: "",
                                multiple: "x"
                            };
                            break;
                        case "EV/EBITDA":
                            return {
                                currency: "",
                                multiple: "x"
                            };
                            break;
                        case "P/E":
                            return {
                                currency: "",
                                multiple: "x"
                            };
                            break;
                    }
                } else {
                    return {
                        currency: "$",
                        multiple: ""
                    };
                }
                break;
            case "custom":
                switch(existingCustom) {
                    case "Value":
                        return {
                            currency: "$",
                            multiple: ""
                        };
                        break;
                    case "Price":
                        return {
                            currency: "$",
                            multiple: ""
                        };
                        break;
                    case "Multiple":
                        return {
                            currency: "",
                            multiple: "x"
                        };
                        break;
                }
        }
    }
});

//Checks scale between millions and billions to adjust values in Valuations Table
getScale = function(footballId) {
    var scale = Footballs.findOne({_id:footballId}).footballScale;
    switch(scale) {
        case "millions":
            return 1;
            break;
        case "billions":
            return 1000;
    }
};

//Returns price for selected comp
getCompPrice = function(companyId) {
    var company = FeedCompanies.findOne({_id:companyId});
    var valuation = Template.parentData(1);
    var valuationDate = valuation.valuationDate;
    var valuationPrice = 0;
    _.each(company.closingPrices, function(closingPrices) {
        if (closingPrices.date == valuationDate) valuationPrice = closingPrices.price;
    });
    return valuationPrice
};

//Returns all values for index
getValuationIndex = function(indexId, valuationId) {
    var valuationType = Valuations.findOne({_id: valuationId}).valuationType;
    var valuationDate = Valuations.findOne({_id: valuationId}).valuationDate;
    switch(valuationType) {
        case "comps":
            var indexComps = FeedCompaniesIndices.findOne({_id: indexId});
            var indexCompsValue = 0;
            _.each(indexComps.values, function (values) {
                if (values.date == valuationDate)
                    indexCompsValue = {
                        evRevenueLtm: values.evRevenueLtm,
                        evRevenueFy1: values.evRevenueFy1,
                        evRevenueFy2: values.evRevenueFy2,
                        evEbitdaLtm: values.evEbitdaLtm,
                        evEbitdaFy1: values.evEbitdaFy1,
                        evEbitdaFy2: values.evEbitdaFy2,
                        priceEarningsLtm: values.priceEarningsLtm,
                        priceEarningsFy1: values.priceEarningsFy1,
                        priceEarningsFy2: values.priceEarningsFy2
                    }
            });
            return indexCompsValue;
            break;
        case "deals":
            var indexDeals = FeedDealsIndices.findOne({_id:indexId});
            var indexDealsValue = 0;
            _.each(indexDeals.values, function(values) {
                if (values.date == null)
                    indexDealsValue = {
                        evRevenueLtm: values.evRevenueLtm,
                        evEbitdaLtm: values.evEbitdaLtm
                    }
            });
            return indexDealsValue;
    }
};

getStat = function(count, existingModel, menuStat) {
    if(count > 0) {
        return existingModel;
    } else {
        return menuStat
    }
};

