Template.ValuationNotes.events({
    'click .valuation-note-value': function(e) {
        e.preventDefault();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();
        var noteState = Template.instance().showNote.get();

        if(currentUserId == ownerId) {
            if(noteState == true) {
                Template.instance().showNote.set(false);
            }
        }
    },
    'submit .valuation-note-form': function(e) {
        e.preventDefault();

        var currentValuationId = this._id;
        var valuationNote = $(e.target).find('[name=valuation-note-edit]').val();

        var ownerId = this.ownerId;
        var currentUserId = Meteor.userId();

        if(currentUserId == ownerId) {
            Meteor.call('valuationNoteUpdate', currentValuationId, valuationNote, function(error, result) {
            });
            Template.instance().showNote.set(true)
        }
    }
});

Template.ValuationNotes.helpers({
    showNote: function() {
        return Template.instance().showNote.get();
    },
    valuationId: function() {
        return this._id;
    }
});

Template.ValuationNotes.onCreated (function () {
    this.showNote = new ReactiveVar(true);
});