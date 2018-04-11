Session.set('sessionValuations',"array");

//Loop over valuations, whose id is in footballValuations field of football document
Template.FootballFieldValuations.helpers({
    valuations: function() {
        var footballId = this._id;
        var footballValuations = Footballs.findOne({_id:footballId}).footballValuations;
        if (footballValuations) {
            var footballSort = this.footballSort;
            switch(footballSort) {
                case "Date (oldest first)":
                    return Valuations.find({_id: {$in: footballValuations}}, {sort: {timeCreated: 1}});
                    break;
                case "Date (newest first)":
                    return Valuations.find({_id: {$in: footballValuations}}, {sort: {timeCreated: -1}});
                    break;
                case "Value (ascending)":
                    return Valuations.find({_id: {$in: footballValuations}}, {sort: {timeCreated: 1}});
                    break;
                case "Value (descending)":
                    return Valuations.find({_id: {$in: footballValuations}}, {sort: {timeCreated: 1}});
                    break;
                case "Manual":
                    return Valuations.find({_id: {$in: footballValuations}});
                    break;

            }
        }
    },
    isArray: function() {
        var sessionValuations = Session.get('sessionValuations');
        if(sessionValuations == "array") {
            return true;
        }
    },
    activeValuation: function() {
        var sessionValuations = Session.get('sessionValuations');
        if(sessionValuations !== "array") {
            return Valuations.findOne({_id:sessionValuations});
        }
    },
    valuationsDrag: function() {
        var sort = this.footballSort;
        if (sort == "Manual") {
            return {
                old: "football-valuations-inner",
                new: "football-valuations-inner-new"
            }
        }
    }
});

//Drag and drop provided by dragula package.
Template.FootballFieldValuations.onRendered(function(){
    dragula([document.querySelector('#football-valuations-inner'), document.querySelector('#football-valuations-inner-new')], {
        //moves: function (el, container, handle) {
        //    return handle.classList.contains('valuation-bar-frame');
        //}
    });
});
