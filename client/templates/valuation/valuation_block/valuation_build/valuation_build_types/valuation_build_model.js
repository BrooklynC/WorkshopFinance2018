Template.ValuationBuildModel.events({
    'click .menu-build-stat': function(e) {
        e.preventDefault();

        var stat = $(e.target).text();

        Template.instance().state.set('stat', stat);
    },
    'submit form': function(e) {
        e.preventDefault();

        var currentFootballId = Template.parentData(1)._id;
        var currentValuationId = this._id;
        var fieldName = $(e.target).find('[id=modelNameAdd]');
        var fieldStat = Template.instance().state.get('stat');
        var fieldValue = $(e.target).find('[id=modelValueAdd]');

        var selectionName = fieldName.val();
        var selectionStat = fieldStat;
        var selectionValue = fieldValue.val();

        Template.instance().state.set('stat', null);

        if(selectionName == "" || selectionStat == "" || selectionValue == "") {
            alert("You must include a name, stat and value.")
        } else {
            fieldName.val('');
            Template.instance().state.set('stat', null);
            fieldValue.val('');

            var ownerId = this.ownerId;
            var currentUserId = Meteor.userId();

            if(currentUserId == ownerId) {
                return Meteor.call('valuationBuildModelAdd', currentFootballId, currentValuationId, selectionName, selectionStat, selectionValue, function(error, result) {
                });
            }
        }
    }
});

Template.ValuationBuildModel.helpers({
    statTitle: function() {
        var stat = Template.instance().state.get('stat');
        if(stat == null) {
            return "Stat:"
        } else {
            return stat
        }
    },
    modelStatValues: function() {
        return ["Enterprise Value","Price per Share"];
    },
    modelStatMultiples: function() {
        return ["EV/Revenue (LTM)","EV/Revenue (FY1)","EV/Revenue (FY2)","EV/EBITDA (LTM)","EV/EBITDA (FY1)","EV/EBITDA (FY2)", "P/E (LTM)", "P/E (FY1)", "P/E (FY2)"];
    },
    highlight: function() {
        var id = this;
        var selection = Template.instance().state.get('stat');
        if(id == selection) {
            return "select-highlight"
        }
    }
});

Template.ValuationBuildModel.onCreated (function () {
    this.state = new ReactiveDict;
    this.state.set('stat', null);
});