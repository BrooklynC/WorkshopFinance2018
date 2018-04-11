////////FOOTBALL
Meteor.publish('football', function(footballId) {
    check(footballId, String);
    return Footballs.find({_id:footballId});
});

Meteor.publish('footballValuations', function() {
    var currentUserId = this.userId;
    return Valuations.find({ownerId: currentUserId});
});

Meteor.publish('footballValuationsShared', function() {
    var currentUserId = this.userId;
    return Valuations.find({viewers:{$in:[currentUserId]}});
});

Meteor.publish('feedCompaniesAll', function() {
    return FeedCompanies.find({});
});

Meteor.publish('feedCompaniesIndicesAll', function() {
    return FeedCompaniesIndices.find({});
});

Meteor.publish('feedDealsAll', function() {
    return FeedDeals.find({});
});

Meteor.publish('feedDealsIndicesAll', function() {
    return FeedDealsIndices.find({});
});

Meteor.publish('modelsUser', function() {
    var currentUserId = this.userId;
    return Models.find({ownerId:currentUserId});
});

Meteor.publish('modelsShared', function() {
    var currentUserId = this.userId;
    return Models.find({viewers:{$in:[currentUserId]}});
});

Meteor.publish('customsUser', function() {
    var currentUserId = this.userId;
    return Customs.find({ownerId:currentUserId});
});

Meteor.publish('customsShared', function() {
    var currentUserId = this.userId;
    return Customs.find({viewers:{$in:[currentUserId]}});
});

//Meteor.publish('footballValuations', function(footballId) {
//    check(footballId, String);
//    var footballValuations = Footballs.findOne({_id:footballId}).footballValuations;
//    return Valuations.find({_id: {$in: footballValuations}});
//});

