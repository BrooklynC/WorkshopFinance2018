////FOOTBALL

//Creates an object to insert as Target, depending on certain criteria that have been selected
getTarget = function(currentFootballId, targetSelection) {
    var football = Footballs.findOne({_id:currentFootballId});
    if(!football) {
        return {
            targetId: "none",
            targetType: "none",
            targetData: "none"
        }
    } else {
        var marketType = Footballs.findOne({_id:currentFootballId}).marketType;
        var targetData = Session.get('targetData');
        if(targetSelection == "none")  {
            return {
                targetId: "none",
                targetType: "none",
                targetData: "none"
            }
        } else {
            switch(marketType) {
                case "company":
                    switch(targetData) {
                        case "feed":
                            var feedCompanyId = FeedCompanies.findOne({ticker:targetSelection})._id;
                            return {
                                targetId: feedCompanyId,
                                targetType: "company",
                                targetData: "feed"
                            };
                    }
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        }
    }
};

//Chooses footballType to set, depending on whether or not a target is selected
getFootballType = function(targetSelection) {
    if(targetSelection == "none")  {
        return "market"
    } else {
        return "target"
    }
};

//Checks scale to call in range calculations
getRangeScale = function(footballId) {
    var football = Footballs.findOne({_id:footballId});
    var scale = football.footballScale;
    var output = football.footballOutput;
    if(output == "Enterprise Value") {
        switch(scale) {
            case "millions":
                return 1;
                break;
            case "billions":
                return 1000;
        }
    } else {
        return 1;

    }
};

//Factor to use in rounding values in Range calculations
getRangeOutput = function(footballId) {
    var output = Footballs.findOne({_id:footballId}).footballOutput;
    switch(output) {
        case "Enterprise Value":
            return {
                small: 5000,
                large: 10000,
                xLarge: 25000
            };
            break;
        case "Price per Share":
            return {
                small: 10,
                large: 10,
                xLarge: 10
            };
            break;
        case "Multiple":
            return {
                small: 1,
                large: 1,
                xLarge: 1
            };
            break;
    }
};

//Get Current Price for this target for use in Current d3 rendering
getTargetPrice = function(footballId) {
    var football = Footballs.findOne({_id:footballId});
    var footballType = football.footballType;
    if(footballType == "target") {
        var targetId = football.footballTarget.targetId;
        var targetType = football.footballTarget.targetType;
        var targetData = football.footballTarget.targetData;
        switch(targetType) {
            case "company":
                switch(targetData) {
                    case "feed":
                        var feedCompany = FeedCompanies.findOne({_id:targetId});
                        var currentDate = football.includeCurrentDate;

                        var currentPrice = 0;
                        _.each(feedCompany.closingPrices, function (closingPrices) {
                            if (closingPrices.date == currentDate) currentPrice = closingPrices.price;
                        });
                        return currentPrice;
                        break;
                }
        }
    }
};

//Use Current Price, depending on footballOutput
//This helper is called in FootballFieldCurrent and FootballFieldTrading
getTargetCurrent = function(footballId) {
    var football = Footballs.findOne({_id:footballId});
    var footballOutput = football.footballOutput;
    var footballType = football.footballType;

    if(footballType == "target") {
        var targetId = football.footballTarget.targetId;
        var targetType = football.footballTarget.targetType;
        var targetData = football.footballTarget.targetData;
        switch(targetType) {
            case "company":
                switch (targetData) {
                    case "feed":
                        var targetPrice = getTargetPrice(footballId);

                        var feedCompany = FeedCompanies.findOne({_id: targetId});
                        var sharesOsFeed = feedCompany.capTable.sharesOs;
                        var netDebtFeed = feedCompany.capTable.netDebt;
                        var marketCapFeed = sharesOsFeed * targetPrice;
                        var evFeed = marketCapFeed + netDebtFeed;

                        switch (footballOutput) {
                            case "Enterprise Value":
                                return marketCapFeed + netDebtFeed;
                                break;
                            case "Price per Share":
                                return targetPrice;
                                break;
                            case "Multiple":
                                var currentMetric = football.includeCurrentMetric;
                                var currentPeriod = football.includeCurrentPeriod;
                                switch (currentMetric) {
                                    case "EV/Revenue":
                                        switch (currentPeriod) {
                                            case "LTM":
                                                return evFeed / feedCompany.financial.ltm.revenue;
                                                break;
                                            case "FY1":
                                                return evFeed / feedCompany.financial.fy1.revenue;
                                                break;
                                            case "FY2":
                                                return evFeed / feedCompany.financial.fy2.revenue;
                                                break;
                                        }
                                        break;
                                    case "EV/EBITDA":
                                        switch (currentPeriod) {
                                            case "LTM":
                                                return evFeed / feedCompany.financial.ltm.ebitda;
                                                break;
                                            case "FY1":
                                                return evFeed / feedCompany.financial.fy1.ebitda;
                                                break;
                                            case "FY2":
                                                return evFeed / feedCompany.financial.fy2.ebitda;
                                                break;
                                        }
                                        break;
                                    case "P/E":
                                        switch (currentPeriod) {
                                            case "LTM":
                                                return targetPrice / feedCompany.financial.ltm.eps;
                                                break;
                                            case "FY1":
                                                return targetPrice / feedCompany.financial.fy1.eps;
                                                break;
                                            case "FY2":
                                                return targetPrice / feedCompany.financial.fy2.eps;
                                                break;
                                        }
                                        break;
                                }
                        }
                        break;
                }
        }
    }
};

//Calculates boundaries for FootballRange by taking max/min of array that includes all valuations, Current Value and Trading Value
//Max/min are rounded using helper above
getRangeCaps = function(footballId) {
    var football = Footballs.findOne({_id:footballId});
    if(football) {
        var footballType = football.footballType;
        var footballOutput = football.footballOutput;
        var valuations = football.footballValuations;
        var valuationsCount = valuations.length;
        var results = {
            low: [],
            high: []
        };
        //Push result from each valuation into results array
        if(valuationsCount > 0) {
            valuations.forEach(function(valuationId) {
                var valuation = Valuations.findOne({_id:valuationId});
                if(valuation) {
                    var valuationSelections = valuation.valuationSelections;
                    var valuationSelectionsCount = valuationSelections.length;
                    if(valuationSelectionsCount > 0) {
                        var valuationType = valuation.valuationType;
                        var valuationSpread = valuation.valuationSpread;
                        var activeResult = getResultValue(footballId, valuationId);
                        var activeResultAdj = {
                            low: activeResult * (1 - valuationSpread/100),
                            high: activeResult * (1 + valuationSpread/100)
                        };
                        if(valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
                            if (activeResult) {
                                results.low.push(activeResultAdj.low);
                                results.high.push(activeResultAdj.high);
                            }
                        } else {
                            var existingCustom = valuation.existingCustom;
                            switch (footballOutput) {
                                case "Enterprise Value":
                                    if (existingCustom == "Value") {
                                        if (activeResult) {
                                            results.low.push(activeResultAdj.low);
                                            results.high.push(activeResultAdj.high);
                                        }
                                    }
                                    break;
                                case "Price per Share":
                                    if (existingCustom == "Price") {
                                        if (activeResult) {
                                            results.low.push(activeResultAdj.low);
                                            results.high.push(activeResultAdj.high);
                                        }
                                    }
                                    break;
                                case "Multiple":
                                    if (existingCustom == "Multiple") {
                                        if (activeResult) {
                                            results.low.push(activeResultAdj.low);
                                            results.high.push(activeResultAdj.high);
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            });
        }
    }
    //Push result from each includeCurrent, if it exists, into results array
    var includeCurrent = football.includeCurrent;
    var current = getTargetCurrent(footballId);
    if(includeCurrent) {
        results.low.push(current);
        results.high.push(current);
    }
    //Find low and high valuation multiples of results array
    var resultLow = Math.min.apply(null, results.low);
    var resultHigh = Math.max.apply(null, results.high);

    //Check if any results has any values
    var resultsLowLength = results.low.length;
    var resultsWithCurrent = [];
    if(resultsLowLength > 0) {
        //Push low and high into resultsWithCurrent array
        resultsWithCurrent.push(resultLow, resultHigh);
    }

    //Push includeTrading result, if it exists, into resultsWithCurrent array
    if(footballType == "target") {
        var targetId = football.footballTarget.targetId;
        var targetType = football.footballTarget.targetType;
        var targetData = football.footballTarget.targetData;
        switch(targetType) {
            case "company":
                switch(targetData) {
                    case "feed":
                        var status = FeedCompanies.findOne({_id:targetId}).status;
                        if(status == "public") {
                            var includeTrading = football.includeTrading;
                            var tradingSpread = 0.1;
                            var tradingLow = current * (1 - tradingSpread);
                            var tradingHigh = current * (1 + tradingSpread);
                            if(includeTrading) {
                                resultsWithCurrent.push(tradingLow, tradingHigh);
                            }
                        }
                }
        }
    }

    //Find low and high valuation multiples of resultsWithCurrent array
    var resultLowAll = Math.min.apply(null, resultsWithCurrent);
    var resultHighAll = Math.max.apply(null, resultsWithCurrent);

    //Gets rounding metric for each output
    var outputRangeSmall = getRangeOutput(footballId).small;
    var outputRangeLarge = getRangeOutput(footballId).large;
    var outputRangeXlarge = getRangeOutput(footballId).xLarge;

    //Rounds low and high multiples based on above
    if(resultHighAll < "100000") {
        var rangeLowRoundSmall = Math.floor(resultLowAll / outputRangeSmall) * outputRangeSmall;
        var rangeHighRoundSmall = Math.ceil(resultHighAll / outputRangeSmall) * outputRangeSmall;
    } else {
        if(resultHighAll >= "100000" && resultHighAll < "1000000") {
            var rangeLowRoundLarge = Math.floor(resultLowAll / outputRangeLarge) * outputRangeLarge;
            var rangeHighRoundLarge = Math.ceil(resultHighAll / outputRangeLarge) * outputRangeLarge;
        } else {
            var rangeLowRoundXlarge = Math.floor(resultLowAll / outputRangeXlarge) * outputRangeXlarge;
            var rangeHighRoundXlarge = Math.ceil(resultHighAll / outputRangeXlarge) * outputRangeXlarge;
        }
    }

    //Calculates cushion to apply to low and high
    var cushion = football.footballCushion;
    var rangeCushionSmall = cushion * outputRangeSmall;
    var rangeCushionLarge = cushion * outputRangeLarge;
    var rangeCushionXlarge = cushion * outputRangeXlarge;

    //Adds a cushion to low and high and limits low to zero
    if(results) {
        if(resultHighAll < "100000") {
            var rangeLowFinalSmall = rangeLowRoundSmall - rangeCushionSmall;
            var rangeHighFinalSmall = rangeHighRoundSmall + rangeCushionSmall;
            return {
                min: Math.max(0, rangeLowFinalSmall),
                max: rangeHighFinalSmall
            }
        } else {
            if(resultHighAll >= "100000" && resultHighAll < "1000000") {
                var rangeLowFinalLarge = rangeLowRoundLarge - rangeCushionLarge;
                var rangeHighFinalLarge = rangeHighRoundLarge + rangeCushionLarge;
                return {
                    min: Math.max(0, rangeLowFinalLarge),
                    max: rangeHighFinalLarge
                }
            } else {
                var rangeLowFinalXlarge = rangeLowRoundXlarge - rangeCushionXlarge;
                var rangeHighFinalXlarge = rangeHighRoundXlarge + rangeCushionXlarge;
                return {
                    min: Math.max(0, rangeLowFinalXlarge),
                    max: rangeHighFinalXlarge
                }
            }
        }
    }
};

//Helper for Current d3
getCurrentCalcs = function(footballId) {
    //var footballRangeLow = 0;
    //var footballRangeHigh = 20000;
    var footballRangeLow = getRangeCaps(footballId).min;
    var footballRangeHigh = getRangeCaps(footballId).max;
    var footballRange = footballRangeHigh - footballRangeLow;

    var targetCurrent = getTargetCurrent(footballId);
    var start = targetCurrent - footballRangeLow;
    return {
        startPct: start / footballRange * 100
    }
};

getTradingCalcs = function(footballId) {
    //var footballRangeLow = 0;
    //var footballRangeHigh = 20000;
    var footballRangeLow = getRangeCaps(footballId).min;
    var footballRangeHigh = getRangeCaps(footballId).max;
    var footballRange = footballRangeHigh - footballRangeLow;

    //10% spread on either side of current price
    var targetCurrent = getTargetCurrent(footballId);
    var spread = 0.1;
    var targetLow = targetCurrent * (1 - spread);
    var targetHigh = targetCurrent * (1 + spread);
    var targetWidth = targetHigh - targetLow;
    var start = targetLow - footballRangeLow;
    return {
        startPct: start / footballRange * 100,
        widthPct: targetWidth / footballRange * 100
    }
};