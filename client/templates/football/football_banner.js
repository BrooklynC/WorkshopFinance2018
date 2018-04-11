//Toggles Football Name between form and text view
Template.FootballBanner.events({
});

Template.FootballBanner.helpers({
    footballDetails: function() {
        var footballContent = Session.get('footballContent');
        switch(footballContent) {
            case "field":
                return Template.FootballBannerDetails;
                break;
            case "controls":
                return Template.FootballBannerDetails;
                break;
            case "library":
                return Template.FootballBannerDetails;
                break;
            case "coverage":
                return Template.FootballBannerLogo;
                break;
            case "profile":
                return Template.FootballBannerLogo;
                break;
        }
    }
});

Template.FootballBanner.onCreated (function () {
});