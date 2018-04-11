//Each new user is assigned an Options document, where user-specific info (target list, active football) is stored
Meteor.users.after.insert(function () {
    var optionsId = Options.insert({ownerId: this._id});
    var footballId = Footballs.insert({
        ownerId:this._id
    });
    var optionsActive = Options.update({_id:optionsId},{$set:{footballActive:footballId}});

    Meteor.users.update({_id:this._id},{$set:{profile:{tier:"A",active:"A"}}});

    return {
        _id: optionsActive
    };
});

//Aggregation method to calculate multiples is rerun on any change to Valuation document
Valuations.after.update(function (userId, doc) {
    var valuationId = doc._id;
    if (doc.valuationSelections !== this.previous.valuationSelections || doc.valuationName !== this.previous.valuationName) {
        Meteor.call('valuationAggregate', valuationId, function (error, result) {
        });
    }
});

//Any new Football created is set as active football.  This filters out footballs that are sent to other users
// (which are new Footballs)
Footballs.after.insert(function () {
    var currentFootballId = this._id;
    var oldOwnerId = this.userId;
    var newOwnerId = Footballs.findOne({_id:currentFootballId}).ownerId;

    if(newOwnerId == oldOwnerId) {
        Options.update({ownerId:oldOwnerId}, {$set: {footballActive: currentFootballId}}, function () {
        });
    }
});

//Meteor.startup(function() {
//    var username = "20a51b00030a62f889396abdb537842f";
//    var password = "072108243509f5d5a327651506fca2e8";
//    var auth = username + ":" + password;
//    //
//    HTTP.call('GET', 'https://api.intrinio.com/companies', {
//        query: "ticker=AAPL",
//        auth: auth
//        },
//        function( error, response ) {
//            if (error) {
//                console.log("Error", error)
//            } else {
//                console.log(response)
//            }
//        });
//});