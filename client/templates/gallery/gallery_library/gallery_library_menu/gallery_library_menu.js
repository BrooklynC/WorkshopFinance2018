Session.set('sessionLibraryType', "Comps");
Session.set('sessionLibrarySource', "Public");

Template.LibraryMenu.events({
    'click .menu-library-filter': function(e) {
        e.preventDefault();

        var library = $(e.target).text();

        Session.set('sessionLibraryType', library);
        localSelections.remove({})
    }
});

Template.LibraryMenu.helpers({
    libraryType: function() {
        return Session.get('sessionLibraryType');
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
    }
});