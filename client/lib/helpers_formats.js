////GENERAL FORMATS

//Format with one decimal
Template.registerHelper('fixedOne', function(a) {
    return a.toFixed(1);
});

//Format with two decimals
Template.registerHelper('fixedTwo', function(a) {
    return a.toFixed(2);
});

//Format with $ and one decimal for financial statement figures
Template.registerHelper('financialFormat', function(a) {
    return numeral(a).format('$0,0.0');
});

//Format with $ and two decimals for stock price
Template.registerHelper('priceFormat', function(a) {
    return numeral(a).format('$0,0.00');
});

//Format with one decimal and no currency sign for # of shares
Template.registerHelper('sharesFormat', function(a) {
    return numeral(a).format('0,0.0');
});

//Format with one decimal and no currency sign for multiples
Template.registerHelper('multipleFormat', function(a) {
    if(a) {
        return numeral(a).format('0,0.0');
    }
});

//Format to capitalize first letter
Template.registerHelper('capitalizeOne', function(a) {
    return a.charAt(0).toUpperCase() + a.slice(1);
});

//Formal date format
Template.registerHelper('dateFormal', function(a) {
    return moment(a).format('MMMM Do, YYYY');
});

//Abbreviated date format
Template.registerHelper('dateAbbrev', function(a) {
    return moment(a).format('MM-DD-YY');
});

//Abbreviated date format for Comps valuation
Template.registerHelper('dateAbbrevComp', function(a) {
    var valuationType = this.valuationType;
    if(valuationType == "comps") {
        return moment(a).format('MM/DD/YY');
    }
});

////VALUATION TABLE FORMATS

//Format for multiple shown for selection in Valuation Table
Template.registerHelper('divideSelect', function(a, b) {
    var valuationMetric = Template.parentData(1).valuationMetric;
    switch(valuationMetric) {
        case "EV/Revenue":
            var result1 = a / b;
            if(result1 >= 0 || result1 <= 0) {
                var r1 = result1.toFixed(1);
                return numeral(r1).format('0,0.0');
            }
            break;
        case "EV/EBITDA":
            var result2 = a / b;
            if(result2 >= 0 || result2 <= 0) {
                var r2 = result2.toFixed(1);
                return numeral(r2).format('0,0.0');
            }
            break;
        case "P/E":
            var result4 = a / b;
            if(result4 >= 0 || result4 <= 0) {
                var r4 = result4.toFixed(1);
                return numeral(r4).format('0,0.0');
            }
            break;
    }
});

//Format for valuation table - Models
Template.registerHelper('modelValueFormat', function(a) {
    if(a) {
        var footballOutput = Template.parentData(1).footballOutput;
        if(footballOutput == "Price per Share") {
            return numeral(a).format('0,0.00');
        } else {
            return numeral(a).format('0,0.0');
        }
    }
});

//Format for valuation table - Custom
Template.registerHelper('customValueFormat', function(a) {
    if(a) {
        var customStat = this.existingCustom;
        if(customStat == "Price") {
            return numeral(a).format('0,0.00');
        } else {
            return numeral(a).format('0,0.0');
        }
    }
});

//Format for values in Football range, depends on footballType
Template.registerHelper('rangeNumber', function(a) {
    var footballId = this._id;
    var footballOutput = this.footballOutput;
    var max = getRangeCaps(footballId).max;
    if(max > 0) {
        switch (footballOutput) {
            case "Enterprise Value":
                return numeral(a).format('$0,0');
                break;
            case "Price per Share":
                return numeral(a).format('$0,0');
                break;
            case "Multiple":
                return numeral(a).format('0,0.0');
                break;
        }
    }
});

//Format for multiples in Football range
Template.registerHelper('rangeMultiple', function() {
    var footballId = this._id;
    var footballOutput = this.footballOutput;
    var max = getRangeCaps(footballId).max;
    if(max > 0) {
        switch (footballOutput) {
            case "Enterprise Value":
                return "";
                break;
            case "Price per Share":
                return "";
                break;
            case "Multiple":
                return "x";
                break;
        }
    }
});

getBarFormat = function(footballId) {
    var footballOutput = Footballs.findOne({_id:footballId}).footballOutput;
    switch (footballOutput) {
        case "Enterprise Value":
            return {
                number: d3.format(",.1f"),
                currency: "$",
                multiple: ""
            };
            break;
        case "Price per Share":
            return {
                number: d3.format(",.2f"),
                currency: "$",
                multiple: ""
            };
            break;
        case "Multiple":
            return {
                number: d3.format(",.1f"),
                currency: "",
                multiple: "x"
            };
            break;
    }
};

//Format for currency symbols in d3 data labels
Template.registerHelper('barFormat', function(footballId) {
    return getBarFormat(footballId);
});

//Format for value in Results based on footballOutput
Template.registerHelper('resultNumber', function(a) {
    var footballOutput = Template.parentData(1).footballOutput;
    var valuationSelections = this.valuationSelections;
    var valuationType = this.valuationType;

    if(valuationSelections.length > 0) {
        if(valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
            switch (footballOutput) {
                case "Enterprise Value":
                    return numeral(a).format('$0,0.0');
                    break;
                case "Price per Share":
                    return numeral(a).format('$0,0.00');
                    break;
                case "Multiple":
                    return numeral(a).format('0,0.0');
                    break;
            }
        } else {
            var existingCustom = this.existingCustom;
            switch(existingCustom) {
                case "Value":
                    return numeral(a).format('$0,0.0');
                    break;
                case "Price":
                    return numeral(a).format('$0,0.00');
                    break;
                case "Multiple":
                    return numeral(a).format('0,0.0');
                    break;
            }
        }
    }
});

//Format for multiples in Valuation Results (likely refactor this into a previous helper)
Template.registerHelper('resultMultiple', function() {
    var footballOutput = Template.parentData(1).footballOutput;
    var valuationSelections = this.valuationSelections;
    var valuationType = this.valuationType;
    if(valuationSelections.length > 0) {
        if(valuationType == "comps" || valuationType == "deals" || valuationType == "models") {
            switch (footballOutput) {
                case "Enterprise Value":
                    return "";
                    break;
                case "Price per Share":
                    return "";
                    break;
                case "Multiple":
                    return "x";
                    break;
            }
        } else {
            var existingCustom = this.existingCustom;
            switch(existingCustom) {
                case "Value":
                    return "";
                    break;
                case "Price":
                    return "";
                    break;
                case "Multiple":
                    return "x";
                    break;
            }
        }
    }
});

//Toggle calc between average, median, high and low
Template.registerHelper('calc',function(){
    var valuationCalc = this.valuationCalc;
    switch(valuationCalc) {
        case "average":
            return "Average";
            break;
        case "median":
            return "Median";
            break;
        case "high":
            return "High";
            break;
        case "low":
            return "Low";
            break;
    }
});

////THEMES
//Formats for light and dark theme
Template.registerHelper('themeStyle', function() {
    var currentUserId = Meteor.userId();
    if(currentUserId) {
        var theme = Options.findOne({ownerId:currentUserId}).theme;
        switch(theme) {
            case "light":
                return {
                    main: "main-light",

                    borderTop: "border-top-light",
                    borderBottom: "border-bottom-light",
                    borderLeft: "border-left-light",
                    borderRight: "border-right-light",
                    border: "border-light",
                    borderShaded: "border-shaded-light",
                    borderShadedBottom: "border-shaded-bottom-light",
                    borderCalendar: "border-calendar-light",

                    btnDefault: "btn-default-light",
                    formDropdown: "form-dropdown-light",
                    formInput: "form-input-light",
                    formDate: "form-date-light",

                    calendar: "calendar-light",

                    barText: "rgba(0, 0, 0, 1)"
                };
                break;
            case "dark":
                return {
                    main: "main-dark",

                    borderTop: "border-top-dark",
                    borderBottom: "border-bottom-dark",
                    borderLeft: "border-left-dark",
                    borderRight: "border-right-dark",
                    border: "border-dark",
                    borderShaded: "border-shaded-dark",
                    borderShadedBottom: "border-shaded-bottom-dark",
                    borderCalendar: "border-calendar-dark",

                    btnDefault: "btn-default-dark",
                    formDropdown: "form-dropdown-dark",
                    formInput: "form-input-dark",
                    formDate: "form-date-dark",

                    calendar: "calendar-dark",

                    barText: "rgba(170, 170, 170, 1)"
                };
                break;
        }
    }
});