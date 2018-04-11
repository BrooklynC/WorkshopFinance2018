Template.FootballField.helpers({
    fieldScroll: function() {
        var sessionValuations = Session.get('sessionValuations');
        if(sessionValuations == "array") {
            return "football-field-valuations-scroll"
        }
    }
});

Template.FootballField.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('footballValuations');
        self.subscribe('footballValuationsShared');
        self.subscribe('feedCompaniesAll');
        self.subscribe('feedCompaniesIndicesAll');
        self.subscribe('feedDealsAll');
        self.subscribe('feedDealsIndicesAll');
        self.subscribe('modelsUser');
        self.subscribe('modelsShared');
        self.subscribe('customsUser');
        self.subscribe('customsShared');
    });
});