Template.ValuationDateMobile.helpers({
    dateId: function() {
        return this._id;
    }
});

Template.ValuationDateMobile.onRendered (function () {
    var dateId = Template.parentData(0)._id;

    $("#date-mobile" + dateId).datepicker({
        //todayBtn: "linked",
        orientation: "left auto",
        daysOfWeekDisabled: "0,6",
        todayHighlight: true,
        autoclose: true,
        format: 'yyyy-mm-dd',
        defaultViewDate: { year: 2015, month: 12, day: 31 },
        startDate: '2015-12-01',
        endDate: '2015-12-31'
    });
    var self = this;
    $("#date-mobile" + dateId).datepicker().on('changeDate', function () {
        var currentValuationId = self.data._id;
        var valuationDate = $("#selectedDate-mobile" + dateId).val();

        Meteor.call('valuationDateUpdate', currentValuationId, valuationDate, function (error, result) {
        });
    });
});