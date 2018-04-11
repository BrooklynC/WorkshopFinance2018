Models = new Mongo.Collection('models');


ValuesSchema = new SimpleSchema({
    stat: {
        type: String,
        label: "Model - Stat",
        optional: true
    },
    enterpriseValue: {
        type: Number,
        label: "Enterprise Value",
        decimal: true,
        optional: true
    },
    pricePerShare: {
        type: Number,
        label: "Price per Share",
        decimal: true,
        optional: true
    },
    evRevenueLtm: {
        type: Number,
        decimal: true,
        optional: true
    },
    evRevenueFy1: {
        type: Number,
        decimal: true,
        optional: true
    },
    evRevenueFy2: {
        type: Number,
        decimal: true,
        optional: true
    },
    evEbitdaLtm: {
        type: Number,
        decimal: true,
        optional: true
    },
    evEbitdaFy1: {
        type: Number,
        decimal: true,
        optional: true
    },
    evEbitdaFy2: {
        type: Number,
        decimal: true,
        optional: true
    },
    priceEarningsLtm: {
        type: Number,
        decimal: true,
        optional: true
    },
    priceEarningsFy1: {
        type: Number,
        decimal: true,
        optional: true
    },
    priceEarningsFy2: {
        type: Number,
        decimal: true,
        optional: true
    }
});


ModelsSchema = new SimpleSchema({
    ownerId: {
        type: String,
        label: "Owner ID",
        optional: true
    },
    ownerCategory: {
        type: String,
        label: "Owner Category",
        allowedValues:  ["user","workshop"],
        defaultValue: "user",
        optional: true
    },
    targetId: {
        type: String,
        label: "Target ID",
        optional: true
    },
    targetName: {
        type: String,
        label: "Target Name",
        optional: true
    },
    modelName: {
      type: String,
      label: "Model Name",
      optional: true
    },
    notes: {
        type: String,
        label: "Model - Notes",
        optional: true
    },
    asOfDate: {
        type: Number,
        label: "Model - As of Date",
        optional: true
    },
    viewers: {
        type: [String],
        label: "Model Viewers",
        defaultValue: [],
        optional: true
    },
    submitted: {
        type: Date,
        label: "Date Added",
        optional: true
    },
    sharedBy: {
        type: String,
        label: "Shared by",
        optional: true
    },
    values: {
        type: ValuesSchema,
        optional: true
    }
});

Models.attachSchema(ModelsSchema);