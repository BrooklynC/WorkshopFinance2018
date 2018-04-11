Session.set('sessionCoverageScreenType', 'company');

Template.GalleryCoverageMenuScreen.events({
    'change #screen-coverage-inner': function(e) {
        e.preventDefault();

        var selection = $(e.target).val();

        Session.set('sessionCoverageScreenType', selection);
    }
});