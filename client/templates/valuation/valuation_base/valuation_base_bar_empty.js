Template.ValuationBaseBarEmpty.helpers({
    barEmpty: function() {
        var valuationType = Template.parentData(0).valuationType;
        switch (valuationType) {
            case "comps":
                return "bar-empty-comps";
                break;
            case "deals":
                return "bar-empty-deals";
                break;
            case "models":
                return "bar-empty-models";
                break;
            case "custom":
                return "bar-empty-custom";
                break;
        }
    },
    valuationId: function() {
        return Template.parentData(0)._id;
    }
});

