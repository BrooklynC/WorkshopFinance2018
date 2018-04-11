Template.GalleryItemBlockDeals.events({
});

Template.GalleryItemBlockDeals.helpers({
    //Show different fields if Deal or Deal Index
    annDate: function() {
        var date = this.dealTerms.annDate;
        return moment(date, ["MM-DD-YYYY"]);
    }
});