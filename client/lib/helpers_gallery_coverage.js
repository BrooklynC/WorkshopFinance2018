////GALLERY COVERAGE - FOOTBALLS

//Values to display in Football item in Gallery
Template.registerHelper('galleryFootballTarget',function(){
    var footballType = Template.parentData(0).footballType;
    if(footballType == "market") {
        return {
            targetName: "Market Comparison",
            ticker: "No target"
        };
    } else {
        var target = {
            targetId: this.footballTarget.targetId,
            targetType: this.footballTarget.targetType,
            targetData: this.footballTarget.targetData
        };
        switch(target.targetType) {
            case "company":
                switch(target.targetData) {
                    case "feed":
                        var feedCompany = FeedCompanies.findOne({_id:target.targetId});
                        return {
                            targetName: feedCompany.companyName,
                            ticker: feedCompany.ticker
                        };
                        break;
                }
                break;
            case "marketTypeB":
                //
                break;
        }
    }
});

////GALLERY COVERAGE - TARGETS

//Values to display in Target item in Gallery
Template.registerHelper('galleryTargetData',function() {
    var target = {
        targetId: Template.parentData(0).targetId,
        targetType: Template.parentData(0).targetType,
        targetData: Template.parentData(0).targetData
    };

    switch(target.targetType) {
        case "company":
            switch(target.targetData) {
                case "feed":
                    var feedCompany = FeedCompanies.findOne({_id: target.targetId});
                    return {
                        targetName: feedCompany.companyName,
                        status: feedCompany.status,
                        ticker: feedCompany.ticker,
                        sector: feedCompany.sector,
                        subSector: feedCompany.subSector
                    };
                    break;
                case "custom":
                    var customCompany = TargetsCompanies.findOne({_id: targetId});
                    return {
                        targetName: customCompany.companyName,
                        status: customCompany.status,
                        ticker: "N/A",
                        sector: customCompany.sector,
                        subSector: customCompany.subSector
                    };
                    break;
            }
            break;
        case "marketTypeB":
            //
            break;
    }
});

////GALLERY COVERAGE - VALUATIONS

//Chooses valuationType and valuationElement to include when adding new Valuation
getValuationSelect = function() {
    var library = Session.get('sessionLibraryType');
    switch(library) {
        case "Comps":
            return {
                type: "comps",
                element: "security"
            };
            break;
        case "Comps Indices":
            return {
                type: "comps",
                element: "index"
            };
            break;
        case "Deals":
            return {
                type: "deals",
                element: "security"
            };
            break;
        case "Deals Indices":
            return {
                type: "deals",
                element: "index"
            };
            break;
    }
};

//Chooses valuationMetric, valuationPeriod, output and outputPeriod to include when adding new Valuation
getValuationInfo = function(marketType) {
    switch(marketType) {
        case "company":
            return {
                metric: "EV/EBITDA",
                period: "LTM",
                output: "EV/EBITDA",
                outputPeriod: "LTM"
            };
            break;
        case "marketTypeB":
            //
            break;
    }
};