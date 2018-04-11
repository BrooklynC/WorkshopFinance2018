//Formats differ depending on football output
//Calls getRangeCaps() to ensure range is wider than lowest and highest valuations
Template.FootballRange.helpers({
    range: function() {
        var footballId = this._id;
        var rangeLow = getRangeCaps(footballId).min;
        var rangeHigh = getRangeCaps(footballId).max;
        var range = rangeHigh - rangeLow;
        var scaleAdjust = getRangeScale(footballId);
        return {
            low: rangeLow / scaleAdjust,
            interim1: (rangeLow + (range / 4)) /  scaleAdjust,
            interim2: (rangeLow + (range / 4 * 2)) /  scaleAdjust,
            interim3: (rangeLow + (range / 4 * 3)) /  scaleAdjust,
            interim4: (rangeLow + (range / 4 * 4)) /  scaleAdjust
            //interim5: (rangeLow + (range / 5 * 5)) /  scaleAdjust
        }
    }
});