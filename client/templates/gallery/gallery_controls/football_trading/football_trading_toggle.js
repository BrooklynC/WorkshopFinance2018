//Turns on Football Trading shape
Template.FootballTradingToggle.events({
    'click #trading-toggle': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        var footballType = this.footballType;

        if (currentUserId == ownerId && footballType == "target") {
            Meteor.call('footballTradingToggle', currentFootballId, function (error, result) {
            });
        }
    }
});

//Changes can only be made by owner, disabled for others
Template.FootballTradingToggle.helpers({
    tradingToggle: function() {
        var trading = this.includeTrading;
        switch(trading) {
            case true:
                return "Hide High/Low";
                break;
            case false:
                return "Show High/Low";
                break;
        }
    }
});
