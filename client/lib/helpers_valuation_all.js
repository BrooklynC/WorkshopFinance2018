
//Creates object with all multiples to use for Build, using previous helpers to decide between Average/Median/High/Low
getBuildMultipleAll = function(footballId, valuationId) {
    var valuation = Valuations.findOne({_id:valuationId});
    var valuationSelections = valuation.valuationSelections;
    var valuationMultiples = valuation.multiples;
    var marketType = Footballs.findOne({_id:footballId}).marketType;

    if(valuationSelections.length > 0) {
        if(valuationMultiples) {
            var val = getVal(footballId, valuationId);
            switch(marketType) {
                case "company":
                    return {
                        evRevLtm: val.evRevLtm,
                        evRevFy1: val.evRevFy1,
                        evRevFy2: val.evRevFy2,
                        evEbitdaLtm: val.evEbitdaLtm,
                        evEbitdaFy1: val.evEbitdaFy1,
                        evEbitdaFy2: val.evEbitdaFy2,
                        peLtm: val.peLtm,
                        peFy1: val.peFy1,
                        peFy2: val.peFy2,
                        enterpriseValue: val.enterpriseValue,
                        pricePerShare: val.pricePerShare,
                        customValue: val.customValue
                    };
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        }
    }
};

//Calculates all Build Values using selected Build Multiple from above, as well as data from private or public company
getBuildValueAll = function(footballId, valuationId) {
    var football = Footballs.findOne({_id:footballId});
    var footballType = football.footballType;

    var valuation = Valuations.findOne({_id:valuationId});
    var valuationSelections = valuation.valuationSelections;
    var valuationMultiples = valuation.multiples;
    var multiple = getBuildMultipleAll(footballId, valuationId);

    if(valuationSelections.length > 0) {
        if(valuationMultiples) {
            if (footballType == "target") {
                var target = {
                    targetId: football.footballTarget.targetId,
                    targetType: football.footballTarget.targetType,
                    targetData: football.footballTarget.targetData
                };
                switch(target.targetType) {
                    case "company":
                        switch(target.targetData) {
                            case "feed":
                                var feedCompany = FeedCompanies.findOne({_id: target.targetId});

                                var feedCompanyData = {
                                    revenueLtm: feedCompany.financial.ltm.revenue,
                                    revenueFy1: feedCompany.financial.fy1.revenue,
                                    revenueFy2: feedCompany.financial.fy2.revenue,
                                    ebitdaLtm: feedCompany.financial.ltm.ebitda,
                                    ebitdaFy1: feedCompany.financial.fy1.ebitda,
                                    ebitdaFy2: feedCompany.financial.fy2.ebitda,
                                    epsLtm: feedCompany.financial.ltm.eps,
                                    epsFy1: feedCompany.financial.fy1.eps,
                                    epsFy2: feedCompany.financial.fy2.eps,
                                    sharesOs: feedCompany.capTable.sharesOs,
                                    netDebt: feedCompany.capTable.netDebt
                                };
                                var valuationType = valuation.valuationType;
                                switch(valuationType) {
                                    case "comps":
                                        return {
                                            evEvRevLtm: feedCompanyData.revenueLtm * multiple.evRevLtm,
                                            evEvRevFy1: feedCompanyData.revenueFy1 * multiple.evRevFy1,
                                            evEvRevFy2: feedCompanyData.revenueFy2 * multiple.evRevFy2,
                                            evEvEbitdaLtm: feedCompanyData.ebitdaLtm * multiple.evEbitdaLtm,
                                            evEvEbitdaFy1: feedCompanyData.ebitdaFy1 * multiple.evEbitdaFy1,
                                            evEvEbitdaFy2: feedCompanyData.ebitdaFy2 * multiple.evEbitdaFy2,
                                            pricePeLtm: feedCompanyData.epsLtm * multiple.peLtm,
                                            pricePeFy1: feedCompanyData.epsFy1 * multiple.peFy1,
                                            pricePeFy2: feedCompanyData.epsFy2 * multiple.peFy2
                                        };
                                        break;
                                    case "deals":
                                        return {
                                            evEvRevLtm: feedCompanyData.revenueLtm * multiple.evRevLtm,
                                            evEvRevFy1: feedCompanyData.revenueFy1 * multiple.evRevFy1,
                                            evEvRevFy2: feedCompanyData.revenueFy2 * multiple.evRevFy2,
                                            evEvEbitdaLtm: feedCompanyData.ebitdaLtm * multiple.evEbitdaLtm,
                                            evEvEbitdaFy1: feedCompanyData.ebitdaFy1 * multiple.evEbitdaFy1,
                                            evEvEbitdaFy2: feedCompanyData.ebitdaFy2 * multiple.evEbitdaFy2,
                                            pricePeLtm: feedCompanyData.epsLtm * multiple.peLtm,
                                            pricePeFy1: feedCompanyData.epsFy1 * multiple.peFy1,
                                            pricePeFy2: feedCompanyData.epsFy2 * multiple.peFy2
                                        };
                                        break;
                                    case "models":
                                        return {
                                            enterpriseValue: multiple.enterpriseValue,
                                            pricePerShare: multiple.pricePerShare
                                        };
                                        break;
                                    case "custom":
                                        return {
                                            customValue: multiple.customValue
                                        };
                                        break;
                                }
                                break;
                            case "custom":
                                var customCompany = TargetsCompanies.findOne({_id: target.targetId});
                                var customCompanyData = {
                                    revenueLtm: customCompany.financial.ltm.revenue,
                                    revenueFy1: customCompany.financial.fy1.revenue,
                                    revenueFy2: customCompany.financial.fy2.revenue,
                                    ebitdaLtm: customCompany.financial.ltm.ebitda,
                                    ebitdaFy1: customCompany.financial.fy1.ebitda,
                                    ebitdaFy2: customCompany.financial.fy2.ebitda,
                                    epsLtm: customCompany.financial.ltm.eps,
                                    epsFy1: customCompany.financial.fy1.eps,
                                    epsFy2: customCompany.financial.fy2.eps,
                                    sharesOs: customCompany.capTable.sharesOs,
                                    netDebt: customCompany.capTable.netDebt
                                };
                                return {
                                    evEvRevLtm: customCompanyData.revenueLtm * multiple.evRevLtm,
                                    evEvRevFy1: customCompanyData.revenueFy1 * multiple.evRevFy1,
                                    evEvRevFy2: customCompanyData.revenueFy2 * multiple.evRevFy2,
                                    evEvEbitdaLtm: customCompanyData.ebitdaLtm * multiple.evEbitdaLtm,
                                    evEvEbitdaFy1: customCompanyData.ebitdaFy1 * multiple.evEbitdaFy1,
                                    evEvEbitdaFy2: customCompanyData.ebitdaFy2 * multiple.evEbitdaFy2,
                                    pricePeLtm: customCompanyData.epsLtm * multiple.peLtm,
                                    pricePeFy1: customCompanyData.epsFy1 * multiple.peFy1,
                                    pricePeFy2: customCompanyData.epsFy2 * multiple.peFy2
                                };
                                break;
                        }
                        break;
                    case "marketTypeB":
                        //
                        break;
                }
            }
        }
    }
};

//Calculates all potential Valuation Results, including when Build Value is transformed by selecting a different valuationOutput
getResultAll = function(footballId, valuationId){
    var football = Footballs.findOne({_id:footballId});
    var footballType = football.footballType;
    var marketType = football.marketType;

    var valuation = Valuations.findOne({_id: valuationId});
    var valuationType = valuation.valuationType;
    var valuationSelections = valuation.valuationSelections;
    var valuationMultiples = valuation.multiples;

    if(valuationSelections.length > 0) {
        if (valuationMultiples) {
            var multiple = getBuildMultipleAll(footballId, valuationId);
            if (multiple) {
                if (footballType == "market") {
                    switch(marketType) {
                        case "company":
                            switch (valuationType) {
                                case "comps":
                                    return {
                                        evRevLtm: multiple.evRevLtm,
                                        evRevFy1: multiple.evRevFy1,
                                        evRevFy2: multiple.evRevFy2,
                                        evEbitdaLtm: multiple.evEbitdaLtm,
                                        evEbitdaFy1: multiple.evEbitdaFy1,
                                        evEbitdaFy2: multiple.evEbitdaFy2,
                                        peLtm: multiple.peLtm,
                                        peFy1: multiple.peFy1,
                                        peFy2: multiple.peFy2
                                    };

                                    break;
                                case "deals":
                                    return {
                                        evRevLtm: multiple.evRevLtm,
                                        evEbitdaLtm: multiple.evEbitdaLtm
                                    };
                                    break;
                                case "models":
                                    return {
                                        evRevLtm: multiple.evRevLtm,
                                        evRevFy1: multiple.evRevFy1,
                                        evRevFy2: multiple.evRevFy2,
                                        evEbitdaLtm: multiple.evEbitdaLtm,
                                        evEbitdaFy1: multiple.evEbitdaFy1,
                                        evEbitdaFy2: multiple.evEbitdaFy2,
                                        peLtm: multiple.peLtm,
                                        peFy1: multiple.peFy1,
                                        peFy2: multiple.peFy2
                                    };
                                    break;
                                case "custom":
                                    return {
                                        customValue: multiple.customValue,
                                        evRevLtm: multiple.customValue,
                                        evRevFy1: multiple.customValue,
                                        evRevFy2: multiple.customValue,
                                        evEbitdaLtm: multiple.customValue,
                                        evEbitdaFy1: multiple.customValue,
                                        evEbitdaFy2: multiple.customValue,
                                        peLtm: multiple.customValue,
                                        peFy1: multiple.customValue,
                                        peFy2: multiple.customValue
                                    };
                                    break;
                            }
                            break;
                        case "marketTypeB":
                            //
                            break;
                    }
                } else {
                    var targetId = football.footballTarget.targetId;
                    var targetType = football.footballTarget.targetType;
                    var targetData = football.footballTarget.targetData;
                    var buildValue = getBuildValueAll(footballId, valuationId);
                    switch (targetType) {
                        case "company":
                            switch (targetData) {
                                case "feed":
                                    var feedCompany = FeedCompanies.findOne({_id: targetId});
                                    var feedCompanyData = {
                                        revenueLtm: feedCompany.financial.ltm.revenue,
                                        revenueFy1: feedCompany.financial.fy1.revenue,
                                        revenueFy2: feedCompany.financial.fy2.revenue,
                                        ebitdaLtm: feedCompany.financial.ltm.ebitda,
                                        ebitdaFy1: feedCompany.financial.fy1.ebitda,
                                        ebitdaFy2: feedCompany.financial.fy2.ebitda,
                                        epsLtm: feedCompany.financial.ltm.eps,
                                        epsFy1: feedCompany.financial.fy1.eps,
                                        epsFy2: feedCompany.financial.fy2.eps,
                                        sharesOs: feedCompany.capTable.sharesOs,
                                        netDebt: feedCompany.capTable.netDebt
                                    };
                                    switch (valuationType) {
                                        case "comps":
                                            return {
                                                evRev: {
                                                    ltm: {
                                                        ev: buildValue.evEvRevLtm,
                                                        price: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevLtm / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevLtm / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevLtm / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevLtm / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevLtm / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevLtm / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: buildValue.evEvRevFy1,
                                                        price: (buildValue.evEvRevFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevFy1 / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevFy1 / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevFy1 / feedCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevFy1 / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevFy1 / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevFy1 / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2

                                                            }
                                                        }

                                                    },
                                                    fy2: {
                                                        ev: buildValue.evEvRevFy2,
                                                        price: (buildValue.evEvRevFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevFy2 / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevFy2 / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevFy2 / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevFy2 / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevFy2 / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevFy2 / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2

                                                            }
                                                        }
                                                    }
                                                },
                                                evEbitda: {
                                                    ltm: {
                                                        ev: buildValue.evEvEbitdaLtm,
                                                        price: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaLtm / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2
                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: buildValue.evEvEbitdaFy1,
                                                        price: (buildValue.evEvEbitdaFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaFy1 / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaFy1 / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaFy1 / feedCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaFy1 / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaFy1 / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaFy1 / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaFy1 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy2: {
                                                        ev: buildValue.evEvEbitdaFy2,
                                                        price: (buildValue.evEvEbitdaFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaFy2 / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaFy2 / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaFy2 / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaFy2 / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaFy2 / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaFy2 / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaFy2 - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                },
                                                pe: {
                                                    ltm: {
                                                        ev: (buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt,
                                                        price: buildValue.pricePeLtm,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeLtm * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeLtm / feedCompanyData.epsLtm,
                                                                fy1: buildValue.pricePeLtm / feedCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeLtm / feedCompanyData.epsFy2
                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: (buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt,
                                                        price: buildValue.pricePeFy1,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeFy1 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeFy1 / feedCompanyData.epsLtm,
                                                                fy1: buildValue.pricePeFy1 / feedCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeFy1 / feedCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy2: {
                                                        ev: (buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt,
                                                        price: buildValue.pricePeFy2,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeFy2 * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeFy2 / feedCompanyData.epsLtm,
                                                                fy1: buildValue.pricePeFy2 / feedCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeFy2 / feedCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            break;
                                        case "deals":
                                            return {
                                                evRev: {
                                                    ltm: {
                                                        ev: buildValue.evEvRevLtm,
                                                        price: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevLtm / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevLtm / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevLtm / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevLtm / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevLtm / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevLtm / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2

                                                            }
                                                        }
                                                    }
                                                },
                                                evEbitda: {
                                                    ltm: {
                                                        ev: buildValue.evEvEbitdaLtm,
                                                        price: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaLtm / feedCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / feedCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / feedCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / feedCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaLtm - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            break;
                                        case "models":
                                            return {
                                                enterpriseValue: buildValue.enterpriseValue,
                                                pricePerShare: buildValue.pricePerShare,
                                                evRevenueLtm: getBuildMultipleAll(footballId, valuationId).evRevLtm,
                                                evRevenueFy1: getBuildMultipleAll(footballId, valuationId).evRevFy1,
                                                evRevenueFy2: getBuildMultipleAll(footballId, valuationId).evRevFy2,
                                                evEbitdaLtm: getBuildMultipleAll(footballId, valuationId).evEbitdaLtm,
                                                evEbitdaFy1: getBuildMultipleAll(footballId, valuationId).evEbitdaFy1,
                                                evEbitdaFy2: getBuildMultipleAll(footballId, valuationId).evEbitdaFy2,
                                                priceEarningsLtm: getBuildMultipleAll(footballId, valuationId).peLtm,
                                                priceEarningsFy1: getBuildMultipleAll(footballId, valuationId).peFy1,
                                                priceEarningsFy2: getBuildMultipleAll(footballId, valuationId).peFy2
                                            };
                                            break;
                                        case "custom":
                                            return {
                                                customValue: buildValue.customValue
                                            }

                                    }
                                    break;
                                case "custom":
                                    var customCompany = TargetsCompanies.findOne({_id: targetId});
                                    var customCompanyData = {
                                        revenueLtm: customCompany.financial.ltm.revenue,
                                        revenueFy1: customCompany.financial.fy1.revenue,
                                        revenueFy2: customCompany.financial.fy2.revenue,
                                        ebitdaLtm: customCompany.financial.ltm.ebitda,
                                        ebitdaFy1: customCompany.financial.fy1.ebitda,
                                        ebitdaFy2: customCompany.financial.fy2.ebitda,
                                        epsLtm: customCompany.financial.ltm.eps,
                                        epsFy1: customCompany.financial.fy1.eps,
                                        epsFy2: customCompany.financial.fy2.eps,
                                        sharesOs: customCompany.capTable.sharesOs,
                                        netDebt: customCompany.capTable.netDebt
                                    };
                                    switch (valuationType) {
                                        case "comps":
                                            return {
                                                evRev: {
                                                    ltm: {
                                                        ev: buildValue.evEvRevLtm,
                                                        price: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevLtm / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevLtm / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevLtm / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevLtm / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevLtm / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevLtm / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: buildValue.evEvRevFy1,
                                                        price: (buildValue.evEvRevFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevFy1 / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevFy1 / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevFy1 / customCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevFy1 / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevFy1 / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevFy1 / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2

                                                            }
                                                        }

                                                    },
                                                    fy2: {
                                                        ev: buildValue.evEvRevFy2,
                                                        price: (buildValue.evEvRevFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevFy2 / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevFy2 / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevFy2 / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevFy2 / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevFy2 / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevFy2 / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2

                                                            }
                                                        }
                                                    }
                                                },
                                                evEbitda: {
                                                    ltm: {
                                                        ev: buildValue.evEvEbitdaLtm,
                                                        price: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaLtm / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2
                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: buildValue.evEvEbitdaFy1,
                                                        price: (buildValue.evEvEbitdaFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaFy1 / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaFy1 / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaFy1 / customCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaFy1 / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaFy1 / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaFy1 / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaFy1 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy2: {
                                                        ev: buildValue.evEvEbitdaFy2,
                                                        price: (buildValue.evEvEbitdaFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaFy2 / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaFy2 / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaFy2 / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaFy2 / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaFy2 / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaFy2 / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaFy2 - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                },
                                                pe: {
                                                    ltm: {
                                                        ev: (buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt,
                                                        price: buildValue.pricePeLtm,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeLtm * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeLtm / customCompanyData.epsLtm,
                                                                fy1: buildValue.pricePeLtm / customCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeLtm / customCompanyData.epsFy2
                                                            }
                                                        }
                                                    },
                                                    fy1: {
                                                        ev: (buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt,
                                                        price: buildValue.pricePeFy1,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeFy1 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeFy1 / customCompanyData.epsLtm,
                                                                fy1: buildValue.pricePeFy1 / customCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeFy1 / customCompanyData.epsFy2

                                                            }
                                                        }
                                                    },
                                                    fy2: {
                                                        ev: (buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt,
                                                        price: buildValue.pricePeFy2,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueLtm,
                                                                fy1: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy1,
                                                                fy2: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.revenueFy2

                                                            },
                                                            evEbitda: {
                                                                ltm: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaLtm,
                                                                fy1: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy1,
                                                                fy2: ((buildValue.pricePeFy2 * customCompanyData.sharesOs) + customCompanyData.netDebt) / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: buildValue.pricePeFy2 / customCompanyData.epsLtm,
                                                                FY1: buildValue.pricePeFy2 / customCompanyData.epsFy1,
                                                                fy2: buildValue.pricePeFy2 / customCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            break;
                                        case "deals":
                                            return {
                                                evRev: {
                                                    ltm: {
                                                        ev: buildValue.evEvRevLtm,
                                                        price: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvRevLtm / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvRevLtm / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvRevLtm / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvRevLtm / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvRevLtm / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvRevLtm / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvRevLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2

                                                            }
                                                        }
                                                    }
                                                },
                                                evEbitda: {
                                                    ltm: {
                                                        ev: buildValue.evEvEbitdaLtm,
                                                        price: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs,
                                                        multiple: {
                                                            evRev: {
                                                                ltm: buildValue.evEvEbitdaLtm / customCompanyData.revenueLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / customCompanyData.revenueFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / customCompanyData.revenueFy2
                                                            },
                                                            evEbitda: {
                                                                ltm: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaLtm,
                                                                fy1: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaFy1,
                                                                fy2: buildValue.evEvEbitdaLtm / customCompanyData.ebitdaFy2

                                                            },
                                                            pe: {
                                                                ltm: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsLtm,
                                                                fy1: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy1,
                                                                fy2: (buildValue.evEvEbitdaLtm - customCompanyData.netDebt) / customCompanyData.sharesOs / customCompanyData.epsFy2
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                            break;
                                    }
                                    break;
                            }
                            break;
                        case "marketTypeB":
                            //
                            break;
                    }
                }
            }
        }
    }
};