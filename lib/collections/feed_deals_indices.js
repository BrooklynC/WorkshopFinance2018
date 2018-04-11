FeedDealsIndices = new Mongo.Collection('feedDealsIndices');

FeedDealsIndicesSchema = new SimpleSchema({
    ownerCategory: {
        type: String,
        label: "Owner Category",
        allowedValues:  ["user","workshop"],
        defaultValue: "workshop",
        optional: true
    },
    indexName: {
        type: String,
        label: "Index Name",
        optional: true
    },
    sector: {
        type: String,
        label: "Sector",
        optional: true
    },
    subSector: {
        type: String,
        label: "Sub-Sector",
        optional: true
    },
    values: {
        type: [Object],
        label: "Values",
        optional: true
    },
    "values.$.evRevenueLtm": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evEbitdaLtm": {
        type: Number,
        decimal: true,
        optional: true
    }
});

FeedDealsIndices.attachSchema(FeedDealsIndicesSchema);

