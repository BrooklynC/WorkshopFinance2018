Options = new Mongo.Collection('options');

OptionsSchema = new SimpleSchema({
    ownerId: {
        type: String,
        label: "Owner ID",
        optional: true
    },
    footballActive: {
        type: String,
        label: "Active Football",
        defaultValue: "No football",
        optional: true
    },
    targets: {
        type: [Object],
        label: "Targets",
        defaultValue: [],
        optional: true
    },
    "targets.$.targetId": {
        type: String,
        label: "Target ID",
        defaultValue: "No target",
        optional: true
    },
    "targets.$.targetType": {
        type: String,
        label: "Target Type",
        allowedValues: ["company","marketTypeB"],
        defaultValue: "company",
        optional: true
    },
    "targets.$.targetData": {
        type: String,
        label: "Target Source",
        allowedValues: ["feed","custom"],
        defaultValue: "feed",
        optional: true
    },
    modelTypes: {
        type: [String],
        label: "Model Types",
        defaultValue: [],
        optional: true
    },
    theme: {
        type: String,
        label: "Theme",
        allowedValues: ["light", "dark"],
        defaultValue: "dark",
        optional: true
    }
});

Options.attachSchema(OptionsSchema);

