Template.FootballBannerLogo.helpers({
    themeIsDark: function() {
        var currentUserId = Meteor.userId();

        var theme = Options.findOne({ownerId:currentUserId}).theme;

        if(theme == "dark") {
            return true;
        }
    }
});