Customs = new Mongo.Collection('customs');


ValuesSchema = new SimpleSchema({
    customStat: {
        type: String,
        label: "Custom Stat",
        optional: true
    },
    customValue: {
        type: Number,
        label: "Custom Value",
        decimal: true,
        optional: true
    },
    customPrice: {
        type: Number,
        label: "Custom Price",
        decimal: true,
        optional: true
    },
    customMultiple: {
        type: Number,
        label: "Custom Multiple",
        decimal: true,
        optional: true
    }
});


CustomsSchema = new SimpleSchema({
    ownerId: {
        type: String,
        label: "Owner ID",
        optional: true
    },
    targetId: {
        type: String,
        label: "Target ID",
        optional: true
    },
    customName: {
      type: String,
      label: "Custom Name",
      optional: true
    },
    notes: {
        type: String,
        label: "Custom Notes",
        optional: true
    },
    asOfDate: {
        type: Number,
        label: "Model - As of Date",
        optional: true
    },
    viewers: {
        type: [String],
        label: "Custom Viewers",
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

Customs.attachSchema(CustomsSchema);