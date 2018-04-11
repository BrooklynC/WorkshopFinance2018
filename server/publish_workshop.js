////WORKSHOP

Meteor.publish('users', function() {
    return Meteor.users.find({},{fields:{
        username:1,
        profile: 1,
        services: 1,
        status: 1
    }});
});

Meteor.publish('options', function() {
    var currentUserId = this.userId;
    return Options.find({ownerId:currentUserId});
});

Meteor.publish('footballActive', function() {
    var currentUserId = this.userId;
    var footballId = Options.findOne({ownerId:currentUserId}).footballActive;
    return Footballs.find({_id:footballId});
});