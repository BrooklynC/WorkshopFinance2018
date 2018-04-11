Template.ValuationBlock.events({
    'click .btn-block-build': function(e) {
        e.preventDefault();

        Template.instance().state.set('block', "build");
    },
    'click .btn-block-results': function(e) {
        e.preventDefault();

        Template.instance().state.set('block', "results");
    },
    'click .menu-result-build': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var selection = $(e.target).text();
        var footballId = Template.parentData(1)._id;

        Meteor.call('valuationBuildSelect', currentValuationId, selection, footballId, function(error, result) {});
    }
});

Template.ValuationBlock.helpers({
    isResults: function() {
        var state = Template.instance().state.get('block');
        if(state == "results") {
            return true;
        }
    },
    isBuild: function() {
        var state = Template.instance().state.get('block');
        if(state == "build") {
            return true;
        }
    },
    mobileBuild: function() {
        var state = Template.instance().state.get('block');
        if(state == "build") {
            return "text-bold"
        }
    },
    mobileResult: function() {
        var state = Template.instance().state.get('block');
        if(state == "results") {
            return "text-bold"
        }
    }
});

Template.ValuationBlock.onCreated (function () {
    this.state = new ReactiveDict;
    this.state.set('block', "build");
});