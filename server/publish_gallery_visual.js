//GALLERY - CONTROLS
Meteor.publish('galleryFootballActive', function(footballActive) {
    check(footballActive, String);
    return Footballs.find({_id:footballActive});
});

