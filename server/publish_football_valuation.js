//////VALUATION
//Meteor.publish('valuation', function(valuationId) {
//    check(valuationId, String);
//    console.log("FootballValuation: ", valuationId);
//    return Valuations.find({_id:valuationId});
//});
//
//Meteor.publish('valuationCompsAdded', function(valuationId) {
//    check(valuationId, String);
//    var valuationSelections = Valuations.findOne({_id:valuationId}).valuationSelections;
//    return FeedCompanies.find({_id: {$in: valuationSelections}});
//});
//
//Meteor.publish('valuationDealsAdded', function(valuationId) {
//    check(valuationId, String);
//    var valuationSelections = Valuations.findOne({_id:valuationId}).valuationSelections;
//    return FeedDeals.find({_id: {$in: valuationSelections}});
//});
//
//Meteor.publish('valuationCompsIndicesAdded', function(valuationId) {
//    check(valuationId, String);
//    var valuationSelections = Valuations.findOne({_id:valuationId}).valuationSelections;
//    return FeedCompaniesIndices.find({_id: {$in: valuationSelections}});
//});
//
//Meteor.publish('valuationDealsIndicesAdded', function(valuationId) {
//    check(valuationId, String);
//    var valuationSelections = Valuations.findOne({_id:valuationId}).valuationSelections;
//    return FeedDealsIndices.find({_id: {$in: valuationSelections}});
//});
//
// Meteor.publish('pillFeedComps', function() {
//    return FeedCompanies.find({}, {companyName:1,ticker:1,sector:1});
//});
//
//Meteor.publish('pillFeedCompsIndices', function() {
//    return FeedCompaniesIndices.find({}, {indexName: 1});
//});
//
//Meteor.publish('pillFeedDeals', function() {
//    return FeedDeals.find({}, {indexName:1, dealTerms:{dealType:1,acquirerName:1}});
//});
//
//Meteor.publish('pillFeedDealsIndices', function() {
//    return FeedDeals.find({}, {indexName:1, dealTerms:{dealType:1,acquirerName:1}});
//});