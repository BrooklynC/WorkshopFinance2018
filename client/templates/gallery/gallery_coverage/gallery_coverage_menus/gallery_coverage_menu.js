Session.set('sessionCoverageType', "Footballs");

Template.CoverageMenu.events({
    'click .menu-coverage': function(e) {
        e.preventDefault();

        var coverage = $(e.target).text();

        Session.set('sessionCoverageType', coverage);
        localSelections.remove({})
    }
});

Template.CoverageMenu.helpers({
    coverage: function() {
        return Session.get('sessionCoverageType');
    }
});