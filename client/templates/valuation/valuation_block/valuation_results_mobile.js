Template.ValuationResultsMobile.helpers({
    output: function() {
        var valuationType = this.valuationType;
        var footballType = Template.parentData(1).footballType;
        var footballOutput = Template.parentData(1).footballOutput;
        switch(valuationType) {
            case "comps":
                switch(footballType) {
                    case "market":
                        return Template.ValuationResultsOutput;
                        break;
                    case "target":
                        if(footballOutput == "Multiple") {
                            return Template.ValuationResultsOutputMultiples;
                        } else {
                            return Template.ValuationResultsOutput;
                        }
                        break;
                }
                break;
            case "deals":
                switch(footballType) {
                    case "market":
                        return Template.ValuationResultsOutput;
                        break;
                    case "target":
                        if(footballOutput == "Multiple") {
                            return Template.ValuationResultsOutputMultiples;
                        } else {
                            return Template.ValuationResultsOutput;
                        }
                        break;
                }
                break;
            case "models":
                return Template.ValuationResultsOutput;
                break;
            case "custom":
                return Template.ValuationResultsOutput;
                break;
        }
    },
    valuationResultsBuild: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return Template.ValuationResultsBuild;
                break;
            case "deals":
                return Template.ValuationResultsBuild;
                break;
            case "models":
                return Template.ValuationResultsBuild;
                break;
            case "custom":
                return Template.Blank;
                break;
        }
    },
    isCompsDeals: function() {
        var type = this.valuationType;
        if(type == "comps" || type == "deals") {
            return true
        }
    },
    asOfOption: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return "As of";
                break;
            case "deals":
                return "As of";
                break;
            case "models":
                return "";
                break;
            case "custom":
                return "";
                break;
        }
    },
    dateOption: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return Template.ValuationDateMobile;
                break;
            case "deals":
                return Template.ValuationDateMobile;
                break;
            case "models":
                return Template.Blank;
                break;
            case "custom":
                return Template.Blank;
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
            var valuationType = this.valuationType;
            if (valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
                if (output == "Enterprise Value") {
                    return getResultValue(footballId, valuationId) / scaleAdjust;
                } else {
                    return getResultValue(footballId, valuationId);
                }
            } else {
                var existingCustom = this.existingCustom;
                if(existingCustom == "customValue") {
                    return getResultValue(footballId, valuationId) / scaleAdjust;
                } else {
                    return getResultValue(footballId, valuationId);
                }
            }
        }
    },
    scale: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id: footballId});
        var footballOutput = football.footballOutput;
        var footballScale = football.footballScale;
        if (footballOutput == "Enterprise Value") {
            switch (footballScale) {
                case "millions":
                    return "million";
                    break;
                case "billions":
                    return "billion";
                    break;
            }
        }
    },
    valuationId: function() {
        return this._id;
    }
});