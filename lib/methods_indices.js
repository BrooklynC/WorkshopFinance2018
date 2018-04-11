Meteor.methods({
    //Admin tool to calculate company indices.  Should be replaced by values from market data feed
    addIndicesComps: function () {
        if (Meteor.isServer) {
            var companiesIndices = [
                {
                    indexName: "S&P 500 Healthcare",
                    sector: "Healthcare"
                },
                {
                    indexName: "S&P 500 Materials",
                    sector: "Materials"
                },
                {
                    indexName: "S&P 500 Industrials",
                    sector: "Industrials"
                },
                {
                    indexName: "S&P 500 Information Technology",
                    sector: "Information Technology"
                },
                {
                    indexName: "S&P 500 Financials",
                    sector: "Financials"
                },
                {
                    indexName: "S&P 500 Consumer Staples",
                    sector: "Consumer Staples"
                },
                {
                    indexName: "S&P 500 Consumer Discretionary",
                    sector: "Consumer Discretionary"
                },
                {
                    indexName: "S&P 500 Utilities",
                    sector: "Utilities"
                },
                {
                    indexName: "S&P 500 Energy",
                    sector: "Energy"
                },
                {
                    indexName: "S&P 500 Telecommunication Services",
                    sector: "Telecommunication Services"
                }
            ];
            companiesIndices.forEach(function (c) {
                FeedCompaniesIndices.insert(c);
            });
            if (Meteor.isServer) {
                var sectors = [
                    "Healthcare",
                    "Materials",
                    "Industrials",
                    "Information Technology",
                    "Financials",
                    "Consumer Staples",
                    "Consumer Discretionary",
                    "Utilities",
                    "Energy",
                    "Telecommunication Services"
                ];
                sectors.forEach(function (s) {
                    var companies = FeedCompanies.find({sector:s}).fetch();
                    var companiesCount = companies.length;
                    var pipelineCompsIndex = [
                        {
                            $match: {
                                sector: s
                            }
                        },
                        //Unwind closingPrices to create document for each date
                        {
                            $unwind: "$closingPrices"
                        },
                        //Group all matching documents and culate averages for each valuation metric across all selections.//
                        {
                            $project: {
                                date: "$closingPrices.date",
                                evRevenueLtm: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.ltm.revenue"]},
                                evRevenueFy1: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.fy1.revenue"]},
                                evRevenueFy2: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.fy2.revenue"]},
                                evEbitdaLtm: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.ltm.ebitda"]},
                                evEbitdaFy1: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.fy1.ebitda"]},
                                evEbitdaFy2: {$divide: [{$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}, "$financial.fy2.ebitda"]},
                                priceEarningsLtm: {$divide: ["$closingPrices.price", "$financial.ltm.eps"]},
                                priceEarningsFy1: {$divide: ["$closingPrices.price", "$financial.fy1.eps"]},
                                priceEarningsFy2: {$divide: ["$closingPrices.price", "$financial.fy2.eps"]}
                            }
                        },
                        {
                            $group: {
                                _id: "$date",
                                evRevenueLtm: {$avg: "$evRevenueLtm"},
                                evRevenueFy1: {$avg: "$evRevenueFy1"},
                                evRevenueFy2: {$avg: "$evRevenueFy2"},
                                evEbitdaLtm: {$avg: "$evEbitdaLtm"},
                                evEbitdaFy1: {$avg: "$evEbitdaFy1"},
                                evEbitdaFy2: {$avg: "$evEbitdaFy2"},
                                priceEarningsLtm: {$avg: "$priceEarningsLtm"},
                                priceEarningsFy1: {$avg: "$priceEarningsFy1"},
                                priceEarningsFy2: {$avg: "$priceEarningsFy2"}
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                values: {
                                    date: "$_id",
                                    evRevenueLtm: "$evRevenueLtm",
                                    evRevenueFy1: "$evRevenueFy1",
                                    evRevenueFy2: "$evRevenueFy2",
                                    evEbitdaLtm: "$evEbitdaLtm",
                                    evEbitdaFy1: "$evEbitdaFy1",
                                    evEbitdaFy2: "$evEbitdaFy2",
                                    priceEarningsLtm: "$priceEarningsLtm",
                                    priceEarningsFy1: "$priceEarningsFy1",
                                    priceEarningsFy2: "$priceEarningsFy2"
                                }
                            }
                        }
                    ];
                    var resultsCompsIndex = FeedCompanies.aggregate(pipelineCompsIndex);
                    resultsCompsIndex.forEach(function (i) {
                        FeedCompaniesIndices.update({sector: s}, {
                            $set: {
                                constituents: companiesCount
                            },
                            $push: {
                                values: i.values
                            }
                        });
                    });
                });
            }
        }
    },
    //Admin tool to calculate deal indices.  Sould be replaced by values from market data feed
    addIndicesDeals: function () {
        if (Meteor.isServer) {
            var dealsIndices = [
                {
                    indexName: "Deals - Healthcare",
                    sector: "Healthcare"
                },
                {
                    indexName: "Deals - Materials",
                    sector: "Materials"
                },
                {
                    indexName: "Deals - Industrials",
                    sector: "Industrials"
                },
                {
                    indexName: "Deals - High Technology",
                    sector: "High Technology"
                },
                {
                    indexName: "Deals - Media and Entertainment",
                    sector: "Media and Entertainment"
                },
                {
                    indexName: "Deals - Financials",
                    sector: "Financials"
                },
                {
                    indexName: "Deals - Real Estate",
                    sector: "Real Estate"
                },
                {
                    indexName: "Deals - Consumer Staples",
                    sector: "Consumer Staples"
                },
                {
                    indexName: "Deals - Consumer Products and Services",
                    sector: "Consumer Products and Services"
                },
                {
                    indexName: "Deals - Retail",
                    sector: "Retail"
                },
                {
                    indexName: "Deals - Energy and Power",
                    sector: "Energy and Power"
                },
                {
                    indexName: "Deals - Telecommunication",
                    sector: "Telecommunication"
                }
            ];
            dealsIndices.forEach(function(d) {
                FeedDealsIndices.insert(d);
            });
            var sectors = [
                "Healthcare",
                "Materials",
                "Industrials",
                "High Technology",
                "Media and Entertainment",
                "Financials",
                "Real Estate",
                "Consumer Staples",
                "Consumer Products and Services",
                "Retail",
                "Energy and Power",
                "Telecommunication"
            ];
            sectors.forEach(function (s) {
                var deals = FeedDeals.find({sector:s}).fetch();
                var dealsCount = deals.length;
                var pipelineDealsIndex = [
                    {
                        $match: {
                            sector: s
                        }
                    },
                    //Group all matching documents and calculate averages for each valuation metric across all selections.//
                    {
                        $project: {
                            evRevenueLtm: {$divide: ["$dealTerms.enterpriseValueDeal", "$financial.ltm.revenue"]},
                            evEbitdaLtm: {$divide: ["$dealTerms.enterpriseValueDeal", "$financial.ltm.ebitda"]}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            evRevenueLtm: {$avg: "$evRevenueLtm"},
                            evEbitdaLtm: {$avg: "$evEbitdaLtm"}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            values: {
                                evRevenueLtm: "$evRevenueLtm",
                                evEbitdaLtm: "$evEbitdaLtm"
                            }
                        }
                    }
                ];
                var resultsDealsIndex = FeedDeals.aggregate(pipelineDealsIndex);
                resultsDealsIndex.forEach(function (i) {
                    FeedDealsIndices.update({sector: s}, {
                        $set: {
                            constituents: dealsCount
                        },
                        $push: {
                            values: i.values
                        }
                    });
                });
            });
        }
    }
});