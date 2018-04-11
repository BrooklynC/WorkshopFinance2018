Template.GalleryTargetPublicAdd.events({
    'submit form': function(e) {
        e.preventDefault();

        var field = $(e.target).find('[id=galleryAdd]');
        var selection = field.val();

        var marketType = Session.get('sessionCoverageScreenType');

        Meteor.call('targetAdd', selection, marketType, function(error, result) {
            if(error) {
                alert("This public company is already in your Target list.");
            } else {
                return result;
            }
        });

        field.val('');
    }
});

Template.GalleryTargetPublicAdd.helpers({
    targetSettings: function() {
        var marketType = Session.get('sessionCoverageScreenType');
        switch(marketType) {
            case "company":
                return {
                    position: "top",
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
            case "marketTypeB":
                //
                break;
        }
    }
});
