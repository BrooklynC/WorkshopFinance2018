Template.LibraryControls.helpers({
    isValuations: function () {
        var library = Session.get('sessionLibraryType');

        if(library == "Valuations") {
            return true
        }
    }
});