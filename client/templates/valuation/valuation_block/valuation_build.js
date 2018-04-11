Template.ValuationBuild.helpers({
    valuationBuildAdd: function() {
        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();
        if (currentUserId == ownerId) {
            var valuationType = this.valuationType;
            switch (valuationType) {
                case "comps":
                    return Template.ValuationBuildSelect;
                    break;
                case "deals":
                    return Template.ValuationBuildSelect;
                    break;
                case "models":
                    return Template.ValuationBuildModel;
                    break;
                case "custom":
                    return Template.ValuationBuildCustom;
                    break;
            }
        } else {
            return Template.Blank;
        }
    },
    valuationBuildTable: function() {
        var valuationType = this.valuationType;
        switch(valuationType) {
            case "comps":
                return Template.ValuationBuildTableData;
                break;
            case "deals":
                return Template.ValuationBuildTableData;
                break;
            case "models":
                return Template.ValuationBuildTableModel;
                break;
            case "custom":
                return Template.ValuationBuildTableCustom;
                break;
        }
    }
});