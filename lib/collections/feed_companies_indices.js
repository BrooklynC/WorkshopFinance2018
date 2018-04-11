FeedCompaniesIndices = new Mongo.Collection('feedCompaniesIndices');

FeedCompaniesIndicesSchema = new SimpleSchema({
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
    constituents: {
        type: Number,
        label: "Number of Constituents",
        optional: true
    },
    values: {
        type: [Object],
        label: "Values",
        optional: true
    },
    "values.$.date": {
        type: String,
        optional: true
    },
    "values.$.evRevenueLtm": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evRevenueFy1": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evRevenueFy2": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evEbitdaLtm": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evEbitdaFy1": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.evEbitdaFy2": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.priceEarningsLtm": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.priceEarningsFy1": {
        type: Number,
        decimal: true,
        optional: true
    },
    "values.$.priceEarningsFy2": {
        type: Number,
        decimal: true,
        optional: true
    }
});

FeedCompaniesIndices.attachSchema(FeedCompaniesIndicesSchema);