Template.ValuationBuildTableCustom.events ({
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

Template.ValuationBuildTableCustom.helpers({
    selections: function() {
        //Changes cursor used to display selections depending on valuationType and valuationElement
        var valuationSelections = this.valuationSelections;
        return Customs.find({_id: {$in: valuationSelections}});
    },
    stat: function() {
        var customStat = this.values.customStat;
        switch(customStat) {
            case "Value":
                return "Custom Enterprise Value";
                break;
            case "Price":
                return "Custom Price";
                break;
            case "Multiple":
                return "Custom Multiple";
                break;
        }
    },
    value: function() {
        var stat = this.values.customStat;
        if(stat == "Value") {
            var scale = Template.parentData(2).footballScale;
            switch(scale) {
                case "millions":
                    return this.values.customValue;
                    break;
                case "billions":
                    return this.values.customValue / 1000;
                    break;
            }
        } else {
            return this.values.customValue;
        }

    },
    customCurrency: function() {
        var stat = this.values.customStat;
        if(stat == "Value" || stat == "Price") {
            return "$";
        } else {
            return "";
        }
    },
    customFormat: function(a) {
        var stat = this.values.customStat;
        if(stat === "Price") {
            return numeral(a).format('0,0.00');
        } else {
            return numeral(a).format('0,0.0');
        }
    },
    customMultiple: function() {
        var stat = this.values.customStat;
        if(stat == "Value" || stat == "Price") {
            return "";
        } else {
            return "x";
        }
    },
    result: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id: footballId});
        var output = football.footballOutput;
        var valuationId = this._id;
        var valuationSelections = this.valuationSelections;
        var scaleAdjust = getScale(footballId);
        if (valuationSelections.length > 0) {
            var valuationType = this.valuationType;
            if (valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
                if (output == "Enterprise Value") {
                    return getResultValue(footballId, valuationId) / scaleAdjust;
                } else {
                    return getResultValue(footballId, valuationId);
                }
            } else {
                var existingCustom = this.existingCustom;
                if(existingCustom == "Value") {
                    return getResultValue(footballId, valuationId) / scaleAdjust;
                } else {
                    return getResultValue(footballId, valuationId);
                }
            }
        }
    }
});

