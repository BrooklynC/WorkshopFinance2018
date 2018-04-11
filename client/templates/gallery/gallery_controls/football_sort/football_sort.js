//Changes Football Output options and updates Football document
Template.FootballSort.events({
    'click .menu-sort-text': function(e) {
        e.preventDefault();

        var newFootballSort = $(e.target).text();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('footballSortUpdate', currentFootballId, newFootballSort, function(error, result) {
            });
        }
    }
});
