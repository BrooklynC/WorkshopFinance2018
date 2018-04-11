Template.ValuationBaseDetails.events({
    'click .valuation-name-value': function(e) {
        e.preventDefault();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();
        var nameState = Template.instance().showName.get();

        if(currentUserId == ownerId) {
            if(nameState == true) {
                Template.instance().showName.set(false);
            }
        }
    },
    'submit .valuation-name-form': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var valuationName = $(e.target).find('[name=valuation-name-edit]').val();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('valuationNameUpdate', currentValuationId, valuationName, function(error, result) {
            });
            Template.instance().showName.set(true)
        }
    }
});

Template.ValuationBaseDetails.helpers({
    //Changes between button that displays name and input to change name
    showName: function() {
        return Template.instance().showName.get();
    },
    isValuations: function() {
        var selections = this.valuationSelections;
        var count = selections.length;
        if(count > 0) {
            return true
        }
    },
    isOutput: function() {
        var footballId = Template.parentData(1)._id;
        var footballOutput = Footballs.findOne({_id:footballId}).footballOutput;
        var footballType = Footballs.findOne({_id:footballId}).footballType;
        var valuationType = this.valuationType;
        if(valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
            switch(footballType) {
                case "market":
                    return true;
                    break;
                case "target":
                    if(footballOutput == "Multiple") {
                        return true;
                    }
            }
        } else {
            return true;
        }
    },
    isValue: function() {
        var valuationType = this.valuationType;
        if(valuationType == "comps" || valuationType == "deals") {
            return true
        }
    },
    //Valuation Output matches Football Output if Enterprise Value or Price per Share, otherwise use Valuation Output
    detailOutput: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id:footballId});
        var footballType = football.footballType;
        var footballOutput = football.footballOutput;
        var valuationOutput = this.valuationOutput;
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return valuationOutput;
                break;
            case "deals":
                return valuationOutput;
                break;
            case "models":
                switch(footballType) {
                    case "market":
                        return valuationOutput;
                        break;
                    case "target":
                        switch(footballOutput) {
                            case "Enterprise Value":
                                return "Enterprise Value";
                                break;
                            case "Price per Share":
                                return "Price per Share";
                                break;
                            case "Multiple":
                                return valuationOutput;
                                break;
                        }
                }
                break;
            case "custom":
                var existingCustom = this.existingCustom;
                switch(existingCustom) {
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
                break;
        }
    },
    detailMetric: function() {
        var valuationMetric = this.valuationMetric;
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                    return valuationMetric;
                break;
            case "deals":
                return valuationMetric;
                break;
            case "models":
                return "";
                break;
            case "custom":
                return "";
                break;
        }
    },
    //Show Output Period if footballOutput is Multiple
    periodOutput: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id:footballId});
        var targetId = football.footballTarget.targetId;
        var footballOutput = football.footballOutput;
        var valuationType = this.valuationType;
        var valuationOutputPeriod = this.valuationOutputPeriod;
        var valuationPeriod = this.valuationPeriod;
        switch(valuationType) {
            case "comps":
                if (targetId !== "none") {
                    return valuationOutputPeriod;
                } else {
                    return valuationPeriod
                }
                break;
            case "deals":
                if (targetId !== "none") {
                    return valuationOutputPeriod;
                } else {
                    return valuationPeriod
                }
                break;
            case "models":
                switch(footballOutput) {
                    case "Enterprise Value":
                        return "";
                        break;
                    case "Price per Share":
                        return "";
                        break;
                    case "Multiple":
                        return valuationOutputPeriod;
                        break;
                }
                break;
            case "custom":
                return "";
                break;
        }
    },
    //Show Output Period if footballOutput is Multiple
    periodMetric: function() {
        var valuationType = this.valuationType;
        var valuationPeriod = this.valuationPeriod;
        switch(valuationType) {
            case "comps":
                return valuationPeriod;
                break;
            case "deals":
                return valuationPeriod;
                break;
            case "models":
                return "";
                break;
            case "custom":
                return valuationPeriod;
                break;
        }
    },
    //Formatting helper to use around Output Period if shown
    parenOutput: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return {
                    open: "(",
                    close: ")"
                };
                break;
            case "deals":
                return {
                    open: "(",
                    close: ")"
                };
                break;
            case "models":
                var footballOutput = Template.parentData(1).footballOutput;
                switch(footballOutput) {
                    case "Enterprise Value":
                        return {
                            open: "",
                            close: ""
                        };
                        break;
                    case "Price per Share":
                        return {
                            open: "",
                            close: ""
                        };
                        break;
                    case "Multiple":
                        return {
                            open: "(",
                            close: ")"
                        };
                        break;
                }
                break;
            case "custom":
                return {
                    open: "",
                    close: ""
                };
                break;
        }
    },
    //Formatting helper to use around Output Period if shown
    parenBuild: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return {
                    open: "(",
                    close: ")"
                };
                break;
            case "deals":
                return {
                    open: "(",
                    close: ")"
                };
                break;
            case "models":
                var footballOutput = Template.parentData(1).footballOutput;
                switch(footballOutput) {
                    case "Enterprise Value":
                        return {
                            open: "",
                            close: ""
                        };
                        break;
                    case "Price per Share":
                        return {
                            open: "",
                            close: ""
                        };
                        break;
                    case "Multiple":
                        return {
                            open: "",
                            close: ""
                        };
                        break;
                }
                break;
            case "custom":
                return {
                    open: "",
                    close: ""
                };
                break;
        }
    },
    hold: function() {
        var valuationType = this.valuationType;
        if(valuationType == "custom") {
            var footballOutput = Template.parentData(1).footballOutput;
            var existingCustom = this.existingCustom;
            switch(footballOutput) {
                case "Enterprise Value":
                    if(existingCustom !== "Value") {
                        return "*Not in calculations";
                    }
                    break;
                case "Price per Share":
                    if(existingCustom !== "Price") {
                        return "*Not in calculations";
                    }
                    break;
                case "Multiple":
                    if(existingCustom !== "Multiple") {
                        return "*Not in calculations";
                    }
                    break;
            }
        }
    },
    asOf: function() {
        var valuationType = this.valuationType;
        if(valuationType == "comps") {
            return "as of";
        }
    },
    valuationDateComp: function() {
        var valuationType = this.valuationType;
        var valuationDate = this.valuationDate;
        if(valuationType == "comps") {
            return valuationDate;
        }
    },
    valuationId: function() {
        return this._id;
    }
});

Template.ValuationBaseDetails.onCreated (function () {
    this.showName = new ReactiveVar(true);
});