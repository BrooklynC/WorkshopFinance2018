Template.FootballControls.events({
    'click #football-controls-name-value': function(e) {
        e.preventDefault();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();
        var nameState = Template.instance().showName.get();

        if(currentUserId == ownerId) {
            if(nameState == true) {
                Template.instance().showName.set(false);
            }
        }
    },
    'submit #football-controls-name-form': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;
        var footballName = $(e.target).find('[name=football-controls-name-edit]').val();

        Meteor.call('footballNameUpdate', currentFootballId, footballName, function(error, result) {
        });
        Template.instance().showName.set(true)
    }
});

Template.FootballControls.helpers({
    showName: function() {
        return Template.instance().showName.get();
    }
});

Template.FootballControls.onCreated (function () {
    this.showName = new ReactiveVar(true);
});