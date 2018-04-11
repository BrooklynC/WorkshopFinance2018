Template.LibraryItem.events({
    'click .gallery-item-detail': function(e) {
        e.preventDefault();

        var id = this._id;
        if(localSelections.findOne({_id:id})) {
            localSelections.remove({_id:id});
        } else {
            localSelections.insert({_id:id});
        }
    }
});

Template.LibraryItem.helpers({
    itemBase: function() {
        var libraryType = Session.get('sessionLibraryType');
        switch(libraryType) {
            case "Comps":
                return Template.GalleryItemBaseComps;
                break;
            case "Comps Indices":
                return Template.GalleryItemBaseCompsIndices;
                break;
            case "Deals":
                return Template.GalleryItemBaseDeals;
                break;
            case "Deals Indices":
                return Template.GalleryItemBaseDealsIndices;
                break;
            case "Valuations":
                return Template.GalleryItemBaseValuations;
                break;
        }
    },
    itemBlock: function() {
        var libraryType = Session.get('sessionLibraryType');
        switch(libraryType) {
            case "Comps":
                return Template.GalleryItemBlockComps;
                break;
            case "Comps Indices":
                return Template.GalleryItemBlockCompsIndices;
                break;
            case "Deals":
                return Template.GalleryItemBlockDeals;
                break;
            case "Deals Indices":
                return Template.GalleryItemBlockDealsIndices;
                break;
            case "Valuations":
                return Template.GalleryItemBlockValuations;
                break;
        }
    },
    isSelected: function() {
        var currentUserId = Meteor.userId();
        var id = this._id;
        var theme = Options.findOne({ownerId:currentUserId}).theme;
        switch(theme) {
            case "light":
                if (localSelections.findOne({_id: id})) {
                    return "is-selected-light"
                } else {
                    return "is-notselected-light"
                }
                break;
            case "dark":
                if (localSelections.findOne({_id: id})) {
                    return "is-selected-dark"
                } else {
                    return "is-notselected-dark"
                }
        }
    }
});