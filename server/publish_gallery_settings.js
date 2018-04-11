////GALLERY SETTINGS

Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
});

Meteor.publish('galleryOwnerValuations', function(ownerId) {
    check(ownerId, String);
    return Valuations.find({ownerId: ownerId});
});

Meteor.publish('galleryOwnerFootballs', function(ownerId) {
    check(ownerId, String);
    return Footballs.find({ownerId: ownerId});
});

