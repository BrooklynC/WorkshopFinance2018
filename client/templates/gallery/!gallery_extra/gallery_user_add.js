Template.GalleryUserAdd.events({
    'submit form': function(e) {
        e.preventDefault();

        var fieldUsername = $(e.target).find('[id=usernameAdd]');
        var fieldPassword = $(e.target).find('[id=passwordAdd]');

        var valueUsername = fieldUsername.val();
        var valuePassword = fieldPassword.val();

        fieldUsername.val('');
        fieldPassword.val('');

        Meteor.call('userAdd', valueUsername, valuePassword, function(error, result) {
        });
    }
});