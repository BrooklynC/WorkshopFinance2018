////GALLERY LIBRARY

//LIBRARY - COMPANIES
Meteor.publish('galleryCompanies', function() {
    return FeedCompanies.find({}, {
        fields: {
            _id: 1,
            companyName: 1,
            status: 1,
            ticker: 1,
            sector: 1,
            subSector: 1
        }
    });
});

Meteor.publish('galleryCompaniesIndices', function() {
    return FeedCompaniesIndices.find({}, {
        fields:{
            _id:1,
            indexName: 1,
            sector: 1
        }
    });
});

Meteor.publish('galleryDeals', function() {
    return FeedDeals.find({}, {
        fields:{
            _id:1,
            companyName: 1,
            annDate: 1,
            sector: 1,
            subSector: 1,
            dealTerms: 1
        }
    });
});

Meteor.publish('galleryDealsIndices', function() {
    return FeedDealsIndices.find({}, {
        fields:{
            _id:1,
            indexName: 1,
            sector: 1
        }
    });
});