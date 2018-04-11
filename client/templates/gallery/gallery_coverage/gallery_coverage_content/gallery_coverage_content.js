Template.CoverageContent.helpers({
    coverage: function() {
        var currentUserId = Meteor.userId();
        var sessionCoverage = Session.get('sessionCoverageType');
        var sessionCoverageScreen = Session.get('sessionCoverageScreenType');
        switch (sessionCoverage) {
            case "Footballs":
                return Footballs.find(
                    {marketType: sessionCoverageScreen,
                    $and: [
                        {
                            $or: [
                                {
                                    ownerId: currentUserId
                                },
                                {
                                    viewers:{$in:[currentUserId]}
                                }

                            ]
                        }
                    ]
                    }, {
                        sort: {timeCreated: 1}
                    }
                );
                break;
            case "Targets":
                var targets = Options.findOne({ownerId: currentUserId}).targets;
                var companies = [];
                targets.forEach(function (t) {
                    var type = t.targetType;
                    switch(type) {
                        case "company":
                            companies.push(t);
                            break;
                        case "marketTypeB":
                            //
                    }
                });
                switch(sessionCoverageScreen) {
                    case "company":
                        return companies;
                        break;
                    case "marketTypeB":
                        //
                        break;
                }
        }
    }
});

Template.CoverageContent.onCreated (function () {
    var self = this;
    self.autorun(function() {
        self.subscribe('galleryFootballsUser');
        self.subscribe('galleryFootballsShared');
    });
});
