Session.set('sessionIsSelectedId', null);

Template.CoverageItem.events({
    'click .gallery-item-detail': function() {
        var coverage = Session.get('sessionCoverageType');

        if(coverage == "Footballs") {
            var currentUserId = Meteor.userId();
            var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;
            var newFootballId = this._id;
            Session.set('sessionIsSelectedId', newFootballId);

            Meteor.call('footballOpen', currentFootballId, newFootballId, function() {
                Session.set('sessionValuations', "array");
            });
            Session.set('footballContent', "field");
        } else {
            var id = this._id;
            if(localSelections.findOne({_id:id})) {
                localSelections.remove({_id:id});
            } else {
                localSelections.insert({_id:id});
            }
        }
    }
});

Template.CoverageItem.helpers({
    itemBase: function() {
        var coverage = Session.get('sessionCoverageType');
        switch(coverage) {
            case "Footballs":
                return Template.GalleryItemBaseFootballs;
                break;
            case "Targets":
                return Template.GalleryItemBaseTargets;
                break;
        }
    },
    itemBlock: function() {
        var coverage = Session.get('sessionCoverageType');
        switch(coverage) {
            case "Footballs":
                return Template.GalleryItemBlockFootballs;
                break;
            case "Targets":
                return Template.GalleryItemBlockTargets;
                break;
        }
    },
    collapseId: function() {
        var coverage = Session.get('sessionCoverageType');
        switch(coverage) {
            case "Footballs":
                return this._id;
                break;
            case "Valuations":
                return this._id;
                break;
            case "Targets":
                return this.targetId;
                break;
        }
    },
    itemAction: function() {
        var coverage = Session.get('sessionCoverageType');
        switch(coverage) {
            case "Footballs":
                var currentUserId = Meteor.userId();
                var currentFootballId = Template.parentData(0)._id;
                var notification = Notifications.findOne({receiverId:currentUserId,itemId:currentFootballId});
                if(!notification) {
                    return Template.GalleryItemSelect;
                } else {
                    var read = notification.read;
                    switch(read) {
                        case true:
                            return Template.GalleryItemSelect;
                            break;
                        case false:
                            return Template.GalleryItemFootballReceive;
                            break;
                    }
                }
                break;
            case "Targets":
                return Template.GalleryItemFootballAdd;
                break;
        }
    },
    isSelected: function() {
        var currentUserId = Meteor.userId();
        var id = this._id;
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var coverage = Session.get('sessionCoverageType');
        switch (coverage) {
            case "Footballs":
                var selected = Options.findOne({ownerId:currentUserId}).footballActive;
                //var selected = Session.get('sessionIsSelectedId');
                switch (theme) {
                    case "light":
                        if (id == selected) {
                            return "is-selected-light"
                        } else {
                            return "is-notselected-light"
                        }
                        break;
                    case "dark":
                        if (id == selected) {
                            return "is-selected-dark"
                        } else {
                            return "is-notselected-dark"
                        }
                }
                break;
            case "Targets":
                return "";
                break;
        }
    }
});

Template.CoverageItem.onCreated (function () {
    this.state = new ReactiveDict;
    this.state.set('isSelectedId', null);
});