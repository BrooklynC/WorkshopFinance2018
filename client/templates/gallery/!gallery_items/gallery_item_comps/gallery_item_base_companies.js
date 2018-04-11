Template.GalleryItemBaseComps.events({
});

Template.GalleryItemBaseComps.helpers({
    compTicker: function() {
        var status = this.status;
        switch(status) {
            case "public":
                return this.ticker;
                break;
            case "private":
                return '';
                break;
        }
    },
    //Formatting helper to use around Output Period if shown
    paren: function() {
        var status = this.status;
        switch(status) {
            case "public":
                return {
                    open: "(",
                    close: ")"
                };
                break;
            case "private":
                return '';
                break;
        }
    }
});