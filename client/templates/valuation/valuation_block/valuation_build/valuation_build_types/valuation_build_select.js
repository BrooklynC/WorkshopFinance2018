Template.ValuationBuildSelect.events({
    'click .build-type li': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var footballType = Template.parentData(1).footballType;

        var option = $(e.target).text();

        switch(footballType) {
            case "target":
                Template.instance().state.set('sector', null);
                Template.instance().state.set('selection', null);
                Meteor.call('valuationBuildType', currentValuationId, option, function(error, result) {});
                break;
            case "market":
                if(option !== "Models") {
                    Template.instance().state.set('sector', null);
                    Template.instance().state.set('selection', null);
                    Meteor.call('valuationBuildType', currentValuationId, option, function(error, result) {});
                }
                break;
        }
    },
    'click .build-sector-select': function(e) {
        e.preventDefault();

        var sector = $(e.target).text();

        Template.instance().state.set('sector', sector);
    },
    'click .build-selection-select': function(e) {
        e.preventDefault();

        var selection = this._id;

        Template.instance().state.set('selection', selection);
    },
    'submit form': function(e) {
        e.preventDefault();

        var currentFootballId = Template.parentData(1)._id;
        var currentValuationId = this._id;
        var selection = Template.instance().state.get('selection');

        Template.instance().state.set('selection', null);

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            return Meteor.call('valuationBuildDataAdd', currentFootballId, currentValuationId, selection, function(error, result) {
            });
        }
    }
});

Template.ValuationBuildSelect.helpers({
    isData: function() {
        var type = this.valuationType;
        if(type == "comps" || type == "deals") {
            return true
        }
    },
    isModels: function() {
        var type = this.valuationType;
        if(type == "models") {
            return true
        }
    },
    isCustom: function() {
        var type = this.valuationType;
        if(type == "custom") {
            return true
        }
    },
    type: function() {
        var valuationType = this.valuationType;
        var valuationElement = this.valuationElement;
        switch(valuationType) {
            case "comps":
                switch(valuationElement) {
                    case "security":
                        return "Comps";
                        break;
                    case "index":
                        return "Comps Indices";
                }
                break;
            case "deals":
                switch(valuationElement) {
                    case "security":
                        return "Deals";
                        break;
                    case "index":
                        return "Deals Indices";
                }
                break;
            case "models":
                return "Models";
                break;
            case "custom":
                return "Custom";
                break;
        }
    },
    isSecurity: function() {
        var element = this.valuationElement;
        if(element == "security") {
            return true
        }
    },
    sectorTitle: function() {
        var type = this.valuationType;
        var element = this.valuationElement;
        switch(type) {
            case "comps":
                switch(element) {
                    case "security":
                        return "Comps";
                        break;
                    case "index":
                        return "Index";
                        break;
                }
                break;
            case "deals":
                switch(element) {
                    case "security":
                        return "Deals";
                        break;
                    case "index":
                        return "Index";
                        break;
                }
                break;
        }
    },
    sectors: function() {
        var type = this.valuationType;
        switch(type) {
            case "comps":
                return ["Healthcare","Materials","Industrials","Information Technology","Financials","Consumer Staples","Consumer Discretionary","Utilities","Energy","Telecommunication Services"];
                break;
            case "deals":
                return ["Healthcare","Materials","Industrials","High Technology","Media and Entertainment","Financials","Real Estate","Consumer Staples","Consumer Products and Services","Retail","Energy and Power","Telecommunication"];
                break;
        }
    },
    buildWidth: function() {
        var element = this.valuationElement;
        switch(element) {
            case "security":
                return  {
                    selection: "build-selection-security",
                    options: "build-options-security",
                    add: "build-add-security"
                };
                break;
            case "index":
                return  {
                    selection: "build-selection-index",
                    options: "build-options-index",
                    add: "build-add-index"
                };
                break;
        }
    },
    selectionTitle: function() {
        var sector = Template.instance().state.get('sector');
        var element = this.valuationElement;
        var type = this.valuationType;
            switch(element) {
                case "security":
                    if(sector == null) {
                        switch(type) {
                            case "comps":
                                return "Comps";
                                break;
                            case "deals":
                                return "Deals";
                                break;
                        }
                    } else {
                        return sector
                    }
                    break;
                case "index":
                    switch(type) {
                        case "comps":
                            return "Comps Indices";
                            break;
                        case "deals":
                            return "Deals Indices"
                    }
                    break;
        }
    },
    options: function() {
        var sector = Template.instance().state.get('sector');
        var type = this.valuationType;
        var element = this.valuationElement;
        switch(type) {
            case "comps":
                switch (element) {
                    case "security":
                        return FeedCompanies.find({sector: sector});
                        break;
                    case "index":
                        return FeedCompaniesIndices.find({});
                        break;
                }
                break;
            case "deals":
                switch (element) {
                    case "security":
                        return FeedDeals.find({sector: sector});
                        break;
                    case "index":
                        return FeedDealsIndices.find({});
                        break;
                }
                break;
        }
    },
    option: function() {
        var type = Template.parentData(1).valuationType;
        var element = Template.parentData(1).valuationElement;
        switch(type) {
            case "comps":
                switch (element) {
                    case "security":
                        return {
                            first: this.companyName,
                            second: this.ticker,
                            paren: {
                                open: "(",
                                close: ")"
                            }
                        };
                        break;
                    case "index":
                        return {
                            first: this.indexName,
                            second: "",
                            paren: {
                                open: "",
                                close: ""
                            }
                        };
                        break;
                }
                break;
            case "deals":
                switch (element) {
                    case "security":
                        return {
                            first: this.companyName,
                            second: this.dealTerms.acquirerName,
                            paren: {
                                open: "(",
                                close: ")"
                            }
                        };
                        break;
                    case "index":
                        return {
                            first: this.indexName,
                            second: "",
                            paren: {
                                open: "",
                                close: ""
                            }
                        };
                        break;
                }
                break;
        }
    },
    selection: function() {
        var type = this.valuationType;
        var element = this.valuationElement;
        var selection = Template.instance().state.get('selection');
        if(selection == null) {
            return ""
        } else {
            switch(type) {
                case "comps":
                    switch(element) {
                        case "security":
                            return FeedCompanies.findOne({_id:selection}).ticker;
                            break;
                        case "index":
                            return "index"
                    }
                    break;
                case "deals":
                    switch(element) {
                        case "security":
                            return "deal";
                            break;
                        case "index":
                            return "index"
                    }
                    break;
            }
        }
    },
    highlight: function() {
        var id = this._id;
        var selection = Template.instance().state.get('selection');
        if(id == selection) {
            return "select-highlight"
        }
    }
});

Template.ValuationBuildSelect.onCreated (function () {
    this.state = new ReactiveDict;
    this.state.set('sector', null);
    this.state.set('selection', null);
});