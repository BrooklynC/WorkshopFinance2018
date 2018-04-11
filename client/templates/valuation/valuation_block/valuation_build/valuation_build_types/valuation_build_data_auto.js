Template.ValuationBuildDataAuto.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentFootballId = Template.parentData(1)._id;
        var currentValuationId = this._id;
        var field = $(e.target).find('[id=selection]');
        var selection = field.val();
        field.val('');

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            return Meteor.call('valuationBuildDataAdd', currentFootballId, currentValuationId, selection, function(error, result) {
            });
        }
    }
});

Template.ValuationBuildDataAuto.helpers({
    buildSettings: function() {
        var valuationType = this.valuationType;
        var valuationElement = this.valuationElement;
        var marketType = this.marketType;

        switch(marketType) {
            case "company":
                switch(valuationType) {
                    case "comps":
                        switch(valuationElement) {
                            case "security":
                                return {
                                    position: "bottom",
                                    limit: 5,
                                    rules: [
                                        {
                                            token: "",
                                            collection: FeedCompanies,
                                            field: "ticker",
                                            template: Template.GalleryPillCompany
                                        }
                                    ]
                                };
                                break;
                            case "index":
                                return {
                                    position: "bottom",
                                    limit: 5,
                                    rules: [
                                        {
                                            token: "",
                                            collection: FeedCompaniesIndices,
                                            field: "sector",
                                            template: Template.GalleryPillIndex
                                        }
                                    ]
                                };
                                break;
                        }
                        break;
                    case "deals":
                        switch(valuationElement) {
                            case "security":
                                return {
                                    position: "top",
                                    limit: 5,
                                    rules: [
                                        {
                                            token: "",
                                            collection: FeedDeals,
                                            field: "companyName",
                                            template: Template.GalleryPillDeal
                                        }
                                    ]
                                };
                                break;
                            case "index":
                                return {
                                    position: "bottom",
                                    limit: 5,
                                    rules: [
                                        {
                                            token: "",
                                            collection: FeedDealsIndices,
                                            field: "sector",
                                            template: Template.GalleryPillIndex
                                        }
                                    ]
                                };
                                break;
                        }
                        break;
                }
                break;
            case "marketTypeB":
                //
                break;
        }
    },
    isComps: function() {
        var valuationType = this.valuationType;
        if(valuationType == "comps") {
            return true;
        }
    },
    isSecurity: function() {
        var valuationElement = this.valuationElement;
        if(valuationElement == "security") {
            return true;
        }
    }
});
