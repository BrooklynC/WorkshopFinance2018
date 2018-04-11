Template.GalleryItemOpenCoverage.helpers({
    collapseId: function() {
        var coverage = Session.get('sessionCoverageType');
        switch(coverage) {
            case "Targets":
                return this.targetId;
                break;
            case "Footballs":
                return this._id;
                break;
            case "Valuations":
                return this._id;
                break;
        }
    }
});