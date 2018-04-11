//Private Company Add form - only appears if Target tab is active.  Not currently used.
Template.GalleryTargetPrivateAdd.events({
    'submit form': function(e) {
        e.preventDefault();

        var field = $(e.target).find('[id=galleryPrivateAdd]');
        var selection = field.val();

        var target = {
            companyName: selection
        };

        var coverage = Session.get('sessionCoverageType');
        if(coverage == "targets") {
            if(TargetsCompanies.findOne({companyName:selection})) {
                console.log("Do nothing");
            } else {
                Meteor.call('targetPrivateAdd', target, function(error, result) {
                });
            }
        }
        field.val('');
    }
});
