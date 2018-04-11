Template.FootballBannerDetails.helpers({
    //Data for target name and ticker differs depending on public or private status
    pre: function () {
        var footballType = Template.parentData(0).footballType;
        if(footballType == "target") {
            var target = {
                targetId: this.footballTarget.targetId,
                targetType: this.footballTarget.targetType,
                targetData: this.footballTarget.targetData
            };
            switch(target.targetType) {
                case "company":
                    return '';
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        }
    },
    targetDetail: function () {
        var footballType = Template.parentData(0).footballType;
        if(footballType == "target") {
            var target = {
                targetId: this.footballTarget.targetId,
                targetType: this.footballTarget.targetType,
                targetData: this.footballTarget.targetData
            };
            switch(target.targetType) {
                case "company":
                    switch (target.targetData) {
                        case "feed":
                            var feedCompany = FeedCompanies.findOne({_id: target.targetId});
                            return {
                                targetName: feedCompany.companyName,
                                targetIden: feedCompany.ticker
                            };
                            break;
                        case "custom":
                            var customCompany = TargetsCompanies.findOne({_id: targetId});
                            return {
                                targetName: customCompany.companyName,
                                targetIden: customCompany.ticker
                            };
                            break;
                    }
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        } else {
            return {
                targetName: "Market Comparison",
                targetIden: ''
            };
        }
    },
    paren: function() {
        var footballType = Template.parentData(0).footballType;
        if(footballType == "target") {
            return {
                open: "(",
                close: ")"
            }
        }
    },
    showName: function() {
        return Template.instance().showName.get();
    }
});


Template.FootballBannerDetails.onCreated (function () {
    this.showName = new ReactiveVar(true);
});