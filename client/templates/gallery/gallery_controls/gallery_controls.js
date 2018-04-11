Template.GalleryControls.events({
    'click #football-name-value': function(e) {
        e.preventDefault();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();
        var nameState = Template.instance().showName.get();

        if(currentUserId == ownerId) {
            if(nameState == true) {
                Template.instance().showName.set(false);
            }
        }
    },
    'submit #football-name-form': function(e) {
        e.preventDefault();

        var currentFootballId = this._id;
        var footballName = $(e.target).find('[name=football-name-edit]').val();

        Meteor.call('footballNameUpdate', currentFootballId, footballName, function(error, result) {
        });
        Template.instance().showName.set(true)
    },
    'click #gallery-controls-base': function(e) {
        e.preventDefault();

        var sessionGalleryExisting = Session.get('sessionGallery');
        Session.set('sessionGallery', "controls");
        var sessionGalleryNew = Session.get('sessionGallery');

        if(sessionGalleryExisting !== sessionGalleryNew) {
            localSelections.remove({})
        }
    }
});

Template.GalleryControls.helpers({
    currentFootballId: function () {
        var currentUserId = Meteor.userId();
        var footballActive = Options.findOne({ownerId:currentUserId}).footballActive;
        return Footballs.findOne({_id:footballActive});
    },
    targetName: function() {
        var footballType = this.footballType;
        if (footballType == "market") {
            return "Market Comparison";
        } else {
            var targetId = this.footballTarget.targetId;
            var target = FeedCompanies.findOne({_id: targetId});
            return target.companyName;
        }
    },
    showName: function() {
        return Template.instance().showName.get();
    }

});

Template.GalleryControls.onCreated (function () {
    var self = this;
    this.showName = new ReactiveVar(true);
    self.autorun(function() {
        var currentUserId = Meteor.userId();
        var footballActive = Options.findOne({ownerId:currentUserId}).footballActive;
        self.subscribe('galleryFootballActive', footballActive);
        self.subscribe('feedCompaniesAll');
    });
});