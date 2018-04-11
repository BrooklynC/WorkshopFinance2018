Template.registerHelper('disableOwner',function() {
    var currentUserId = Meteor.userId();
    var ownerIdOne = this.ownerId;
    if(ownerIdOne) {
        if(currentUserId !== ownerIdOne) {
            return "disabled";
        }
    } else {
        var footballActive = Options.findOne({ownerId:currentUserId}).footballActive;
        var ownerIdTwo = Footballs.findOne({_id:footballActive}).ownerId;
        if(ownerIdTwo) {
            if(currentUserId !== ownerIdTwo) {
                return "disabled";
            }
        } else {
            var ownerIdThree = Template.parentData(1).ownerId;
            if(ownerIdThree) {
                if(currentUserId !== ownerIdThree) {
                    return "disabled";
                }
            }
        }
    }
});

Template.registerHelper('disableEmpty',function() {
    var selections = localSelections.find().fetch();
    var selectionsCount = selections.length;
    if(selectionsCount == 0) {
        return "disabled";
    }
});

Template.registerHelper('disableValuationAdd', function() {
    var currentUserId = Meteor.userId();
    var currentFootballId = Options.findOne({ownerId: currentUserId}).footballActive;
    var footballValuations = Footballs.findOne({_id: currentFootballId}).footballValuations;
    var valuationEmpty = Valuations.findOne(
        {
            $and: [
                {_id: {$in: footballValuations}},
                {valuationSelections: {$size: 0}}
            ]
        }
    );
    if (valuationEmpty) {
        return "disabled"
    }
});

//Disables ability to add current or trading values if company is not public
Template.registerHelper('disableMarket',function() {
    var footballType = Template.parentData(1).footballType;
    if(footballType == "market") {
        return "disabled";
    }
});

Template.registerHelper('disableMarketGallery',function() {
    var footballType = this.footballType;
    if(footballType == "market") {
        return "disabled";
    }
});

//Disables ability to change Valuation Type or Element if selections have already been made
Template.registerHelper('disableBuild',function() {
    var selections = this.valuationSelections;
    var count = selections.length;
    if(count > 0) {
        return "disabled";
    }
});

Template.registerHelper('disableNoSelections',function() {
    var selections = this.valuationSelections;
    var selectionsCount = selections.length;
    if(selectionsCount == 0) {
        return "disabled";
    }
});

Template.registerHelper('disableInactive',function() {
    var currentUserId = Meteor.userId();
    var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;
    var football = Footballs.findOne({_id:currentFootballId});
    if(football) {
        var currentFootballLive = football.footballLive;
        if(currentFootballLive == false) {
            return "disabled";
        }
    }
});

Template.registerHelper('disableNoSector',function() {
    var element = this.valuationElement;
    if(element == "security") {
        var sector = Template.instance().state.get('sector');
        if (sector == null) {
            return "disabled";
        }
    }
});

Template.registerHelper('disableNoTarget',function() {
    var target = Template.instance().state.get('target');
    if (target == null) {
        return "disabled";
    }
});

Template.registerHelper('disableValuations',function() {
    var currentFootballId = this._id;
    var currentFootball = Footballs.findOne({_id:currentFootballId});
    var valuations = currentFootball.footballValuations;
    var valuationsCount = valuations.length;

    if(valuationsCount > 0) {
        return "disabled";
    }
});

Template.registerHelper('disableNoSelection',function() {
    var selection = Template.instance().state.get('selection');
    if(selection == null) {
        return "disabled"
    }
});

Template.registerHelper('disablePropAdd',function() {
    var stat = Template.instance().state.get('stat');
    if(stat == null) {
        return "disabled"
    }
});