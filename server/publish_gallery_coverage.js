////GALLERY COVERAGE

//COVERAGE - FOOTBALLS
Meteor.publish('galleryFootballsUser', function() {
    var currentUserId = this.userId;
    return Footballs.find({ownerId: currentUserId});
});

Meteor.publish('galleryFootballsShared', function() {
    var currentUserId = this.userId;
    return Footballs.find({viewers:{$in:[currentUserId]}});
});

Meteor.publish('galleryItemFootballsTargetCompany', function(footballId) {
    check(footballId, String);
    var football = Footballs.findOne({_id:footballId});
    if(football) {
        var targetId = football.footballTarget.targetId;
        return FeedCompanies.find({_id: targetId}, {fields: {
            _id: 1,
            companyName: 1,
            ticker: 1
        }});
    }
});

//COVERAGE - VALUATIONS
Meteor.publish('galleryValuations', function() {
    var currentUserId = this.userId;
    return Valuations.find({$and:[{ownerId: currentUserId},{valuationFavorite:true}]}, {
        fields:{
            _id:1,
            ownerId: 1,
            marketType: 1,
            valuationName: 1,
            valuationType: 1,
            valuationElement: 1,
            valuationSelections: 1,
            valuationFavorite: 1
        }
    });
});

//COVERAGE - TARGETS
Meteor.publish('galleryItemTargetsBase', function(targetId) {
    check(targetId, String);
    return FeedCompanies.find({_id:targetId}, {
        fields: {
            _id: 1,
            companyName: 1,
            status: 1,
            ticker: 1
        }
    });
});

Meteor.publish('galleryItemTargetsBlock', function(targetId) {
    check(targetId, String);
    return FeedCompanies.find({_id:targetId}, {
        fields: {
            _id: 1,
            sector: 1,
            subSector: 1
        }
    });
});

//NOTIFICATIONS
Meteor.publish('notifications', function() {
    var currentUserId = this.userId;
    return Notifications.find({receiverId: currentUserId});
});