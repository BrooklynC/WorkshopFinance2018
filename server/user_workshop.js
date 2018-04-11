if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
        username: "workshop",
        password: "colorado",
        profile: {
            active: "A"
        }
    })
}