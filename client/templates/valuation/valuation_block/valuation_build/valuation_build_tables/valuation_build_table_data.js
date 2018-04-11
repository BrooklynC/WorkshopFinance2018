Template.ValuationBuildTableData.events ({
    'click .btn-remove': function(e) {
        e.preventDefault();

        var currentValuationId = Template.parentData(0)._id;
        var currentSelection = this._id;

        var ownerId = Template.parentData(1).ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            if (confirm("Delete this comp?")) {
                Meteor.call('valuationBuildPull', currentUserId, currentValuationId, currentSelection, function(error, result) {
                });
            }
        }
    }
});

Template.ValuationBuildTableData.helpers({
    selections: function() {
        //Changes cursor used to display selections depending on valuationType and valuationElement
        var valuationSelections = this.valuationSelections;

        if (valuationSelections) {
            var marketType = this.marketType;
            var valuationType = this.valuationType;
            var valuationElement = this.valuationElement;
            switch(marketType) {
                case "company":
                    switch (valuationType) {
                        case "comps":
                            switch (valuationElement) {
                                case "security":
                                    return FeedCompanies.find({_id: {$in: valuationSelections}});
                                    break;
                                case "index":
                                    return FeedCompaniesIndices.find({_id: {$in: valuationSelections}});
                                    break;
                            }
                            break;
                        case "deals":
                            switch (valuationElement) {
                                case "security":
                                    return FeedDeals.find({_id: {$in: valuationSelections}});
                                    break;
                                case "index":
                                    return FeedDealsIndices.find({_id: {$in: valuationSelections}});
                                    break;
                            }
                            break;
                        case "models":
                                return Models.find({_id: {$in: valuationSelections}});
                                break;
                    }
                    break;
                case "marketTypeB":
                    //
                    break;
                }
            }
    },
    twoColumnHeader: function() {
        var valuationType = this.valuationType;
        var valuationElement = this.valuationElement;
        switch(valuationType) {
            case "comps":
                switch(valuationElement) {
                    case "security":
                        return true;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
            case "deals":
                switch(valuationElement) {
                    case "security":
                        return false;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
        }
    },
    twoColumn: function() {
        var valuationType = Template.parentData(1).valuationType;
        var valuationElement = Template.parentData(1).valuationElement;
        switch(valuationType) {
            case "comps":
                switch(valuationElement) {
                    case "security":
                        return true;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
            case "deals":
                switch(valuationElement) {
                    case "security":
                        return false;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
        }
    },
    isSecurity: function() {
        var valuationType = Template.parentData(1).valuationType;
        var valuationElement = Template.parentData(1).valuationElement;
        switch(valuationType) {
            case "comps":
                switch(valuationElement) {
                    case "security":
                        return true;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
            case "deals":
                switch(valuationElement) {
                    case "security":
                        return true;
                        break;
                    case "index":
                        return false;
                        break;
                }
                break;
        }
    },
    headingName: function() {
        var marketType = this.marketType;
        var valuationType = this.valuationType;
        var valuationElement = this.valuationElement;
        switch(marketType) {
            case "company":
                switch(valuationType) {
                    case "comps":
                        switch(valuationElement) {
                            case "security":
                                return {
                                    one: "Ticker",
                                    two: "Company"
                                };
                                break;
                            case "index":
                                return {
                                    one: '',
                                    two: "Index"
                                };
                                break;
                        }
                        break;
                    case "deals":
                        switch(valuationElement) {
                            case "security":
                                return {
                                    one: '',
                                    two: "Deal"
                                };
                                break;
                            case "index":
                                return {
                                    one: '',
                                    two: "Index"
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
    },
    headingValueOne: function() {
        var valuationMetric = this.valuationMetric;
        switch (valuationMetric) {
            case "EV/Revenue":
                return "EV";
                break;
            case "EV/EBITDA":
                return "EV";
                break;
            case "P/E":
                return "Price";
                break;
        }
    },
    headingValueTwo: function() {
        var valuationMetric = this.valuationMetric;
        var valuationPeriod = this.valuationPeriod;
        switch (valuationMetric) {
            case "EV/Revenue":
                switch (valuationPeriod) {
                    case "LTM":
                        return "Revenue (LTM)";
                        break;
                    case "FY1":
                        return "Revenue (FY1)";
                        break;
                    case "FY2":
                        return "Revenue (FY2)";
                        break;
                }
                break;
            case "EV/EBITDA":
                switch (valuationPeriod) {
                    case "LTM":
                        return "EBITDA (LTM)";
                        break;
                    case "FY1":
                        return "EBITDA (FY1)";
                        break;
                    case "FY2":
                        return "EBITDA (FY2)";
                        break;
                }
                break;
            case "P/E":
                switch (valuationPeriod) {
                    case "LTM":
                        return "EPS (LTM)";
                        break;
                    case "FY1":
                        return "EPS (FY1)";
                        break;
                    case "FY2":
                        return "EPS (FY2)";
                        break;
                }
                break;
        }
    },
    valueOneFormat: function(a) {
        if(a) {
            var valuationElement = Template.parentData(1).valuationElement;
            var valuationMetric = Template.parentData(1).valuationMetric;
            if(valuationElement === "security") {
                switch(valuationMetric) {
                    case "EV/Revenue":
                        return numeral(a).format('$0,0.0');
                        break;
                    case "EV/EBITDA":
                        return numeral(a).format('$0,0.0');
                        break;
                    case "P/E":
                        return numeral(a).format('$0,0.00');
                        break;
                }
            }
        }
    },
    valueTwoFormat: function(a) {
        if(a) {
            var valuationElement = Template.parentData(1).valuationElement;
            var valuationMetric = Template.parentData(1).valuationMetric;
            if(valuationElement === "security") {
                switch(valuationMetric) {
                    case "EV/Revenue":
                        return numeral(a).format('$0,0.0');
                        break;
                    case "EV/EBITDA":
                        return numeral(a).format('$0,0.0');
                        break;
                    case "P/E":
                        return numeral(a).format('$0,0.00');
                        break;
                }
            }
        }
    },
    buildOneFormat: function(a) {
        if(a) {
            var valuationId = this._id;
            var footballId = Template.parentData(1)._id;
            var footballType = Template.parentData(1).footballType;
            if(footballType == "target") {
                var multiple = getBuildMultiple(footballId, valuationId);
                if(multiple) {
                    var valuationMetric = this.valuationMetric;
                    switch(valuationMetric) {
                        case "EV/Revenue":
                            return numeral(a).format('$0,0.0');
                            break;
                        case "EV/EBITDA":
                            return numeral(a).format('$0,0.0');
                            break;
                        case "P/E":
                            return numeral(a).format('$0,0.00');
                            break;
                    }
                }
            }
        }
    },
    buildTwoFormat: function(a) {
        if(a) {
            var valuationId = this._id;
            var footballId = Template.parentData(1)._id;
            var footballType = Template.parentData(1).footballType;
            if(footballType == "target") {
                var multiple = getBuildMultiple(footballId, valuationId);
                if(multiple) {
                    var valuationMetric = this.valuationMetric;
                    switch(valuationMetric) {
                        case "EV/Revenue":
                            return numeral(a).format('$0,0.0');
                            break;
                        case "EV/EBITDA":
                            return numeral(a).format('$0,0.0');
                            break;
                        case "P/E":
                            return numeral(a).format('$0,0.00');
                            break;
                    }
                }
            }
        }
    },
    select: function() {
        var valuationMetric = Template.parentData(1).valuationMetric;
        switch (valuationMetric) {
            case "EV/Revenue":
                return {
                    currency: "",
                    multiple: "x"
                };
            case "EV/EBITDA":
                return {
                    currency: "",
                    multiple: "x"
                };
                break;
            case "P/E":
                return {
                    currency: "",
                    multiple: "x"
                };
                break;
        }
    },
    selectInfo: function() {
        var marketType = Template.parentData(1).marketType;
        switch(marketType) {
            case "company":
                return {
                    iden: this.ticker,
                    name: this.companyName
                };
                break;
            case "marketTypeB":
                //
                break;
        }
    },
    selectCity: function() {
        var marketType = Template.parentData(1).marketType;
        switch(marketType) {
            case "company":
                return '';
                break;
            case "marketTypeB":
                //
                break;
        }
    },
    valueOne: function () {
        var footballId = Template.parentData(2)._id;
        var valuationMetric = Template.parentData(1).valuationMetric;
        var scaleAdjust = getScale(footballId);
        var marketType = Template.parentData(1).marketType;
        var valuationType = Template.parentData(1).valuationType;
        var valuationElement = Template.parentData(1).valuationElement;
        switch(marketType) {
            case "company":
                switch(valuationType) {
                    case "comps":
                        switch(valuationElement) {
                            case "security":
                                var companyId = this._id;
                                var sharesOs = this.capTable.sharesOs;
                                var netDebt = this.capTable.netDebt;
                                var stockPrice = getCompPrice(companyId);
                                var marketCap = sharesOs * stockPrice;
                                var evComp = marketCap + netDebt;
                                switch (valuationMetric) {
                                    case "EV/Revenue":
                                        return evComp / scaleAdjust;
                                        break;
                                    case "EV/EBITDA":
                                        return evComp / scaleAdjust;
                                        break;
                                    case "P/E":
                                        return stockPrice;
                                        break;
                                }
                                break;
                            case "index":
                                return '';
                                break;
                        }
                        break;
                    case "deals":
                        switch(valuationElement) {
                            case "security":
                                var evDeal = this.dealTerms.enterpriseValueDeal;
                                switch (valuationMetric) {
                                    case "EV/Revenue":
                                        return evDeal / scaleAdjust;
                                        break;
                                    case "EV/EBITDA":
                                        return evDeal / scaleAdjust;
                                        break;
                                }
                                break;
                            case "index":
                                return '';
                                break;
                        }
                        break;
                }
                break;
            case "marketTypeB":
                //
                break;
        }
    },
    valueTwo: function () {
        var footballId = Template.parentData(2)._id;
        var marketType = Template.parentData(1).marketType;
        var valuationMetric = Template.parentData(1).valuationMetric;
        var valuationPeriod = Template.parentData(1).valuationPeriod;
        var valuationElement = Template.parentData(1).valuationElement;
        var scaleAdjust = getScale(footballId);

        switch(marketType) {
            case "company":
                switch (valuationElement) {
                    case "security":
                        switch (valuationMetric) {
                            case "EV/Revenue":
                                switch (valuationPeriod) {
                                    case "LTM":
                                        return this.financial.ltm.revenue / scaleAdjust;
                                        break;
                                    case "FY1":
                                        return this.financial.fy1.revenue / scaleAdjust;
                                        break;
                                    case "FY2":
                                        return this.financial.fy2.revenue / scaleAdjust;
                                        break;
                                }
                                break;
                            case "EV/EBITDA":
                                switch (valuationPeriod) {
                                    case "LTM":
                                        return this.financial.ltm.ebitda / scaleAdjust;
                                        break;
                                    case "FY1":
                                        return this.financial.fy1.ebitda / scaleAdjust;
                                        break;
                                    case "FY2":
                                        return this.financial.fy2.ebitda / scaleAdjust;
                                        break;
                                }
                                break;
                            case "P/E":
                                switch (valuationPeriod) {
                                    case "LTM":
                                        return this.financial.ltm.eps;
                                        break;
                                    case "FY1":
                                        return this.financial.fy1.eps;
                                        break;
                                    case "FY2":
                                        return this.financial.fy2.eps;
                                        break;
                                }
                                break;
                            default:
                                return "";
                        }
                        break;
                    case "index":
                        return '';
                        break;
                }
                break;
            case "marketTypeB":
                //
                break;
        }
    },
    buildMultiple: function() {
        var valuationId = this._id;
        var selections = this.valuationSelections;
        var footballId = Template.parentData(1)._id;
        if(selections == 0) {
            return ""
        } else {
            return getBuildMultiple(footballId, valuationId)
        }
    },
    valuationIndex: function() {
        var indexId = this._id;
        var valuationId = Template.parentData(1)._id;
        var valuationMetric = Template.parentData(1).valuationMetric;
        var valuationPeriod = Template.parentData(1).valuationPeriod;
        switch (valuationMetric) {
            case "EV/Revenue":
                switch(valuationPeriod) {
                    case "LTM":
                        return getValuationIndex(indexId, valuationId).evRevenueLtm;
                        break;
                    case "FY1":
                        return getValuationIndex(indexId, valuationId).evRevenueFy1;
                        break;
                    case "FY2":
                        return getValuationIndex(indexId, valuationId).evRevenueFy2;
                        break;
                }
                break;
            case "EV/EBITDA":
                switch(valuationPeriod) {
                    case "LTM":
                        return getValuationIndex(indexId, valuationId).evEbitdaLtm;
                        break;
                    case "FY1":
                        return getValuationIndex(indexId, valuationId).evEbitdaFy1;
                        break;
                    case "FY2":
                        return getValuationIndex(indexId, valuationId).evEbitdaFy2;
                        break;
                }
                break;
            case "P/E":
                switch(valuationPeriod) {
                    case "LTM":
                        return getValuationIndex(indexId, valuationId).priceEarningsLtm;
                        break;
                    case "FY1":
                        return getValuationIndex(indexId, valuationId).priceEarningsFy1;
                        break;
                    case "FY2":
                        return getValuationIndex(indexId, valuationId).priceEarningsFy2;
                        break;
                }
                break;
        }
    },
    buildValueAdjusted: function() {
        var valuationId = this._id;
        var footballId = Template.parentData(1)._id;
        var footballType = Template.parentData(1).footballType;
        if(footballType == "target") {
            var scale = Template.parentData(1).footballScale;
            var valuationMetric = this.valuationMetric;
            var value = getBuildValue(footballId, valuationId);
            switch(valuationMetric) {
                case "EV/Revenue":
                    switch (scale) {
                        case "millions":
                            return value;
                            break;
                        case "billions":
                            return value / 1000;
                            break;
                    }
                    break;
                case "EV/EBITDA":
                    switch (scale) {
                        case "millions":
                            return value;
                            break;
                        case "billions":
                            return value / 1000;
                            break;
                    }
                    break;
                case "P/E":
                    return value;
                    break;
            }
        }
    },
    targetReferenceValue: function() {
        var footballId = Template.parentData(1)._id;
        var football = Footballs.findOne({_id:footballId});
        var footballType = football.footballType;
        if(footballType == "target") {
            var targetId = football.footballTarget.targetId;
            var targetType = football.footballTarget.targetType;
            var targetData = football.footballTarget.targetData;
            var marketType = this.marketType;
            var valuationMetric = this.valuationMetric;
            var valuationPeriod = this.valuationPeriod;
            var scaleAdjust = getScale(footballId);
            switch(marketType) {
                case "company":
                    switch(targetType) {
                        case "company":
                            switch(targetData) {
                                case "feed":
                                    var feedCompany = FeedCompanies.findOne({_id:targetId});
                                    switch (valuationMetric) {
                                        case "EV/Revenue":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompany.financial.ltm.revenue / scaleAdjust;
                                                    break;
                                                case "FY1":
                                                    return feedCompany.financial.fy1.revenue / scaleAdjust;
                                                    break;
                                                case "FY2":
                                                    return feedCompany.financial.fy2.revenue / scaleAdjust;
                                                    break;
                                            }
                                            break;
                                        case "EV/EBITDA":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompany.financial.ltm.ebitda / scaleAdjust;
                                                    break;
                                                case "FY1":
                                                    return feedCompany.financial.fy1.ebitda / scaleAdjust;
                                                    break;
                                                case "FY2":
                                                    return feedCompany.financial.fy2.ebitda / scaleAdjust;
                                                    break;
                                            }
                                            break;
                                        case "P/E":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return feedCompany.financial.ltm.eps;
                                                    break;
                                                case "FY1":
                                                    return feedCompany.financial.fy1.eps;
                                                    break;
                                                case "FY2":
                                                    return feedCompany.financial.fy2.eps;
                                                    break;
                                            }
                                            break;
                                    }
                                    break;
                                case "custom":
                                    var customCompany = TargetsCompanies.findOne({_id:targetId});
                                    switch (valuationMetric) {
                                        case "EV/Revenue":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return customCompany.financial.ltm.revenue / scaleAdjust;
                                                    break;
                                                case "FY1":
                                                    return customCompany.financial.fy1.revenue / scaleAdjust;
                                                    break;
                                                case "FY2":
                                                    return customCompany.financial.fy2.revenue / scaleAdjust;
                                                    break;
                                            }
                                            break;
                                        case "EV/EBITDA":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return customCompany.financial.ltm.ebitda / scaleAdjust;
                                                    break;
                                                case "FY1":
                                                    return customCompany.financial.fy1.ebitda / scaleAdjust;
                                                    break;
                                                case "FY2":
                                                    return customCompany.financial.fy2.ebitda / scaleAdjust;
                                                    break;
                                            }
                                            break;
                                        case "P/E":
                                            switch (valuationPeriod) {
                                                case "LTM":
                                                    return customCompany.financial.ltm.eps;
                                                    break;
                                                case "FY1":
                                                    return customCompany.financial.fy1.eps;
                                                    break;
                                                case "FY2":
                                                    return customCompany.financial.fy2.eps;
                                                    break;
                                            }
                                            break;
                                    }
                                    break;
                            }
                    }
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        }
    }
});