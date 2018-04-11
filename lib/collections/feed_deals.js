//Data on 400 deals that have either EV/Revenue or EV/EBITDA data available
FeedDeals = new Mongo.Collection('feedDeals');

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

DealTermsSchema = new SimpleSchema({
    acquirerName: {
        type: String,
        label: "Acquirer",
        optional: true
    },
    dealType: {
        type: String,
        label: "Deal Type",
        optional: true
    },
    annDate: {
        type: String,
        label: "Deal Date",
        optional: true
    },
    pricePerShareDeal: {
        type: Number,
        label: "Deal - Price per Share",
        min: 0,
        decimal: true,
        optional: true
    },
    equityValueDeal: {
        type: Number,
        label: "Deal - Equity Value",
        min: 0,
        decimal: true,
        optional: true
    },
    enterpriseValueDeal: {
        type: Number,
        label: "Deal - Enterprise Value",
        min: 0,
        decimal: true,
        optional: true
    },
    premiumPaidDeal: {
        type: Number,
        label: "Premium",
        min: 0,
        decimal: true,
        optional: true
    }
});

FeedDealsSchema = new SimpleSchema({
    companyName: {
        type: String,
        label: "Target"
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
    dealTerms: {
        type: DealTermsSchema,
        optional: true
    }
});

FeedDeals.attachSchema(FeedDealsSchema);
