////VALUATION - BUILD

//Calculate average of a passed array
getAverageVal = function(multiples) {
    var multiplesCut = [];
    multiples.forEach(function (a) {
        //Ignore any N/A values
        if(a > 0 || a < 0) {
            multiplesCut.push(a);
        }
    });
    var total = 0;
    var l = multiplesCut.length;
    for(var i=0; i < l; i++) {
        total += multiplesCut[i];
    }
    return total / l;
};

//Calculate median of a passed array
getMedianVal = function(multiples) {
    var multiplesCut = [];
    multiples.forEach(function (a) {
        //Ignore any N/A values
        if(a > 0 || a < 0) {
            multiplesCut.push(a);
        }
    });
    multiplesCut.sort(function(a,b) {
        return a - b;
    });
    var l = multiplesCut.length;
    var half = Math.floor(l/2);
    if(l % 2) {
        return multiplesCut[half];
    } else {
        return (multiplesCut[half - 1] + multiplesCut[half]) / 2;
    }
};

//Calculate high of a passed array
getHighVal = function(multiples) {
    var multiplesCut = [];
    multiples.forEach(function (a) {
        //Ignore any N/A values
        if(a > 0 || a < 0) {
            multiplesCut.push(a);
        }
    });
    return Math.max.apply(null, multiplesCut);
};

//Calculate low of a passed array
getLowVal = function(multiples) {
    var multiplesCut = [];
    multiples.forEach(function (a) {
        //Ignore any N/A values
        if(a > 0 || a < 0) {
            multiplesCut.push(a);
        }
    });
    return Math.min.apply(null, multiplesCut);
};

//Calculate all averages, medians, highs and lows of valuation.  Saves one object with all values
getValAll = function(footballId, valuationId) {
    var valuation = Valuations.findOne({_id:valuationId});
    var valuationType = valuation.valuationType;
    var valuationSelections = valuation.valuationSelections;
    var valuationMultiples = valuation.multiples;
    var marketType = Footballs.findOne({_id:footballId}).marketType;

    if(valuationSelections.length > 0) {
        if(valuationMultiples) {
            switch(marketType) {
                case "company":
                    switch(valuationType) {
                        case "comps":
                            var evRevLtm = valuation.multiples.evRevenueLtm;
                            var evRevFy1 = valuation.multiples.evRevenueFy1;
                            var evRevFy2 = valuation.multiples.evRevenueFy2;
                            var evEbitdaLtm = valuation.multiples.evEbitdaLtm;
                            var evEbitdaFy1 = valuation.multiples.evEbitdaFy1;
                            var evEbitdaFy2 = valuation.multiples.evEbitdaFy2;
                            var peLtm = valuation.multiples.priceEarningsLtm;
                            var peFy1 = valuation.multiples.priceEarningsFy1;
                            var peFy2 = valuation.multiples.priceEarningsFy2;

                            return {
                                average: {
                                    evRevLtm: getAverageVal(evRevLtm),
                                    evRevFy1: getAverageVal(evRevFy1),
                                    evRevFy2: getAverageVal(evRevFy2),
                                    evEbitdaLtm: getAverageVal(evEbitdaLtm),
                                    evEbitdaFy1: getAverageVal(evEbitdaFy1),
                                    evEbitdaFy2: getAverageVal(evEbitdaFy2),
                                    peLtm: getAverageVal(peLtm),
                                    peFy1: getAverageVal(peFy1),
                                    peFy2: getAverageVal(peFy2)
                                },
                                median: {
                                    evRevLtm: getMedianVal(evRevLtm),
                                    evRevFy1: getMedianVal(evRevFy1),
                                    evRevFy2: getMedianVal(evRevFy2),
                                    evEbitdaLtm: getMedianVal(evEbitdaLtm),
                                    evEbitdaFy1: getMedianVal(evEbitdaFy1),
                                    evEbitdaFy2: getMedianVal(evEbitdaFy2),
                                    peLtm: getMedianVal(peLtm),
                                    peFy1: getMedianVal(peFy1),
                                    peFy2: getMedianVal(peFy2)
                                },
                                high: {
                                    evRevLtm: getHighVal(evRevLtm),
                                    evRevFy1: getHighVal(evRevFy1),
                                    evRevFy2: getHighVal(evRevFy2),
                                    evEbitdaLtm: getHighVal(evEbitdaLtm),
                                    evEbitdaFy1: getHighVal(evEbitdaFy1),
                                    evEbitdaFy2: getHighVal(evEbitdaFy2),
                                    peLtm: getHighVal(peLtm),
                                    peFy1: getHighVal(peFy1),
                                    peFy2: getHighVal(peFy2)
                                },
                                low: {
                                    evRevLtm: getLowVal(evRevLtm),
                                    evRevFy1: getLowVal(evRevFy1),
                                    evRevFy2: getLowVal(evRevFy2),
                                    evEbitdaLtm: getLowVal(evEbitdaLtm),
                                    evEbitdaFy1: getLowVal(evEbitdaFy1),
                                    evEbitdaFy2: getLowVal(evEbitdaFy2),
                                    peLtm: getLowVal(peLtm),
                                    peFy1: getLowVal(peFy1),
                                    peFy2: getLowVal(peFy2)
                                }

                            };
                            break;
                        case "deals":
                            var evRevLtmDeals = valuation.multiples.evRevenueLtm;
                            var evEbitdaLtmDeals = valuation.multiples.evEbitdaLtm;

                            return {
                                average: {
                                    evRevLtm: getAverageVal(evRevLtmDeals),
                                    evEbitdaLtm: getAverageVal(evEbitdaLtmDeals)
                                },
                                median: {
                                    evRevLtm: getMedianVal(evRevLtmDeals),
                                    evEbitdaLtm: getMedianVal(evEbitdaLtmDeals)
                                },
                                high: {
                                    evRevLtm: getHighVal(evRevLtmDeals),
                                    evEbitdaLtm: getHighVal(evEbitdaLtmDeals)
                                },
                                low: {
                                    evRevLtm: getLowVal(evRevLtmDeals),
                                    evEbitdaLtm: getLowVal(evEbitdaLtmDeals)
                                }
                            };
                            break;
                        case "models":
                            var enterpriseValueModel = valuation.multiples.enterpriseValue;
                            var pricePerShareModel = valuation.multiples.pricePerShare;
                            var evRevLtmModel = valuation.multiples.evRevenueLtm;
                            var evRevFy1Model = valuation.multiples.evRevenueFy1;
                            var evRevFy2Model = valuation.multiples.evRevenueFy2;
                            var evEbitdaLtmModel = valuation.multiples.evEbitdaLtm;
                            var evEbitdaFy1Model = valuation.multiples.evEbitdaFy1;
                            var evEbitdaFy2Model = valuation.multiples.evEbitdaFy2;
                            var peLtmModel = valuation.multiples.priceEarningsLtm;
                            var peFy1Model = valuation.multiples.priceEarningsFy1;
                            var peFy2Model = valuation.multiples.priceEarningsFy2;

                            return {
                                average: {
                                    enterpriseValue: getAverageVal(enterpriseValueModel),
                                    pricePerShare: getAverageVal(pricePerShareModel),
                                    evRevLtm: getAverageVal(evRevLtmModel),
                                    evRevFy1: getAverageVal(evRevFy1Model),
                                    evRevFy2: getAverageVal(evRevFy2Model),
                                    evEbitdaLtm: getAverageVal(evEbitdaLtmModel),
                                    evEbitdaFy1: getAverageVal(evEbitdaFy1Model),
                                    evEbitdaFy2: getAverageVal(evEbitdaFy2Model),
                                    peLtm: getAverageVal(peLtmModel),
                                    peFy1: getAverageVal(peFy1Model),
                                    peFy2: getAverageVal(peFy2Model)
                                },
                                median: {
                                    enterpriseValue: getMedianVal(enterpriseValueModel),
                                    pricePerShare: getMedianVal(pricePerShareModel),
                                    evRevLtm: getMedianVal(evRevLtmModel),
                                    evRevFy1: getMedianVal(evRevFy1Model),
                                    evRevFy2: getMedianVal(evRevFy2Model),
                                    evEbitdaLtm: getMedianVal(evEbitdaLtmModel),
                                    evEbitdaFy1: getMedianVal(evEbitdaFy1Model),
                                    evEbitdaFy2: getMedianVal(evEbitdaFy2Model),
                                    peLtm: getMedianVal(peLtmModel),
                                    peFy1: getMedianVal(peFy1Model),
                                    peFy2: getMedianVal(peFy2Model)
                                },
                                high: {
                                    enterpriseValue: getHighVal(enterpriseValueModel),
                                    pricePerShare: getHighVal(pricePerShareModel),
                                    evRevLtm: getHighVal(evRevLtmModel),
                                    evRevFy1: getHighVal(evRevFy1Model),
                                    evRevFy2: getHighVal(evRevFy2Model),
                                    evEbitdaLtm: getHighVal(evEbitdaLtmModel),
                                    evEbitdaFy1: getHighVal(evEbitdaFy1Model),
                                    evEbitdaFy2: getHighVal(evEbitdaFy2Model),
                                    peLtm: getHighVal(peLtmModel),
                                    peFy1: getHighVal(peFy1Model),
                                    peFy2: getHighVal(peFy2Model)
                                },
                                low: {
                                    enterpriseValue: getLowVal(enterpriseValueModel),
                                    pricePerShare: getLowVal(pricePerShareModel),
                                    evRevLtm: getLowVal(evRevLtmModel),
                                    evRevFy1: getLowVal(evRevFy1Model),
                                    evRevFy2: getLowVal(evRevFy2Model),
                                    evEbitdaLtm: getLowVal(evEbitdaLtmModel),
                                    evEbitdaFy1: getLowVal(evEbitdaFy1Model),
                                    evEbitdaFy2: getLowVal(evEbitdaFy2Model),
                                    peLtm: getLowVal(peLtmModel),
                                    peFy1: getLowVal(peFy1Model),
                                    peFy2: getLowVal(peFy2Model)
                                }

                            };
                            break;
                        case "custom":
                            var customValue = valuation.multiples.customValue;

                            return {
                                average: {
                                    customValue: getAverageVal(customValue)
                                },
                                median: {
                                    customValue: getMedianVal(customValue)
                                },
                                high: {
                                    customValue: getHighVal(customValue)
                                },
                                low: {
                                    customValue: getLowVal(customValue)
                                }

                            };
                            break;
                    }
                    break;
                case "marketTypeB":
                    //
            }
        }
    }
};

//Determine which value is active, depending on valuationCalc (average, median, high or low)
getVal = function(footballId, valuationId) {
    var valuation = Valuations.findOne({_id:valuationId});
    var valuationCalc = valuation.valuationCalc;
    var valuationSelections = valuation.valuationSelections;
    var valuationMultiples = valuation.multiples;

    if(valuationSelections.length > 0) {
        if(valuationMultiples) {
            switch(valuationCalc) {
                case "average":
                    return getValAll(footballId, valuationId).average;
                    break;
                case "median":
                    return getValAll(footballId, valuationId).median;
                    break;
                case "high":
                    return getValAll(footballId, valuationId).high;
                    break;
                case "low":
                    return getValAll(footballId, valuationId).low;
                    break;
            }
        }
    }
};

//Determines which multiple is active, based on valuationMetric and valuationPeriod
//This will be the multiple used to calculate the dimensions of the bar
getBuildMultiple = function(footballId, valuationId) {
    var football = Footballs.findOne({_id: footballId});
    var footballOutput = football.footballOutput;
    var marketType = football.marketType;

    var valuation = Valuations.findOne({_id: valuationId});
    if(valuation) {
        var valuationMetric = valuation.valuationMetric;
        var valuationPeriod = valuation.valuationPeriod;
        var valuationSelections = valuation.valuationSelections;
        var valuationMultiples = valuation.multiples;

        var val = getVal(footballId, valuationId);
        var scaleAdjust = getScale(footballId);

        if (valuationSelections.length > 0) {
            if (valuationMultiples) {
                switch (marketType) {
                    case "company":
                        var valuationType = valuation.valuationType;
                        switch (valuationType) {
                            case "comps":
                                switch (valuationMetric) {
                                    case "EV/Revenue":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.evRevLtm;
                                                break;
                                            case "FY1":
                                                return val.evRevFy1;
                                                break;
                                            case "FY2":
                                                return val.evRevFy2;
                                                break;
                                        }
                                        break;
                                    case "EV/EBITDA":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.evEbitdaLtm;
                                                break;
                                            case "FY1":
                                                return val.evEbitdaFy1;
                                                break;
                                            case "FY2":
                                                return val.evEbitdaFy2;
                                                break;
                                        }
                                        break;
                                    case "P/E":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.peLtm;
                                                break;
                                            case "FY1":
                                                return val.peFy1;
                                                break;
                                            case "FY2":
                                                return val.peFy2;
                                                break;
                                        }
                                        break;
                                }
                                break;
                            case "deals":
                                switch (valuationMetric) {
                                    case "EV/Revenue":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.evRevLtm;
                                                break;
                                            case "FY1":
                                                return val.evRevFy1;
                                                break;
                                            case "FY2":
                                                return val.evRevFy2;
                                                break;
                                        }
                                        break;
                                    case "EV/EBITDA":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.evEbitdaLtm;
                                                break;
                                            case "FY1":
                                                return val.evEbitdaFy1;
                                                break;
                                            case "FY2":
                                                return val.evEbitdaFy2;
                                                break;
                                        }
                                        break;
                                    case "P/E":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                return val.peLtm;
                                                break;
                                            case "FY1":
                                                return val.peFy1;
                                                break;
                                            case "FY2":
                                                return val.peFy2;
                                                break;
                                        }
                                        break;
                                }
                                break;
                            case "models":
                                switch (footballOutput) {
                                    case "Enterprise Value":
                                        return val.enterpriseValue;
                                        break;
                                    case "Price per Share":
                                        return val.pricePerShare;
                                        break;
                                    case "Multiple":
                                        switch (valuationMetric) {
                                            case "EV/Revenue":
                                                switch (valuationPeriod) {
                                                    case "LTM":
                                                        return val.evRevLtm;
                                                        break;
                                                    case "FY1":
                                                        return val.evRevFy1;
                                                        break;
                                                    case "FY2":
                                                        return val.evRevFy2;
                                                        break;
                                                }
                                                break;
                                            case "EV/EBITDA":
                                                switch (valuationPeriod) {
                                                    case "LTM":
                                                        return val.evEbitdaLtm;
                                                        break;
                                                    case "FY1":
                                                        return val.evEbitdaFy1;
                                                        break;
                                                    case "FY2":
                                                        return val.evEbitdaFy2;
                                                        break;
                                                }
                                                break;
                                            case "P/E":
                                                switch (valuationPeriod) {
                                                    case "LTM":
                                                        return val.peLtm;
                                                        break;
                                                    case "FY1":
                                                        return val.peFy1;
                                                        break;
                                                    case "FY2":
                                                        return val.peFy2;
                                                        break;
                                                }
                                                break;
                                        }
                                        break;
                                }
                                break;
                            case "custom":
                                var existingCustom = this.existingCustom;
                                if (existingCustom == "customValue") {
                                    var scale = football.footballScale;
                                    switch (scale) {
                                        case "millions":
                                            return val.customValue;
                                            break;
                                        case "billions":
                                            return val.customValue / scaleAdjust;
                                            break;
                                    }
                                } else {
                                    return val.customValue;
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
};

getBuildFinancial = function(footballId, valuationId) {
    var football = Footballs.findOne({_id:footballId});
    var footballType = football.footballType;
    var footballOutput = football.footballOutput;
    var targetType = football.footballTarget.targetType;
    var targetId = football.footballTarget.targetId;

    var valuation = Valuations.findOne({_id:valuationId});
    if(valuation) {
        var valuationSelections = valuation.valuationSelections;
        var valuationMetric = valuation.valuationMetric;
        var valuationPeriod = valuation.valuationPeriod;
        var valuationMultiples = valuation.multiples;

        if(valuationSelections.length > 0) {
            if(valuationMultiples) {
                if (footballType == "target") {
                    switch (targetType) {
                        case "company":
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
                            var valuationType = valuation.valuationType;
                            switch(valuationType) {
                                case "comps":
                                    switch (valuationMetric) {
                                        case "EV/Revenue":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.revenueLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.revenueFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.revenueFy2;
                                                    break;
                                            }
                                            break;
                                        case "EV/EBITDA":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.ebitdaLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.ebitdaFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.ebitdaFy2;
                                                    break;
                                            }
                                            break;
                                        case "P/E":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.epsLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.epsFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.epsFy2;
                                                    break;
                                            }
                                            break;
                                    }
                                    break;
                                case "deals":
                                    switch (valuationMetric) {
                                        case "EV/Revenue":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.revenueLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.revenueFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.revenueFy2;
                                                    break;
                                            }
                                            break;
                                        case "EV/EBITDA":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.ebitdaLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.ebitdaFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.ebitdaFy2;
                                                    break;
                                            }
                                            break;
                                        case "P/E":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompanyData.epsLtm;
                                                    break;
                                                case "FY1":
                                                    return feedCompanyData.epsFy1;
                                                    break;
                                                case "FY2":
                                                    return feedCompanyData.epsFy2;
                                                    break;
                                            }
                                            break;
                                    }
                                    break;
                                case "models":
                                    switch(footballOutput) {
                                        case "Enterprise Value":
                                            return 1;
                                            break;
                                        case "Price per Share":
                                            return 1;
                                            break;
                                    }
                                    break;
                                case "custom":
                                    return 1;
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

getBuildValue = function(footballId, valuationId) {
    var buildFinancial = getBuildFinancial(footballId, valuationId);
    var buildMultiple = getBuildMultiple(footballId, valuationId);
    return buildFinancial * buildMultiple;
};

//Determines Active Result from above, given valuationOutput, valuationOutputPeriod, valuationMetric, ValuationPeriod
getResultValue = function(footballId, valuationId) {
    var football = Footballs.findOne({_id: footballId});
    var footballOutput = football.footballOutput;
    var footballType = football.footballType;
    var targetId = football.footballTarget.targetId;
    var valuation = Valuations.findOne({_id: valuationId});

    if(valuation) {
        var valuationSelections = valuation.valuationSelections;
        var valuationMultiples = valuation.multiples;

        if (valuationSelections.length > 0 && valuationMultiples) {
            var valuationMetric = valuation.valuationMetric;
            var valuationPeriod = valuation.valuationPeriod;
            var valuationOutput = valuation.valuationOutput;
            var valuationOutputPeriod = valuation.valuationOutputPeriod;

            var buildMultiple = getBuildMultiple(footballId, valuationId);
            var buildValue = getBuildValue(footballId, valuationId);
            if (buildMultiple) {
                if (footballType == "market") {
                    return buildMultiple;
                } else {
                    var targetType = football.footballTarget.targetType;
                    switch (targetType) {
                        case "company":
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
                            var valuationType = valuation.valuationType;
                            if (valuationType == "comps" || valuationType == "deals") {
                                switch (valuationMetric) {
                                    case "EV/Revenue":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY1":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY2":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                        }
                                        break;
                                    case "EV/EBITDA":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY1":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY2":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return buildValue;
                                                        break;
                                                    case "Price per Share":
                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return (buildValue - feedCompanyData.netDebt) / feedCompanyData.sharesOs / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                        }
                                        break;
                                    case "P/E":
                                        switch (valuationPeriod) {
                                            case "LTM":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return (buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt;
                                                        break;
                                                    case "Price per Share":
                                                        return buildValue;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY1":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return (buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt;
                                                        break;
                                                    case "Price per Share":
                                                        return buildValue;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                            case "FY2":
                                                switch (footballOutput) {
                                                    case "Enterprise Value":
                                                        return (buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt;
                                                        break;
                                                    case "Price per Share":
                                                        return buildValue;
                                                        break;
                                                    case "Multiple":
                                                        switch (valuationOutput) {
                                                            case "EV/Revenue":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.revenueFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "EV/EBITDA":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return ((buildValue * feedCompanyData.sharesOs) + feedCompanyData.netDebt) / feedCompanyData.ebitdaFy2;
                                                                        break;
                                                                }
                                                                break;
                                                            case "P/E":
                                                                switch (valuationOutputPeriod) {
                                                                    case "LTM":
                                                                        return buildValue / feedCompanyData.epsLtm;
                                                                        break;
                                                                    case "FY1":
                                                                        return buildValue / feedCompanyData.epsFy1;
                                                                        break;
                                                                    case "FY2":
                                                                        return buildValue / feedCompanyData.epsFy2;
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                        break;
                                                }
                                                break;
                                        }
                                        break;
                                }
                            } else {
                                if (valuationType == "models") {
                                    switch (footballOutput) {
                                        case "Enterprise Value":
                                            return buildValue;
                                            break;
                                        case "Price per Share":
                                            return buildValue;
                                            break;
                                        case "Multiple":
                                            return buildMultiple;
                                            break;
                                    }
                                } else {
                                    return buildValue;
                                }
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


getValuationLowHigh = function(footballId, valuationId) {
    var valuationSpread = Valuations.findOne({_id:valuationId}).valuationSpread;

    var valuationActive = getResultValue(footballId, valuationId);

    return {
        valuationLow: valuationActive * (1 - (valuationSpread / 100)),
        valuationHigh: valuationActive * (1 + (valuationSpread / 100))
    };
};

getValuationCalcs = function(footballId, valuationId) {
    var footballRangeLow = getRangeCaps(footballId).min;
    var footballRangeHigh = getRangeCaps(footballId).max;
    var footballRange = footballRangeHigh - footballRangeLow;

    var valuationLow = getValuationLowHigh(footballId, valuationId).valuationLow;
    var valuationHigh = getValuationLowHigh(footballId, valuationId).valuationHigh;
    var valuationRange = valuationHigh - valuationLow;
    var valuationStart = valuationLow - footballRangeLow;
    var valuationEnd = valuationStart + valuationRange;

    if(footballRange) {
        return {
            startPct: valuationStart / footballRange * 100,
            widthPct: valuationRange / footballRange * 100,
            endPct: valuationEnd / footballRange * 100
        };
    }
};

getTextSpace = function(valuationId) {
    var spread = Valuations.findOne({_id:valuationId}).valuationSpread;
    if(spread == 0) {
        return 2.5
    } else {
        return 0.5
    }
};

getValuationText = function(footballId, valuationId) {
    var valuationStartPct = getValuationCalcs(footballId, valuationId).startPct;
    var valuationEndPct = getValuationCalcs(footballId, valuationId).endPct;

    var textSpace = getTextSpace(valuationId);
    var scaleSwitch = getRangeScale(footballId);

    var valuationLow = getValuationLowHigh(footballId, valuationId).valuationLow;
    var valuationHigh = getValuationLowHigh(footballId, valuationId).valuationHigh;

    return {
        valuationLowSpace: valuationStartPct - textSpace,
        valuationHighSpace: valuationEndPct + textSpace,
        valuationLowText: valuationLow / scaleSwitch,
        valuationHighText: valuationHigh / scaleSwitch
    }
};