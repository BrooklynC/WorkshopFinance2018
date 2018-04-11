Template.ValuationResultsOutput.helpers({
    isMarket: function() {
        var footballId = Template.parentData(1)._id;
        var footballType = Footballs.findOne({_id:footballId}).footballType;
        if(footballType == "market") {
            return true;
        }
    },
    valueOption: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id:footballId});
        return football.footballOutput;
    },
    isMultiple: function() {
        var footballOutput = Template.parentData(1).footballOutput;
        if(footballOutput == "Multiple") {
            return true
        }
    },
    isCustom: function() {
        var valuationType = this.valuationType;
        if(valuationType == "custom") {
            return true
        }
    },
    custom: function() {
        var existing = this.existingCustom;
        switch(existing) {
            case "Value":
                return "Enterprise Value";
                break;
            case "Price":
                return "Price per Share";
                break;
            case "Multiple":
                return "Multiple";
                break;
        }
    }
});