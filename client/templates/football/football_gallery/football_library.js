Template.FootballLibrary.events({
    'click #btn-comps': function(e) {
        e.preventDefault();

        var library = "Comps";

        Session.set('sessionLibrarySource', "Public");
        Session.set('sessionLibraryType', library);
        localSelections.remove({})
    },
    'click #btn-comps-indices': function(e) {
        e.preventDefault();

        var library = "Comps Indices";

        Session.set('sessionLibrarySource', "Public");
        Session.set('sessionLibraryType', library);
        localSelections.remove({})
    },
    'click #btn-deals': function(e) {
        e.preventDefault();

        var library = "Deals";

        Session.set('sessionLibrarySource', "Public");
        Session.set('sessionLibraryType', library);
        localSelections.remove({})
    },
    'click #btn-deals-indices': function(e) {
        e.preventDefault();

        var library = "Deals Indices";

        Session.set('sessionLibrarySource', "Public");
        Session.set('sessionLibraryType', library);
        localSelections.remove({})
    },
    'click #btn-valuations': function(e) {
        e.preventDefault();

        Session.set('sessionLibrarySource', "Private");
        Session.set('sessionLibraryType', "Valuations");
        localSelections.remove({})
    }
});

Template.FootballLibrary.helpers({
    compsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var libraryType = Session.get('sessionLibraryType');
        if(libraryType == "Comps") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    },
    compsIndicesSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var libraryType = Session.get('sessionLibraryType');
        if(libraryType == "Comps Indices") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    },
    dealsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var libraryType = Session.get('sessionLibraryType');
        if(libraryType == "Deals") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    },
    dealsIndicesSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var libraryType = Session.get('sessionLibraryType');
        if(libraryType == "Deals Indices") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    },
    valuationsSelected: function() {
        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId: currentUserId}).theme;
        var libraryType = Session.get('sessionLibraryType');
        if(libraryType == "Valuations") {
            switch (theme) {
                case "light":
                    return "is-selected-light";
                    break;
                case "dark":
                    return "is-selected-dark";
                    break;
            }
        } else {
            switch (theme) {
                case "light":
                    return "is-notselected-light";
                    break;
                case "dark":
                    return "is-notselected-dark";
                    break;
            }
        }
    },
    sectorScreen: function() {
        var libraryType = Session.get('sessionLibraryType');
        switch(libraryType) {
            case "Comps":
                return Template.GalleryLibraryScreenComp;
                break;
            case "Comps Indices":
                return Template.Blank;
                break;
            case "Deals":
                return Template.GalleryLibraryScreenDeal;
                break;
            case "Deals Indices":
                return Template.Blank;
                break;
            case "Valuations":
                return Template.Blank;
                break;
        }
    },
    nameTrue: function() {
        var librarySource = Session.get('sessionLibrarySource');
        var libraryType = Session.get('sessionLibraryType');

        switch(librarySource) {
            case "Public":
                if(libraryType == "Comps Indices" || libraryType == "Deals Indices") {
                    return true
                }
                break;
            case "Private":
                return true;
                break;
        }
    },
    libraryName: function() {
        return Session.get('sessionLibraryType');
    }
});

Template.FootballLibrary.onCreated (function () {
});

