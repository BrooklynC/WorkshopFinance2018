Template.ValuationBuildTableModel.events ({
    'click .btn-remove': function(e) {
        e.preventDefault();

        var currentValuationId = Template.parentData(0)._id;
        var currentSelection = this._id;

        var ownerId = Template.parentData(1).ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            if (confirm("Delete this comp?")) {
                Meteor.call('valuationBuildPull', currentUserId, currentValuationId, currentSelection, function(error, result) {
                });
            }
        }
    }
});

Template.ValuationBuildTableModel.helpers({
    selections: function() {
        //Changes cursor used to display selections depending on valuationType and valuationElement
        var selections = this.valuationSelections;
        return Models.find({_id: {$in: selections}});
    },
    modelStat: function() {
        return this.values.stat;
    },
    modelValue: function() {
        var stat = this.values.stat;
        switch(stat) {
            case "Enterprise Value":
                var scale = Template.parentData(2).footballScale;
                switch(scale) {
                    case "millions":
                        return this.values.enterpriseValue;
                        break;
                    case "billions":
                        return this.values.enterpriseValue / 1000;
                        break;
                }
                break;
            case "Price per Share":
                return this.values.pricePerShare;
                break;
            case "EV/Revenue (LTM)":
                return this.values.evRevenueLtm;
                break;
            case "EV/Revenue (FY1)":
                return this.values.evRevenueFy1;
                break;
            case "EV/Revenue (FY2)":
                return this.values.evRevenueFy2;
                break;
            case "EV/EBITDA (LTM)":
                return this.values.evEbitdaLtm;
                break;
            case "EV/EBITDA (FY1)":
                return this.values.evEbitdaFy1;
                break;
            case "EV/EBITDA (FY2)":
                return this.values.evEbitdaFy2;
                break;
            case "P/E (LTM)":
                return this.values.priceEarningsLtm;
                break;
            case "P/E (FY1)":
                return this.values.priceEarningsFy1;
                break;
            case "P/E (FY2)":
                return this.values.priceEarningsFy2;
                break;
        }
    },
    modelImplied: function() {
        var footballOutput = Template.parentData(2).footballOutput;
        var valuationMetric = Template.parentData(1).valuationMetric;
        var valuationPeriod = Template.parentData(1).valuationPeriod;
        switch(footballOutput) {
            case "Enterprise Value":
                var scale = Template.parentData(2).footballScale;
                switch(scale) {
                    case "millions":
                        return this.values.enterpriseValue;
                        break;
                    case "billions":
                        return this.values.enterpriseValue / 1000;
                        break;
                }
                break;
            case "Price per Share":
                return this.values.pricePerShare;
                break;
            case "Multiple":
                switch (valuationMetric) {
                    case "EV/Revenue":
                        switch(valuationPeriod) {
                            case "LTM":
                                return this.values.evRevenueLtm;
                                break;
                            case "FY1":
                                return this.values.evRevenueFy1;
                                break;
                            case "FY2":
                                return this.values.evRevenueFy2;
                                break;
                        }
                        break;
                    case "EV/EBITDA":
                        switch(valuationPeriod) {
                            case "LTM":
                                return this.values.evEbitdaLtm;
                                break;
                            case "FY1":
                                return this.values.evEbitdaFy1;
                                break;
                            case "FY2":
                                return this.values.evEbitdaFy2;
                                break;
                        }
                        break;
                    case "P/E":
                        switch(valuationPeriod) {
                            case "LTM":
                                return this.values.priceEarningsLtm;
                                break;
                            case "FY1":
                                return this.values.priceEarningsFy1;
                                break;
                            case "FY2":
                                return this.values.priceEarningsFy2;
                                break;

                        }
                        break;
                }
                break;
        }
    },
    modelCurrency: function() {
        var stat = this.values.stat;
        if(stat == "Enterprise Value" || stat == "Price per Share") {
            return "$";
        } else {
            return "";
        }
    },
    modelFormat: function(a) {
        var stat = this.values.stat;
        if(stat === "Price per Share") {
            return numeral(a).format('0,0.00');
        } else {
            return numeral(a).format('0,0.0');
        }
    },
    modelMultiple: function() {
        var stat = this.values.stat;
        if(stat == "Enterprise Value" || stat == "Price per Share") {
            return "";
        } else {
            return "x";
        }
    },
    modelImpliedCurrency: function() {
        var footballOutput = Template.parentData(2).footballOutput;
        switch(footballOutput) {
            case "Enterprise Value":
                return "$";
                break;
            case "Price per Share":
                return "$";
                break;
            case "Multiple":
                return "";
                break;
        }
    },
    modelImpliedFormat: function(a) {
        var footballOutput = Template.parentData(2).footballOutput;
        if(footballOutput === "Price per Share") {
            return numeral(a).format('0,0.00');
        } else {
            return numeral(a).format('0,0.0');
        }
    },
    modelImpliedMultiple: function() {
        var footballOutput = Template.parentData(2).footballOutput;
        switch(footballOutput) {
            case "Enterprise Value":
                return "";
                break;
            case "Price per Share":
                return "";
                break;
            case "Multiple":
                return "x";
                break;
        }
    },
    result: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id:footballId});
        var output = football.footballOutput;
        var valuationId = this._id;
        var valuationSelections = this.valuationSelections;
        var scaleAdjust = getScale(footballId);
        if (valuationSelections.length > 0) {
            if (output == "Enterprise Value") {
                return getResultValue(footballId, valuationId) / scaleAdjust;
            } else {
                return getResultValue(footballId, valuationId);
            }
        }
    }
});

