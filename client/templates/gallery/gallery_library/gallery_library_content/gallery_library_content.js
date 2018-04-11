//Changes documents to show depending on which Gallery is active.
//One Gallery Item template, content changes depending on active.
Template.LibraryContent.helpers({
    library: function() {
        var sessionLibraryType = Session.get('sessionLibraryType');
        switch (sessionLibraryType) {
            case "Comps":
                var screenSectorComps = Session.get('sessionScreenCompsSector');
                if(screenSectorComps !== '') {
                    var sectorComps = screenSectorComps
                }
                return FeedCompanies.find(
                    {sector: sectorComps}
                );
                break;
            case "Comps Indices":
                return FeedCompaniesIndices.find({});
                break;
            case "Deals":
                var screenSectorDeals = Session.get('sessionScreenDealsSector');
                if(screenSectorDeals !== '') {
                    var sectorDeals = screenSectorDeals
                }
                return FeedDeals.find(
                    {sector: sectorDeals}
                );
                break;
            case "Deals Indices":
                return FeedDealsIndices.find({});
                break;
            case "Valuations":
                var currentUserId = Meteor.userId();
                return Valuations.find({
                    $and: [
                        {
                            ownerId: currentUserId
                        },
                        {
                            valuationFavorite: true
                        }
                    ]
                });
                break;
        }
    }
});

Template.LibraryContent.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('galleryCompanies');
        self.subscribe('galleryCompaniesIndices');
        self.subscribe('galleryDeals');
        self.subscribe('galleryDealsIndices');
        self.subscribe('galleryValuations');
    });
});