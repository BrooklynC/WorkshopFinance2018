Template.FootballFieldArea.helpers({
    //Toggled template for showing Current Value d3
    footballCurrent: function() {
        var footballType = this.footballType;
        if(footballType == "target") {
            var includeCurrent = this.includeCurrent;
            if(includeCurrent == true) {
                return Template.FootballFieldCurrent;
            } else {
                return Template.Blank;
            }
        } else {
            return Template.Blank;
        }
    },
    //Toggled template for showing Trading Value d3
    footballTrading: function() {
        var footballType = this.footballType;
        if(footballType == "target") {
            var includeTrading = this.includeTrading;
            if (includeTrading == true) {
                return Template.FootballFieldTrading;
            } else {
                return Template.Blank;
            }
        } else {
            return Template.Blank;
        }
    }
});