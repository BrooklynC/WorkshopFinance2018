//Data on S&P500
FeedCompanies = new Mongo.Collection('feedCompanies');

CapTableSchema = new SimpleSchema({
    sharesOs: {
        type: Number,
        label: "Current Shares Outstanding",
        min: 0,
        decimal: true,
        optional: true
    },
    netDebt: {
        type: Number,
        label: "Net Debt",
        min: 0,
        decimal: true,
        optional: true
    },
    equityValue: {
        type: Number,
        label: "Equity Value",
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

FeedCompaniesSchema = new SimpleSchema({
    userId: {
        type: String,
        label: "User ID",
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
        label: "Status",
        optional: true
    },
    capTable: {
        type: CapTableSchema,
        optional: true
    },
    financial: {
        type: PeriodSchema,
        optional: true
    },
    closingPrices: {
        type: [Object],
        label: "Closing Prices",
        optional: true
    },
    "closingPrices.$.date": {
        type: String,
        optional: true
    },
    "closingPrices.$.price": {
        type: Number,
        decimal: true,
        optional: true
    }
});

FeedCompanies.attachSchema(FeedCompaniesSchema);

