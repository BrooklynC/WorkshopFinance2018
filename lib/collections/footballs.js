Footballs = new Mongo.Collection('footballs');

TargetSchema = new SimpleSchema({
  targetId: {
    type: String,
    label: "Target ID",
    defaultValue: "none",
    optional: true
  },
  targetType: {
    type: String,
    label: "Target Type",
    allowedValues: ["none","company","marketTypeB"],
    defaultValue: "none",
    optional: true
  },
  targetData: {
    type: String,
    label: "Target Source",
    allowedValues: ["none","feed","custom"],
    defaultValue: "none",
    optional: true
  }
});

FootballsSchema = new SimpleSchema({
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
  timeCreated: {
    type: Date,
    label: "Date Added",
    optional: true
  },
  footballName: {
    type: String,
    label: "Football Field Name",
    defaultValue: "New Football Field",
    optional: true
  },
  footballType: {
    type: String,
    label: "Football Field Type",
    allowedValues: ["target","market"],
    defaultValue: "market",
    optional: true
  },
  marketType: {
    type: String,
    label: "Football Field Market Type",
    allowedValues: ["company","marketTypeB"],
    defaultValue: "company",
    optional: true
  },
  footballOutput: {
    type: String,
    label: "Football Output",
    allowedValues: ["Enterprise Value","Price per Share","Multiple"],
    defaultValue: "Multiple",
    optional: true
  },
  footballSpread: {
    type: Number,
    label: "Valuation Summary Spread",
    defaultValue: 10,
    decimal: true,
    min: 0,
    max: 50,
    optional: true
  },
  rangeEvLow: {
    type: Number,
    label: "Football Range Low - EV",
    defaultValue: 0,
    decimal: true,
    min: 0,
    optional: true
  },
  rangeEvHigh: {
    type: Number,
    label: "Football Range High - EV",
    defaultValue: 100000,
    decimal: true,
    optional: true
  },
  rangePriceLow: {
    type: Number,
    label: "Football Range Low - Price",
    defaultValue: 0,
    decimal: true,
    min: 0,
    optional: true
  },
  rangePriceHigh: {
    type: Number,
    label: "Football Range - Price",
    defaultValue: 200,
    decimal: true,
    optional: true
  },
  rangeMultipleLow: {
    type: Number,
    label: "Football Range Low - Multiple",
    defaultValue: 0,
    decimal: true,
    min: 0,
    optional: true
  },
  rangeMultipleHigh: {
    type: Number,
    label: "Football Range High - Multiple",
    defaultValue: 10,
    decimal: true,
    optional: true
  },
  footballCushion: {
    type: Number,
    label: "Cushion",
    defaultValue: 1,
    decimal: true,
    optional: true
  },
  footballScale: {
    type: String,
    label: "Football Scale",
    allowedValues: ["millions","billions"],
    defaultValue: "millions",
    optional: true
  },
  includeCurrent: {
    type: Boolean,
    label: "Current Value",
    defaultValue: false,
    optional: true
  },
  includeCurrentDate: {
    type: String,
    label: "Current Date",
    defaultValue: "2015-12-31",
    optional: true
  },
  includeCurrentMetric: {
    type: String,
    label: "Include Current Metric",
    allowedValues: ["EV/Revenue", "EV/EBITDA", "P/E"],
    defaultValue: "EV/EBITDA",
    optional: true
  },
  includeCurrentPeriod: {
    type: String,
    label: "Include Current Metric",
    allowedValues: ["LTM", "FY1", "FY2"],
    defaultValue: "LTM",
    optional: true
  },
  includeTrading: {
    type: Boolean,
    label: "Include 52 week high/low",
    defaultValue: false,
    optional: true
  },
  includeTradingMetric: {
    type: String,
    label: "52 week high/low multiple",
    allowedValues: ["EV/Revenue", "EV/EBITDA", "P/E"],
    defaultValue: "EV/EBITDA",
    optional: true
  },
  includeTradingPeriod: {
    type: String,
    label: "52 week high/low multiple period",
    allowedValues: ["LTM", "FY1", "FY2"],
    defaultValue: "LTM",
    optional: true
  },
  viewers: {
    type: [String],
    label: "Football Viewers",
    defaultValue: [],
    optional: true
  },
  sentBy: {
    type: String,
    label: "Sent by",
    optional: true
  },
  sharedBy: {
    type: String,
    label: "Shared by",
    optional: true
  },
  footballValuations: {
    type: [String],
    label: "Valuations",
    defaultValue: [],
    optional: true
  },
  footballValuationsAll: {
    type: [String],
    label: "Valuations All",
    defaultValue: [],
    optional: true
  },
  footballSort:{
    type: String,
    label: "Valuations Sort",
    allowedValues: ["Date (oldest first)","Date (newest first)","Value (ascending)","Value (descending)","Manual"],
    defaultValue: "Date (oldest first)",
    optional: true
  },
  footballLive: {
    type: Boolean,
    label: "Football Live",
    defaultValue: false,
    optional: true
  },
  footballTarget: {
    type: TargetSchema,
    optional: true
  }
});

Footballs.attachSchema(FootballsSchema);
