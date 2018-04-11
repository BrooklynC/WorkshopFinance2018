Template.ValuationBaseBarHold.helpers({
    barHold: function() {
        var valuationType = Template.parentData(0).valuationType;
        switch (valuationType) {
            case "comps":
                return "bar-hold-comps";
                break;
            case "deals":
                return "bar-hold-deals";
                break;
            case "models":
                return "bar-hold-models";
                break;
            case "custom":
                return "bar-hold-custom";
                break;
        }
    },
    valuationId: function() {
        return Template.parentData(0)._id;
    }
});

