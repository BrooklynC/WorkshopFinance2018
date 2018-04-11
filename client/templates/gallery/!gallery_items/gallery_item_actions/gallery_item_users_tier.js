Template.GalleryItemUsersTier.events({
    'click #tier-change': function(e) {
        e.preventDefault();

        var userId = Template.parentData(0)._id;

        Meteor.call('userTierChange', userId, function (error, result) {
        });
    }
});

Template.GalleryItemUsersTier.helpers({
    tier: function() {
        var userId = Template.parentData(0)._id;
        return Meteor.users.findOne({_id: userId}).profile.tier;
    }
});