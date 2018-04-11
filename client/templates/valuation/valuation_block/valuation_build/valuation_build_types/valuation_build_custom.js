Session.set('sessionBuildStat', 'Value');

Template.ValuationBuildCustom.events({
    'click .menu-build-stat': function(e) {
        e.preventDefault();

        var stat = $(e.target).text();

        Template.instance().state.set('stat', stat);
        Session.set('sessionBuildStat', stat);
    },
    'submit form': function(e) {
        e.preventDefault();

        var currentFootballId = Template.parentData(1)._id;
        var currentValuationId = this._id;
        var fieldName = $(e.target).find('[id=customNameAdd]');
        var fieldStat = Template.instance().state.get('stat');
        var fieldValue = $(e.target).find('[id=customValueAdd]');

        var selectionName = fieldName.val();
        var menuStat = fieldStat;
        var selectionValue = fieldValue.val();

        if(selectionName == "" || selectionValue == "") {
            alert("You must include a name, stat and value.")
        } else {
            fieldName.val('');
            fieldValue.val('');

            var ownerId = this.ownerId;
            var currentUserId = Meteor.userId();

            var valuationSelections = this.valuationSelections;
            var count = valuationSelections.length;
            var existingCustom = this.existingCustom;

            getStat = function() {
                if(count > 0) {
                    return existingCustom;
                } else {
                    return menuStat
                }
            };
            var selectionStat = getStat();

            if(currentUserId == ownerId) {
                return Meteor.call('valuationBuildCustomAdd', currentFootballId, currentValuationId, selectionName, selectionStat, selectionValue, function(error, result) {
                });
            }
        }
    }
});

Template.ValuationBuildCustom.helpers({
    buildStat: function() {
        return Session.get('sessionBuildStat');
    },
    isCount: function() {
        var selections = this.valuationSelections;
        var count = selections.length;
        if(count > 0) {
            return true;
        }
    },
    customStat: function() {
        return ["Value", "Price", "Multiple"];
    },
    highlight: function() {
        var id = this;
        var selection = Template.instance().state.get('stat');
        if(id == selection) {
            return "select-highlight"
        }
    }
});

Template.ValuationBuildCustom.onCreated (function () {
    this.state = new ReactiveDict;
    this.state.set('stat', null);
});