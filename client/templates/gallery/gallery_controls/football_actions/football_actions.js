//sessionActions toggles template showing input box for username to save/send/share football
//BC-note: perhaps replace with ReactiveVar
Session.set('sessionActions', "none");

Template.FootballActions.events({
    'click .btn-send': function(e) {
        e.preventDefault();

        var currentUserId = Meteor.userId();
        var ownerId = this.ownerId;
        if(currentUserId == ownerId) {
            var currentFootballId = this._id;
            var currentActive = Footballs.findOne({_id:currentFootballId}).footballLive;
            if(currentActive == true) {
                Session.set('sessionActions', "send");
            }
        }
    },
    'click .btn-share': function(e) {
        e.preventDefault();

        var currentUserId = Meteor.userId();
        var ownerId = this.ownerId;
        if(currentUserId == ownerId) {
            var currentFootballId = this._id;
            var currentActive = Footballs.findOne({_id:currentFootballId}).footballLive;
            if(currentActive == true) {
                Session.set('sessionActions', "share");
            }
        }
    },
    'click .btn-delete': function(e) {
        e.preventDefault();

        var currentUserId = Meteor.userId();
        var ownerId = this.ownerId;
        if(currentUserId == ownerId) {
            Session.set('sessionActions', "delete");
        }
    }
});