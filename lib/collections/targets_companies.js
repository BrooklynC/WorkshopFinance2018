TargetsCompanies = new Mongo.Collection('targetsCompanies');

CapTableSchema = new SimpleSchema({
    netDebt: {
        type: Number,
        label: "Net Debt",
        min: 0,
        decimal: true,
        optional: true
    },
    lastClose: {
        type: Number,
        label: "Previous Day's Close",
        min: 0,
        decimal: true,
        optional: true
    },
    yearHigh: {
        type: Number,
        label: "52-week High",
        min: 0,
        decimal: true,
        optional: true
    },
    yearLow: {
        type: Number,
        label: "52-week Low",
        min: 0,
        decimal: true,
        optional: true
    },
    sharesOs: {
        type: Number,
        label: "Current Shares Outstanding",
        min: 0,
        decimal: true,
        optional: true
    },
    marketCap: {
        type: Number,
        label: "Market Cap",
        min: 0,
        decimal: true,
        optional: true
    },
    enterpriseValue: {
        type: Number,
        label: "Enterprise Value",
        min: 0,
        decimal: true,
        optional: true
    }
});

ValueSchema = new SimpleSchema({
    revenue: {
        type: Number,
        label: "Revenue",
        min: 0,
        decimal: true,
        optional: true
    },
    ebitda: {
        type: Number,
        label: "EBITDA",
        decimal: true,
        optional: true
    },
    netIncome: {
        type: Number,
        label: "Net Income",
        decimal: true,
        optional: true
    },
    eps: {
        type: Number,
        label: "EPS",
        decimal: true,
        optional: true
    }
});

PeriodSchema = new SimpleSchema({
    ltm: {
        type: ValueSchema,
        optional: true
    },
    fy1: {
        type: ValueSchema,
        optional: true
    },
    fy2: {
        type: ValueSchema,
        optional: true
    }
});

TargetsCompaniesSchema = new SimpleSchema({
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
    companyName: {
        type: String,
        label: "Company Name",
        optional: true
    },
    ticker: {
        type: String,
        label: "Ticker",
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
    status: {
        type: String,
        label: "Public or Private",
        optional: true
    },
    feedId: {
        type: String,
        label: "Feed ID",
        optional: true
    },
    viewers: {
        type: [String],
        label: "Target Company Viewers",
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
    capTable: {
        type: CapTableSchema,
        optional: true
    },
    financial: {
        type: PeriodSchema,
        optional: true
    }
});

TargetsCompanies.attachSchema(TargetsCompaniesSchema);

