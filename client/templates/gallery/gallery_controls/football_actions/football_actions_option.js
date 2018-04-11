//Add username, run method to send or share
Template.FootballActionsOption.events({
    'submit form': function(e) {
        e.preventDefault();

        var field = $(e.target).find('[id=selection]');
        var selection = field.val();

        var currentFootballId = this._id;
        var sessionActions = Session.get('sessionActions');

        switch(sessionActions) {
            case "send":
                return Meteor.call('footballSend', currentFootballId, selection, function () {
                    Session.set('sessionActions', "none");
                });
                break;
            case "share":
                return Meteor.call('footballShare', currentFootballId, selection, function () {
                    Session.set('sessionActions', "none");
                });
                break;
            case "delete":
                return Meteor.call('footballRemove', currentFootballId, function () {
                    Session.set('sessionActions', "none");
                    Session.set('sessionValuations',"array");
                });
                break;
        }
        field.val('');
    },
    'click #football-action-cancel': function(e) {
        e.preventDefault();

        Session.set('sessionActions', "none");
    }
});

//Select new target to attach to new Football
//Different method will be run depending on whether target is selected
Template.FootballActionsOption.helpers({
    isNotNone: function() {
        var sessionActions = Session.get('sessionActions');
        if(sessionActions !== "none") {
            return true
        }
    },
    isDelete: function() {
        var sessionActions = Session.get('sessionActions');
        if(sessionActions == "delete") {
            return true
        }
    },
    settings: function() {
        var marketType = this.marketType;
        var action = Session.get('sessionActions');
        switch(action) {
            case "save":
                switch(marketType) {
                    case "company":
                        return {
                            position: "bottom",
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
                break;
            case "send":
                return {
                    position: "bottom",
                    limit: 5,
                    rules: [
                        {
                            token: "",
                            collection: Meteor.users,
                            field: "username",
                            template: Template.GalleryPillUser
                        }
                    ]
                };
                break;
            case "share":
                return {
                    position: "bottom",
                    limit: 5,
                    rules: [
                        {
                            token: "",
                            collection: Meteor.users,
                            field: "username",
                            template: Template.GalleryPillUser
                        }
                    ]
                };
                break;
        }
    },
    //Text for button in new template
    action: function() {
        return Session.get('sessionActions');
    }
});

Template.FootballActionsOption.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('pillFeedComps');
    });
});