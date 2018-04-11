Meteor.methods({
    //Change theme between dark and light colors
    userAdd: function(valueUsername, valuePassword) {
        check(valueUsername, String);
        check(valuePassword, String);

        Accounts.createUser({username: valueUsername,password: valuePassword});
    },
    optionsThemeToggle: function() {

        var currentUserId = Meteor.userId();
        var theme = Options.findOne({ownerId:currentUserId}).theme;

        switch(theme) {
            case "light":
                Options.update({ownerId:currentUserId}, {$set: {theme:"dark"}});
                break;
            case "dark":
                Options.update({ownerId:currentUserId}, {$set: {theme:"light"}});
                break;
        }
    },
    //Admin tool to toggle user membership between Basic and Premium
    userActiveChange: function(userId) {
        check(userId, String);

        var active = Meteor.users.findOne({_id:userId}).profile.active;

        var getNewActive = function(tier) {
            switch(tier) {
                case "A":
                    return "B";
                    break;
                case "B":
                    return "A";
                    break;
            }
        };
        var newActive = getNewActive(active);

        Meteor.users.update({_id:userId},{$set:{profile:{active:newActive}}});
    },
    //Admin tool to toggle user membership between Basic and Premium
    userTierChange: function(userId) {
        check(userId, String);

        var tier = Meteor.users.findOne({_id:userId}).profile.tier;

        var getNewTier = function(tier) {
            switch(tier) {
                case "A":
                    return "B";
                    break;
                case "B":
                    return "A";
                    break;
            }
        };
        var newTier = getNewTier(tier);

        Meteor.users.update({_id:userId},{$set:{profile:{tier:newTier}}});
    },
    //Adds a new public company to target list
    targetAdd: function(selection, marketType) {
        check(marketType, String);
        check(selection, String);

        var currentUserId = Meteor.userId();

        //Determine target details to use, depending on Market Type of Football Field
        var getMarket = function(marketType) {
            switch(marketType) {
                case "company":
                    return {
                        targetId: FeedCompanies.findOne({ticker:selection})._id,
                        targetType: "company",
                        targetData: "feed"
                    };
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        };
        var target = getMarket(marketType);

        //Add target to array in Options
        Options.update({ownerId:currentUserId},{$addToSet: {targets:target}});
    },
    //Add new Football Field
    footballAdd: function(marketType, target, valuations, footballType, currentFootballId) {
        check(marketType, String);
        check(target, Object);
        check(valuations, Array);
        check(footballType, String);
        check(currentFootballId, String);

        var currentUserId = Meteor.userId();

        var targetId = target.targetId;
        if (targetId !== "none") {
            Options.update({ownerId: currentUserId}, {$addToSet: {targets: target}});
        }

        var footballNewId = Footballs.insert({
            ownerId: currentUserId,
            footballType: footballType,
            marketType: marketType,
            footballTarget: target,
            footballValuations: valuations,
            timeCreated: new Date()
        });
        Options.update({ownerId: currentUserId}, {$set: {footballActive: footballNewId}});

        var currentFootball = Footballs.findOne({_id:currentFootballId});
        if(currentFootball) {
            var currentLive = Footballs.findOne({_id:currentFootballId}).footballLive;
            if(currentLive == false) {
                Footballs.remove({_id:currentFootballId});
            }
        }
    },
    //Opens Football from Coverage item
    footballOpen: function(currentFootballId, newFootballId) {
        check(currentFootballId, String);
        check(newFootballId, String);

        var currentUserId = Meteor.userId();

        Options.update({ownerId:currentUserId}, {$set: {footballActive:newFootballId}});

        var currentLive = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(currentLive == false) {
            Footballs.remove({_id:currentFootballId});
        }

        var notification = Notifications.findOne({receiverId:currentUserId,itemId:newFootballId});
        if(notification) {
            Notifications.update(notification,{$set:{read:true}});
        }

        return {
            _id: newFootballId
        };
    },
    //Adds selected valuations to existing active football
    footballValuationsExpand: function(marketType, selections) {
        check(marketType, String);
        check(selections, Array);

        var currentUserId = Meteor.userId();
        var options = Options.findOne({ownerId:currentUserId});
        var currentFootballId = options.footballActive;
        var currentMarketType = Footballs.findOne({_id:currentFootballId}).marketType;

        if(marketType === currentMarketType) {
            var getValuationDefaults = function(marketType) {
                switch(marketType) {
                    case "company":
                        return {
                            metric: "EV/EBITDA",
                            output: "EV/EBITDA",
                            period: "LTM",
                            outputPeriod: "LTM"
                        };
                        break;
                    case "marketTypeB":
                        //
                        break;
                }
            };

            var selectionsFinal = [];

            selections.forEach(function (v) {
                var valuation = Valuations.findOne({_id:v},{fields:{_id:0,valuationFavorite:0, timeCreated: 0}});
                var valuationExtended = _.extend(valuation, {
                    ownerId: currentUserId,
                    marketType: marketType,
                    valuationMetric: getValuationDefaults(marketType).metric,
                    valuationPeriod: getValuationDefaults(marketType).period,
                    valuationOutput: getValuationDefaults(marketType).output,
                    valuationOutputPeriod: getValuationDefaults(marketType).outputPeriod,
                    timeCreated: new Date()
                });
                var newValuationId = Valuations.insert(valuationExtended);
                Meteor.call('valuationAggregate', newValuationId, function (error, result) {
                });
                selectionsFinal.push(newValuationId);
            });

            if (Meteor.isClient) {
                Session.set('sessionValuations', "array");
            }

            Footballs.update({_id:currentFootballId},{$addToSet:{footballValuations:{$each:selectionsFinal},footballValuationsAll:{$each:selectionsFinal}}});
            var live = Footballs.findOne({_id:currentFootballId}).footballLive;
            if(live == false) {
                Footballs.update({_id:currentFootballId},{$set:{footballLive:true}});
            }
        } else {
            alert("You can't add this type of valuation to this football.")
        }
    },
    //Creates a new Football with selected valuations
    footballValuationsNew: function(marketType, selections) {
        check(marketType, String);
        check(selections, Array);

        var currentUserId = Meteor.userId();

        var newFootball = {
            ownerId: currentUserId,
            marketType: marketType,
            timeCreated: new Date()
        };

        var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;
        var currentLive = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(currentLive == false) {
            Footballs.remove({_id:currentFootballId});
        }

        var newFootballId = Footballs.insert(newFootball);

        var getValuationDefaults = function(marketType) {
            switch(marketType) {
                case "company":
                    return {
                        metric: "EV/EBITDA",
                        output: "EV/EBITDA",
                        period: "LTM",
                        outputPeriod: "LTM"
                    };
                    break;
                case "marketTypeB":
                    //
                    break;
            }
        };

        var selectionsFinal = [];

        selections.forEach(function (v) {
            var valuation = Valuations.findOne({_id:v},{fields:{_id:0,valuationFavorite:0}});
            var valuationExtended = _.extend(valuation, {
                ownerId: currentUserId,
                marketType: marketType,
                valuationMetric: getValuationDefaults(marketType).metric,
                valuationPeriod: getValuationDefaults(marketType).period,
                valuationOutput: getValuationDefaults(marketType).output,
                valuationOutputPeriod: getValuationDefaults(marketType).outputPeriod,
                timeCreated: new Date()
            });
            var newValuationId = Valuations.insert(valuationExtended);

            Meteor.call('valuationAggregate', newValuationId, function (error, result) {
            });
            selectionsFinal.push(newValuationId);
        });
        Footballs.update({_id:newFootballId},{$set:{footballLive:true},$addToSet:{footballValuations:{$each:selectionsFinal}}});
        Footballs.update({_id:newFootballId},{$addToSet:{footballValuationsAll:{$each:selectionsFinal}}});
        Options.update({ownerId:currentUserId},{$set:{footballActive:newFootballId}});
    },
    //Saves copy of active football, with selected target
    footballSave: function(currentFootballId, targetSelection, footballType) {
        check(currentFootballId, String);
        check(footballType, String);
        check(targetSelection, String);

        console.log(targetSelection);
        var currentUserId = Meteor.userId();

        var marketType = Footballs.findOne({_id:currentFootballId}).marketType;

        var currentValuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
        var currentValuationsCount = currentValuations.length;
        if(currentValuationsCount == 0) {
            alert("You should add some valuations to the existing Football Field first.");
        } else {
            var getTarget = function(targetSelection) {
                if(targetSelection !== "none") {
                    switch(marketType) {
                        case "company":
                            var companyId = FeedCompanies.findOne({ticker:targetSelection})._id;
                            return {
                                targetId: companyId,
                                targetType: marketType,
                                targetData: "feed"
                            };
                            break;
                        case "marketTypeB":
                            //
                            break;
                    }
                } else {
                    return {
                        targetId: "none",
                        targetType: "none",
                        targetData: "none"
                    };
                }
            };

            var target = getTarget(targetSelection);

            var football = Footballs.findOne({_id:currentFootballId}, {
                fields:{
                    _id:0,
                    ownerId:0,
                    footballName:0,
                    footballType:0,
                    footballTarget:0,
                    footballValuations:0,
                    viewers:0,
                    sharedBy: 0,
                    sentBy: 0
                }
            });

            var footballExtended = _.extend(football, {
                ownerId: currentUserId,
                footballTarget: target,
                footballType: footballType,
                timeCreated: new Date()
            });

            var newFootballId = Footballs.insert(footballExtended);

            var valuations = Valuations.find({_id: {$in: currentValuations}});

            //Create copy of each valuation and add id to new Football
            valuations.forEach(function(v) {
                var currentValuationId = v._id;
                var valuation = Valuations.findOne({_id: currentValuationId}, {fields: {_id: 0, ownerId:0, viewers:0, sharedBy: 0, sentBy: 0}});
                var valuationExtended = _.extend(valuation, {
                    ownerId: currentUserId,
                    timeCreated: new Date()
                });
                var newValuationId = Valuations.insert(valuationExtended);
                Footballs.update({_id:newFootballId},{$push:{footballValuations:newValuationId}});
            });

            return {
                _id: newFootballId
            };
        }
    },
    //Sends current Football to another user, with copies of Valuations and Target
    footballSend: function(currentFootballId, selection) {
        check(currentFootballId, String);
        check(selection, String);

        var football = Footballs.findOne({_id:currentFootballId});
        var ownerId = football.ownerId;
        var newOwnerId = Meteor.users.findOne({username:selection})._id;

        var currentValuations = Footballs.findOne({_id:currentFootballId}).footballValuations;

        var footballNew = Footballs.findOne({_id:currentFootballId}, {fields:{_id:0,ownerId:0,footballValuations:0,viewers:0}});
        var footballExtended = _.extend(footballNew, {
            ownerId: newOwnerId,
            sentBy: ownerId,
            timeCreated: new Date()
        });

        var sentFootballId = Footballs.insert(footballExtended);

        if(currentValuations) {
            var valuations = Valuations.find({_id: {$in: currentValuations}});
            valuations.forEach(function (v) {
                var currentValuationId = v._id;
                var valuation = Valuations.findOne({_id: currentValuationId}, {fields: {_id: 0, viewers: 0}});
                var valuationSelections = v.valuationSelections;
                var valuationType = v.valuationType;
                var valuationExtended = _.extend(valuation, {
                    ownerId: newOwnerId,
                    sentBy: ownerId,
                    timeCreated: new Date()
                });
                var valuationNewId = Valuations.insert(valuationExtended);
                Footballs.update({_id: sentFootballId}, {$push: {footballValuations: valuationNewId}});

                valuationSelections.forEach(function (s) {
                    switch (valuationType) {
                        case "comps":
                            console.log("Do nothing");
                            break;
                        case "deals":
                            console.log("Do nothing");
                            break;
                        case "models":
                            var modelNewCut = Models.findOne({_id: s}, {
                                fields: {
                                    _id: 0,
                                    ownerId: 0
                                }
                            });
                            var modelNew = _.extend(modelNewCut, {
                                ownerId: newOwnerId
                            });
                            var modelNewId = Models.insert(modelNew);
                            Valuations.update({_id: valuationNewId}, {$addToSet: {valuationSelections: modelNewId}});
                            break;
                        case "custom":
                            var customNewCut = Customs.findOne({_id: s}, {
                                fields: {
                                    _id: 0,
                                    ownerId: 0
                                }
                            });
                            var customNew = _.extend(customNewCut, {
                                ownerId: newOwnerId
                            });
                            var customNewId = Customs.insert(customNew);
                            Valuations.update({_id: valuationNewId}, {$addToSet: {valuationSelections: customNewId}});
                            break;
                    }
                });
            });
        }

        //var target = footballNew.footballTarget;
        //
        //Options.update({ownerId: newOwnerId}, {$addToSet: {targets: target}});
        //Footballs.update({_id: sentFootballId}, {$set: {targetId: newTargetId}});

        var creator = Meteor.users.findOne({_id:ownerId}).username;
        var receiver = Meteor.users.findOne({_id:newOwnerId}).username;

        var notification = {
            creatorId: ownerId,
            creator: creator,
            receiverId: newOwnerId,
            receiver: receiver,
            action: "send",
            itemId: sentFootballId,
            item: "football"
        };

        Notifications.insert(notification);

        return {
            _id: sentFootballId
        };
    },
    //Shares Football with another user, with all valuations and target
    footballShare: function(currentFootballId, selection) {
        check(currentFootballId, String);
        check(selection, String);

        var football = Footballs.findOne({_id:currentFootballId});
        var ownerId = football.ownerId;
        var newOwnerId = Meteor.users.findOne({username:selection})._id;

        var currentTargetId = Footballs.findOne({_id:currentFootballId}).targetId;
        var currentValuations = Footballs.findOne({_id:currentFootballId}).footballValuations;

        var sharedFootballId = Footballs.update({_id:currentFootballId},{$set:{sharedBy:ownerId},$addToSet:{viewers:newOwnerId}});

        if(currentValuations) {
            var valuations = Valuations.find({_id: {$in: currentValuations}});
            valuations.forEach(function (v) {
                var currentValuationId = v._id;
                Valuations.update({_id: currentValuationId}, {$set:{sharedBy:ownerId},$addToSet:{viewers: newOwnerId}});

                var valuationType = v.valuationType;
                var valuationSelections = v.valuationSelections;
                valuationSelections.forEach(function (s) {
                    switch (valuationType) {
                        case "comps":
                            console.log("Do nothing");
                            break;
                        case "deals":
                            console.log("Do nothing");
                            break;
                        case "models":
                            Models.update({_id: s}, {$set:{sharedBy:ownerId},$addToSet:{viewers: newOwnerId}});
                            break;
                        case "custom":
                            Customs.update({_id: s}, {$set:{sharedBy:ownerId},$addToSet:{viewers: newOwnerId}});
                            break;
                    }
                });

            });
        }

        TargetsCompanies.update({_id:currentTargetId},{$addToSet:{viewers:newOwnerId}});

        var creator = Meteor.users.findOne({_id:ownerId}).username;
        var receiver = Meteor.users.findOne({_id:newOwnerId}).username;

        var existingNotification = Notifications.findOne({receiverId:newOwnerId,itemId:currentFootballId});

        if(existingNotification) {
            return alert("You've already shared this Football with this user!");
        } else {
            var notification = {
                creatorId: ownerId,
                creator: creator,
                receiverId: newOwnerId,
                receiver: receiver,
                action: "share",
                itemId: currentFootballId,
                item: "football"
            };

            Notifications.insert(notification);
        }

        return {
            _id: sharedFootballId
        };
    },
    footballRemove: function(currentFootballId) {
        check(currentFootballId, String);

        var currentValuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
        var valuations = Valuations.find({_id: {$in: [currentValuations]}});
        var currentUserId = Meteor.userId();

        var time = new Date();

        valuations.forEach(function (v) {
            var currentValuationId = v._id;
            Valuations.remove(currentValuationId);
        });

        Footballs.remove(currentFootballId);

        var footballNewId = Footballs.insert({ownerId:currentUserId});
        Footballs.update({_id:footballNewId},{$set:{timeCreated:time}});
        Options.update({ownerId:currentUserId},{$set:{footballActive:footballNewId}});
    },
    //Change name of Football
    footballNameUpdate: function(currentFootballId, footballName) {
        check(currentFootballId, String);
        check(footballName, String);

        var footballId = Footballs.update(currentFootballId, {$set: {footballName:footballName}});

        return {
            _id: footballId
        };
    },
    //Add target to duplicate of Football Field
    footballTargetUpdateAndCopy: function(currentFootballId, targetObject, footballType, saveCopy) {
        check(currentFootballId, String);
        check(targetObject, Object);
        check(footballType, String);
        check(saveCopy, Boolean);

        var newType = targetObject.targetType;

        var getNewOutput = function(currentFootballId) {
            if(newType == "none") {
                return "Multiple";
            } else {
                return Footballs.findOne({_id:currentFootballId}).footballOutput;
            }
        };

        if(newType == "none") {
            var valuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
            valuations.forEach(function (v) {
                var valuation = Valuations.findOne({_id: v});
                var updates = {
                    metric: valuation.valuationMetric,
                    period: valuation.valuationPeriod
                };
                Valuations.update({_id: v},{
                    $set: {
                        valuationOutput: updates.metric,
                        valuationOutputPeriod: updates.period
                    }
                })
            })
        }

        if(saveCopy) {
            var currentFootballCut = Footballs.findOne({_id:currentFootballId},{
                fields:{
                    _id:0,
                    viewers:0,
                    sharedBy: 0,
                    footballOutput: 0
                }
            });
            var currentFootballExtended = _.extend(currentFootballCut, {
                footballType: footballType,
                footballTarget: targetObject,
                footballOutput: getNewOutput(currentFootballId)
            });
            Footballs.insert(currentFootballExtended);
        } else {
            var footballId = Footballs.update({_id:currentFootballId}, {
                $set: {
                    footballTarget:targetObject,
                    footballType: footballType,
                    footballOutput: getNewOutput(currentFootballId)
                }
            });
        }

        return {
            _id: footballId
        };
    },
    //Add target to existing active Football Field
    footballTargetUpdate: function(currentFootballId, targetObject, footballType) {
        check(currentFootballId, String);
        check(targetObject, Object);
        check(footballType, String);

        var getNewOutput = function(currentFootballId, targetObject) {
            var newType = targetObject.targetType;
            if(newType == "none") {
                return "Multiple";
            } else {
                return Footballs.findOne({_id:currentFootballId}).footballOutput;
            }
        };

        var footballId = Footballs.update({_id:currentFootballId}, {
            $set: {
                footballTarget:targetObject,
                footballType: footballType,
                footballOutput: getNewOutput(currentFootballId, targetObject)
            }});

        return {
            _id: footballId
        };
    },
    //Change Football Output
    footballOutputUpdate: function(currentFootballId, newFootballOutput) {
        check(currentFootballId, String);
        check(newFootballOutput, String);

        var footballId = Footballs.update(currentFootballId, {$set: {footballOutput:newFootballOutput}});

        return {
            _id: footballId
        };
    },
    //Change Football Sort
    footballSortUpdate: function(currentFootballId, newFootballSort) {
        check(currentFootballId, String);
        check(newFootballSort, String);

        var footballId = Footballs.update(currentFootballId, {$set: {footballSort:newFootballSort}});

        return {
            _id: footballId
        };
    },
    //Change football scale between millions and billions
    footballScaleToggle: function(currentFootballId) {
        check(currentFootballId, String);

        var currentScale = Footballs.findOne({_id:currentFootballId}).footballScale;

        switch(currentScale) {
            case "millions":
                Footballs.update(currentFootballId, {$set: {footballScale:"billions"}});
                break;
            case "billions":
                Footballs.update(currentFootballId, {$set: {footballScale:"millions"}});
                break;
        }
    },
    //Reduce Valuation Spread by 5%
    valuationSpreadDown: function(currentValuationId) {
        check(currentValuationId, String);

        var spread = Valuations.findOne(currentValuationId).valuationSpread;
        var spreadChange = -5;
        var newSpread = spread + spreadChange;

        if(newSpread < 0) {
            console.log("Do nothing")
        } else {
            Valuations.update(currentValuationId, {$inc: {valuationSpread:spreadChange}}
            );
        }
    },
    //Increase Football Spread by 5%
    valuationSpreadUp: function(currentValuationId) {
        check(currentValuationId, String);

        var spread = Valuations.findOne(currentValuationId).valuationSpread;
        var spreadChange = 5;
        var newSpread = spread + spreadChange;

        if(newSpread > 50) {
            console.log("Do nothing")
        } else {
            Valuations.update(currentValuationId, {$inc: {valuationSpread:spreadChange}}
            );
        }
    },
    footballSpreadDown: function(currentFootballId) {
        check(currentFootballId, String);

        var spread = Footballs.findOne(currentFootballId).footballSpread;
        var spreadChange = -5;
        var newSpread = spread + spreadChange;

        if(newSpread < 0) {
            console.log("Do nothing")
        } else {
            Footballs.update(currentFootballId, {$inc: {footballSpread:spreadChange}}
            );
        }
    },
    //Increase Football Spread by 5%
    footballSpreadUp: function(currentFootballId) {
        check(currentFootballId, String);

        var spread = Footballs.findOne(currentFootballId).footballSpread;
        var spreadChange = 5;
        var newSpread = spread + spreadChange;

        if(newSpread > 50) {
            console.log("Do nothing")
        } else {
            Footballs.update(currentFootballId, {$inc: {footballSpread:spreadChange}}
            );
        }
    },
    //Reduce Football Cushion by 1, to min of 1
    footballCushionDown: function(currentFootballId) {
        check(currentFootballId, String);

        var cushion = Footballs.findOne({_id:currentFootballId}).footballCushion;
        var cushionInc = -1;
        var newCushion = cushion + cushionInc;

        if(newCushion < 1) {
            console.log("Do nothing");
        } else {
            Footballs.update(currentFootballId, {$inc: {footballCushion:cushionInc}}
            );
        }
    },
    //Increase Football Cushion by 1
    footballCushionUp: function(currentFootballId) {
        check(currentFootballId, String);

        var cushionInc = 1;

        Footballs.update(currentFootballId, {$inc: {footballCushion:cushionInc}});
    },
    //Toggle whether Current d3 shape appears
    footballCurrentToggle: function(currentFootballId) {
        check(currentFootballId, String);

        var currentCurrent = Footballs.findOne({_id:currentFootballId}).includeCurrent;

        switch(currentCurrent) {
            case true:
                var trading = Footballs.findOne({_id:currentFootballId}).includeTrading;
                var valuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
                var valuationsCount = valuations.length;
                if(trading == false) {
                    if(valuationsCount == 0) {
                        Footballs.update(currentFootballId, {$set: {includeCurrent:false, footballLive: false}});
                    } else {
                        if(valuationsCount == 1) {
                            var valuationId = valuations[0];
                            var selections = Valuations.findOne({_id:valuationId}).valuationSelections;
                            var selectionsCount = selections.length;
                            if(selectionsCount == 0) {
                                Footballs.update(currentFootballId, {$set: {includeCurrent:false, footballLive: false}});
                            } else {
                                Footballs.update(currentFootballId, {$set: {includeCurrent:false}});
                            }
                        } else {
                            if(valuationsCount > 1) {
                                Footballs.update(currentFootballId, {$set: {includeCurrent:false}});
                            }
                        }
                    }
                } else {
                    Footballs.update(currentFootballId, {$set: {includeCurrent:false}});
                }
                break;
            case false:
                Footballs.update(currentFootballId, {$set: {includeCurrent:true, footballLive: true}});
                break;
        }
    },
    //Toggle whether Trading d3 shape appears
    footballTradingToggle: function(currentFootballId) {
        check(currentFootballId, String);

        var currentTrading = Footballs.findOne({_id:currentFootballId}).includeTrading;

        switch(currentTrading) {
            case true:
                var current = Footballs.findOne({_id:currentFootballId}).includeCurrent;
                var valuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
                var valuationsCount = valuations.length;
                if(current == false) {
                    if(valuationsCount == 0) {
                        Footballs.update(currentFootballId, {$set: {includeTrading:false, footballLive: false}});
                    } else {
                        if(valuationsCount == 1) {
                            var valuationId = valuations[0];
                            var selections = Valuations.findOne({_id:valuationId}).valuationSelections;
                            var selectionsCount = selections.length;
                            if(selectionsCount == 0) {
                                Footballs.update(currentFootballId, {$set: {includeTrading:false, footballLive: false}});
                            } else {
                                Footballs.update(currentFootballId, {$set: {includeTrading:false}});
                            }
                        } else {
                            if(valuationsCount > 1) {
                                Footballs.update(currentFootballId, {$set: {includeTrading:false}});
                            }
                        }
                    }
                } else {
                    Footballs.update(currentFootballId, {$set: {includeTrading:false}});
                }
                break;
            case false:
                Footballs.update(currentFootballId, {$set: {includeTrading:true, footballLive: true}});
                break;
        }
    },
    //Add new valuation with selected comps or deals in Gallery
    valuationAdd: function(marketType, type, element, metric, period, output, outputPeriod, selections, currentFootballId, live) {
        check(marketType, String);
        check(type, String);
        check(element, String);
        check(metric, String);
        check(period, String);
        check(output, String);
        check(outputPeriod, String);
        check(selections, Array);
        check(currentFootballId, String);
        check(live, Boolean);

        var currentUserId = Meteor.userId();

        var valuationsAll = Footballs.findOne({_id:currentFootballId}).footballValuationsAll;
        var valuationsAllCount = valuationsAll.length;
        var valuationNumber = valuationsAllCount + 1;
        var valuationName = "Valuation #" + valuationNumber;

        var valuation = {
            ownerId: currentUserId,
            marketType: marketType,
            valuationName: valuationName,
            valuationType: type,
            valuationElement: element,
            valuationMetric: metric,
            valuationPeriod: period,
            valuationOutput: output,
            valuationOutputPeriod: outputPeriod,
            valuationSelections: selections,
            timeCreated: new Date()
        };

        var valuationId = Valuations.insert(valuation);

        Meteor.call('valuationAggregate', valuationId, function (error, result) {
        });

        var footballUpdated = Footballs.update({_id:currentFootballId},{$addToSet:{footballValuations:valuationId,footballValuationsAll:valuationId}});
        var footballViewers = Footballs.findOne({_id:currentFootballId}).viewers;
        var viewerCount = footballViewers.length;
        if(viewerCount > 0) {
            footballViewers.forEach(function (v) {
                Valuations.update({_id:valuationId},{$addToSet:{viewers:v}});
            })
        }
        var currentLive = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(currentLive == false) {
            Footballs.update({_id:currentFootballId},{$set:{footballLive:live}});
        }

        if (Meteor.isClient) {
            Session.set('sessionValuations', valuationId);
        }

        return {
            _id: footballUpdated
        };
    },
    //Change Valuation Type and set default Element
    valuationBuildType: function(currentValuationId, option) {
        check(currentValuationId, String);
        check(option, String);

        var getOptions = function(option) {
            switch(option) {
                case "Comps":
                    return {
                        type: "comps",
                        element: "security"
                    };
                    break;
                case "Comps Indices":
                    return {
                        type: "comps",
                        element: "index"
                    };
                    break;
                case "Deals":
                    return {
                        type: "deals",
                        element: "security"
                    };
                    break;
                case "Deals Indices":
                    return {
                        type: "deals",
                        element: "index"
                    };
                    break;
                case "Models":
                    return {
                        type: "models",
                        element: "enterpriseValue"
                    };
                    break;
                case "Custom":
                    return {
                        type: "custom",
                        element: "customValue"
                    };
                    break;
            }
        };
        var selections = Valuations.findOne({_id:currentValuationId}).valuationSelections;
        var count = selections.length;
        if(!selections || count === 0) {
            var options = getOptions(option);
            Valuations.update({_id: currentValuationId}, {$set: {valuationType: options.type, valuationElement: options.element}});
        } else {
            alert("You can't change the Valuation Type if you have already made selections.")
        }
    },
    //Add selections to Valuation - comps or deals
    valuationBuildDataAdd: function(currentFootballId, currentValuationId, selection) {
        check(currentFootballId, String);
        check(currentValuationId, String);
        check(selection, String);

        var valuation = Valuations.findOne(currentValuationId);
        var valuationType = valuation.valuationType;
        var valuationElement = valuation.valuationElement;

        var football = Footballs.findOne({_id:currentFootballId});
        var marketType = football.marketType;

        var selectionAll = {
            selection: selection,
            metric: valuation.valuationMetric,
            period: valuation.valuationPeriod,
            date: valuation.valuationDate
        };

        console.log("SelectionAll", selectionAll);

        switch(marketType) {
            case "company":
                switch(valuationType) {
                    case "comps":
                        switch(valuationElement) {
                            case "security":
                                Valuations.update(currentValuationId, {
                                    $addToSet: {
                                        valuationSelections:selection,
                                        valuationSelectionsAll: selectionAll

                                    }
                                });
                                break;
                            case "index":
                                Valuations.update(currentValuationId, {$addToSet: {valuationSelections:selection}});
                                break;
                        }
                        break;
                    case "deals":
                        switch(valuationElement) {
                            case "security":
                                Valuations.update(currentValuationId, {$addToSet: {valuationSelections:selection}});
                                break;
                            case "index":
                                Valuations.update(currentValuationId, {$addToSet: {valuationSelections:selection}});
                                break;
                        }
                }
                break;
            case "marketTypeB":
                //
        }
        var live = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(live == false) {
            Footballs.update({_id:currentFootballId},{$set:{footballLive:true}});
        }
    },
    //Add selection to Valuation - Models.   Calculate and save implied values
    valuationBuildModelAdd: function(currentFootballId, currentValuationId, selectionName, selectionStat, selectionValue) {
        check(currentFootballId, String);
        check(currentValuationId, String);
        check(selectionName, String);
        check(selectionStat, String);
        check(selectionValue, String);

        var value = parseFloat(selectionValue);

        var targetId = Footballs.findOne({_id:currentFootballId}).footballTarget.targetId;
        var currentUserId = Meteor.userId();
        var footballType = Footballs.findOne({_id:currentFootballId}).footballType;

        var model = {
            ownerId: currentUserId,
            targetId: targetId,
            modelName: selectionName
        };

        var modelId = Models.insert(model);

        var getModelValues = function(footballType, value, selectionStat) {
            var targetId = Footballs.findOne({_id:currentFootballId}).footballTarget.targetId;
            var targetFeed = FeedCompanies.findOne({_id:targetId});
            switch(selectionStat) {
                case "Enterprise Value":
                    var equity = value - targetFeed.capTable.netDebt;
                    return {
                        stat: selectionStat,
                        enterpriseValue: value,
                        pricePerShare: equity / targetFeed.capTable.sharesOs,
                        evRevenueLtm: value / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: value / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: value / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: value / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: value / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: value / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: equity / (targetFeed.financial.ltm.eps * targetFeed.capTable.sharesOs),
                        priceEarningsFy1: equity / (targetFeed.financial.fy1.eps * targetFeed.capTable.sharesOs),
                        priceEarningsFy2: equity / (targetFeed.financial.fy2.eps * targetFeed.capTable.sharesOs)
                    };
                    break;
                case "Price per Share":
                    var ev = (value * targetFeed.capTable.sharesOs) + targetFeed.capTable.netDebt;
                    return {
                        stat: selectionStat,
                        enterpriseValue: ev,
                        pricePerShare: value,
                        evRevenueLtm: ev / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: ev / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: ev / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: ev / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: ev / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: ev / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: value / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: value / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: value / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/Revenue (LTM)":
                    var evEvRevenueLtm = value * targetFeed.financial.ltm.revenue;
                    var priceEvRevenueLtm = (evEvRevenueLtm - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvRevenueLtm,
                        pricePerShare: priceEvRevenueLtm,
                        evRevenueLtm: value,
                        evRevenueFy1: evEvRevenueLtm / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evEvRevenueLtm / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evEvRevenueLtm / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evEvRevenueLtm / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evEvRevenueLtm / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: priceEvRevenueLtm / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvRevenueLtm / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvRevenueLtm / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/Revenue (FY1)":
                    var evEvRevenueFy1 = value * targetFeed.financial.fy1.revenue;
                    var priceEvRevenueFy1 = (evEvRevenueFy1 - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvRevenueFy1,
                        pricePerShare: priceEvRevenueFy1,
                        evRevenueLtm: evEvRevenueFy1 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: value,
                        evRevenueFy2: evEvRevenueFy1 / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evEvRevenueFy1 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evEvRevenueFy1 / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evEvRevenueFy1 / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: priceEvRevenueFy1 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvRevenueFy1 / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvRevenueFy1 / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/Revenue (FY2)":
                    var evEvRevenueFy2 = value * targetFeed.financial.fy2.revenue;
                    var priceEvRevenueFy2 = (evEvRevenueFy2 - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvRevenueFy2,
                        pricePerShare: priceEvRevenueFy2,
                        evRevenueLtm: evEvRevenueFy2 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evEvRevenueFy2 / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: value,
                        evEbitdaLtm: evEvRevenueFy2 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evEvRevenueFy2 / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evEvRevenueFy2 / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: priceEvRevenueFy2 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvRevenueFy2 / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvRevenueFy2 / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/EBITDA (LTM)":
                    var evEvEbitdaLtm = value * targetFeed.financial.ltm.ebitda;
                    var priceEvEbitdaLtm = (evEvEbitdaLtm - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvEbitdaLtm,
                        pricePerShare: priceEvEbitdaLtm,
                        evRevenueLtm: evEvEbitdaLtm / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evEvEbitdaLtm / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evEvEbitdaLtm / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: value,
                        evEbitdaFy1: evEvEbitdaLtm / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evEvEbitdaLtm / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: priceEvEbitdaLtm / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvEbitdaLtm / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvEbitdaLtm / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/EBITDA (FY1)":
                    var evEvEbitdaFy1 = value * targetFeed.financial.fy1.ebitda;
                    var priceEvEbitdaFy1 = (evEvEbitdaFy1 - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvEbitdaFy1,
                        pricePerShare: priceEvEbitdaFy1,
                        evRevenueLtm: evEvEbitdaFy1 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evEvEbitdaFy1 / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evEvEbitdaFy1 / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evEvEbitdaFy1 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: value,
                        evEbitdaFy2: evEvEbitdaFy1 / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: priceEvEbitdaFy1 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvEbitdaFy1 / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvEbitdaFy1 / targetFeed.financial.fy2.eps
                    };
                    break;
                case "EV/EBITDA (FY2)":
                    var evEvEbitdaFy2 = value * targetFeed.financial.fy2.ebitda;
                    var priceEvEbitdaFy2 = (evEvEbitdaFy2 - targetFeed.capTable.netDebt) / targetFeed.capTable.sharesOs;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evEvEbitdaFy2,
                        pricePerShare: priceEvEbitdaFy2,
                        evRevenueLtm: evEvEbitdaFy2 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evEvEbitdaFy2 / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evEvEbitdaFy2 / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evEvEbitdaFy2 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evEvEbitdaFy2 / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: value,
                        priceEarningsLtm: priceEvEbitdaFy2 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: priceEvEbitdaFy2 / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: priceEvEbitdaFy2 / targetFeed.financial.fy2.eps
                    };
                    break;
                case "P/E (LTM)":
                    var pricePriceEarningsLtm = value * targetFeed.financial.ltm.eps;
                    var evPriceEarningsLtm = (pricePriceEarningsLtm * targetFeed.capTable.sharesOs) + targetFeed.capTable.netDebt;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evPriceEarningsLtm,
                        pricePerShare: pricePriceEarningsLtm,
                        evRevenueLtm: evPriceEarningsLtm / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evPriceEarningsLtm / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evPriceEarningsLtm / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evPriceEarningsLtm / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evPriceEarningsLtm / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evPriceEarningsLtm / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: value,
                        priceEarningsFy1: pricePriceEarningsLtm / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: pricePriceEarningsLtm / targetFeed.financial.fy2.eps
                    };
                    break;
                case "P/E (FY1)":
                    var pricePriceEarningsFy1 = value * targetFeed.financial.fy1.eps;
                    var evPriceEarningsFy1 = (pricePriceEarningsFy1 * targetFeed.capTable.sharesOs) + targetFeed.capTable.netDebt;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evPriceEarningsFy1,
                        pricePerShare: pricePriceEarningsFy1,
                        evRevenueLtm: evPriceEarningsFy1 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evPriceEarningsFy1 / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evPriceEarningsFy1 / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evPriceEarningsFy1 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evPriceEarningsFy1 / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evPriceEarningsFy1 / targetFeed.financial.fy2.ebitda,
                        priceEarningsLtm: pricePriceEarningsFy1 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: value,
                        priceEarningsFy2: pricePriceEarningsFy1 / targetFeed.financial.fy2.eps
                    };
                    break;
                case "P/E (FY2)":
                    var pricePriceEarningsFy2 = value * targetFeed.financial.fy2.eps;
                    var evPriceEarningsFy2 = (pricePriceEarningsFy2 * targetFeed.capTable.sharesOs) + targetFeed.capTable.netDebt;
                    return {
                        stat: selectionStat,
                        enterpriseValue: evPriceEarningsFy2,
                        pricePerShare: pricePriceEarningsFy2,
                        evRevenueLtm: evPriceEarningsFy2 / targetFeed.financial.ltm.revenue,
                        evRevenueFy1: evPriceEarningsFy2 / targetFeed.financial.fy1.revenue,
                        evRevenueFy2: evPriceEarningsFy2 / targetFeed.financial.fy2.revenue,
                        evEbitdaLtm: evPriceEarningsFy2 / targetFeed.financial.ltm.ebitda,
                        evEbitdaFy1: evPriceEarningsFy2 / targetFeed.financial.fy1.ebitda,
                        evEbitdaFy2: evPriceEarningsFy2 / targetFeed.financial.fy1.ebitda,
                        priceEarningsLtm: pricePriceEarningsFy2 / targetFeed.financial.ltm.eps,
                        priceEarningsFy1: pricePriceEarningsFy2 / targetFeed.financial.fy1.eps,
                        priceEarningsFy2: value
                    };
                    break;
            }
        };

        var modelValues = getModelValues(footballType, value, selectionStat);

        Models.update({_id:modelId}, {
            $set: {
                values: modelValues
            }
        });

        Options.update({ownerId:currentUserId},{$addToSet:{modelTypes:selectionName}});

        var valuationId = Valuations.update({_id:currentValuationId}, {
                $addToSet: {
                    valuationSelections:modelId
                }
            }
        );
        var live = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(live == false) {
            Footballs.update({_id:currentFootballId},{$set:{footballLive:true}});
        }
        return {
            _id: valuationId
        };
    },
    //Add selection to Valuation - Custom
    valuationBuildCustomAdd: function(currentFootballId, currentValuationId, selectionName, selectionStat, selectionValue) {
        check(currentFootballId, String);
        check(currentValuationId, String);
        check(selectionName, String);
        check(selectionStat, String);
        check(selectionValue, String);

        var value = parseFloat(selectionValue);

        var targetId = Footballs.findOne({_id:currentFootballId}).footballTarget.targetId;
        var currentUserId = Meteor.userId();

        var custom = {
            ownerId: currentUserId,
            targetId: targetId,
            customName: selectionName,
            values: {
                customStat: selectionStat,
                customValue: value
            }
        };

        var customId = Customs.insert(custom);

        var selections = Valuations.findOne({_id:currentValuationId}).valuationSelections;
        var count = selections.length;
        var getCustom = function(count) {
            if(count == 0) {
                return selectionStat;
            }
        };
        var existingCustom = getCustom(count);

        var valuationId = Valuations.update({_id:currentValuationId}, {
            $set: {
                existingCustom: existingCustom
            },
            $addToSet: {
                valuationSelections: customId
                }
            }
        );
        var live = Footballs.findOne({_id:currentFootballId}).footballLive;
        if(live == false) {
            Footballs.update({_id:currentFootballId},{$set:{footballLive:true}});
        }

        return {
            _id: valuationId
        };
    },
    //Remove selection from valuation within Valuation Build
    valuationBuildPull: function(currentUserId, currentValuationId, currentSelection) {
        check(currentUserId, String);
        check(currentValuationId, String);
        check(currentSelection, String);

        var selectionRemove = Valuations.update(
            {
                _id: currentValuationId
            },
            {
                $pull: {
                    'valuationSelectionsAll': {
                        selection: currentSelection
                    }
                }
        });

        var valuationId = Valuations.update(currentValuationId, {
            $pull: {
                valuationSelections:currentSelection,
                valuationSelectionsAll: selectionRemove
                }
        });

        var currentFootballId = Options.findOne({ownerId:currentUserId}).footballActive;
        var valuations = Footballs.findOne({_id:currentFootballId}).footballValuations;
        var valuationsCount = valuations.length;
        var selections = Valuations.findOne(currentValuationId).valuationSelections;

        if(valuationsCount == 1) {
            if(!selections || selections.length == 0) {
                var football = Footballs.findOne({_id:currentFootballId});
                var current = football.includeCurrent;
                var trading = football.includeTrading;
                if(current == false && trading == false) {
                    Valuations.update(currentValuationId, {$unset: {multiples:""}});
                    Footballs.update({_id: currentFootballId}, {$set: {footballLive: false}});
                }
            }
        } else {
            if(!selections || selections.length == 0) {
                Valuations.update(currentValuationId, {$unset: {multiples:""}});
            }
        }

        return {
            _id: valuationId
        };
    },
    //Change name of Valuation
    valuationNameUpdate: function(currentValuationId, valuationName) {
        check(currentValuationId, String);
        check(valuationName, String);

        var valuationId = Valuations.update(currentValuationId, {$set: {valuationName:valuationName}});

        return {
            _id: valuationId
        };
    },
    //Change date of Valuation
    valuationDateUpdate: function(currentValuationId, valuationDate) {
        check(currentValuationId, String);
        check(valuationDate, String);

        var valuationId = Valuations.update(currentValuationId, {$set: {valuationDate:valuationDate}});

        return {
            _id: valuationId
        };
    },
    //Change calc option used for Build
    valuationCalcUpdate: function(currentValuationId) {
        check(currentValuationId, String);

        var currentCalc = Valuations.findOne({_id:currentValuationId}).valuationCalc;

        switch(currentCalc) {
            case "average":
                Valuations.update(currentValuationId, {$set: {valuationCalc:"median"}});
                break;
            case "median":
                Valuations.update(currentValuationId, {$set: {valuationCalc:"high"}});
                break;
            case "high":
                Valuations.update(currentValuationId, {$set: {valuationCalc:"low"}});
                break;
            case "low":
                Valuations.update(currentValuationId, {$set: {valuationCalc:"average"}});
                break;
        }
    },
    //Edit Valuation Note
    valuationNoteUpdate: function(currentValuationId, valuationNote) {
        check(currentValuationId, String);
        check(valuationNote, String);

        var valuationId = Valuations.update(currentValuationId, {$set: {valuationNotes:valuationNote}});

        return {
            _id: valuationId
        };
    },
    //Change valuationMetric and valuationPeriod using dropdown
    valuationBuildSelect: function(currentValuationId, selection, footballId) {
        check(currentValuationId, String);
        check(selection, String);
        check(footballId, String);

        var footballType = Footballs.findOne({_id:footballId}).footballType;
        switch(footballType) {
            case "market":
                switch(selection) {
                    case "EV/Revenue (LTM)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"LTM",valuationOutput:"EV/Revenue",valuationOutputPeriod:"LTM"}});
                        break;
                    case "EV/Revenue (FY1)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY1",valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY1"}});
                        break;
                    case "EV/Revenue (FY2)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY2",valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY2"}});
                        break;
                    case "EV/EBITDA (LTM)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"LTM",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"LTM"}});
                        break;
                    case "EV/EBITDA (FY1)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY1",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY1"}});
                        break;
                    case "EV/EBITDA (FY2)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY2",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY2"}});
                        break;
                    case "P/E (LTM)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"LTM",valuationOutput:"P/E",valuationOutputPeriod:"LTM"}});
                        break;
                    case "P/E (FY1)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY1",valuationOutput:"P/E",valuationOutputPeriod:"FY1"}});
                        break;
                    case "P/E (FY2)":
                        return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY2",valuationOutput:"P/E",valuationOutputPeriod:"FY2"}});
                        break;
                }
                break;
            case "target":
                var valuationType = Valuations.findOne({_id:currentValuationId}).valuationType;
                if(valuationType == "models") {
                    switch(selection) {
                        case "EV/Revenue (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"LTM",valuationOutput:"EV/Revenue",valuationOutputPeriod:"LTM"}});
                            break;
                        case "EV/Revenue (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY1",valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY1"}});
                            break;
                        case "EV/Revenue (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY2",valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY2"}});
                            break;
                        case "EV/EBITDA (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"LTM",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"LTM"}});
                            break;
                        case "EV/EBITDA (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY1",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY1"}});
                            break;
                        case "EV/EBITDA (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY2",valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY2"}});
                            break;
                        case "P/E (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"LTM",valuationOutput:"P/E",valuationOutputPeriod:"LTM"}});
                            break;
                        case "P/E (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY1",valuationOutput:"P/E",valuationOutputPeriod:"FY1"}});
                            break;
                        case "P/E (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY2",valuationOutput:"P/E",valuationOutputPeriod:"FY2"}});
                            break;
                    }
                    break;
                } else {
                    switch(selection) {
                        case "EV/Revenue (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"LTM"}});
                            break;
                        case "EV/Revenue (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY1"}});
                            break;
                        case "EV/Revenue (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/Revenue",valuationPeriod:"FY2"}});
                            break;
                        case "EV/EBITDA (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"LTM"}});
                            break;
                        case "EV/EBITDA (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY1"}});
                            break;
                        case "EV/EBITDA (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"EV/EBITDA",valuationPeriod:"FY2"}});
                            break;
                        case "P/E (LTM)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"LTM"}});
                            break;
                        case "P/E (FY1)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY1"}});
                            break;
                        case "P/E (FY2)":
                            return Valuations.update(currentValuationId, {$set: {valuationMetric:"P/E",valuationPeriod:"FY2"}});
                            break;
                    }
                    break;
                }
        }
    },
    //Change valuationOutput and valuationOutputPeriod using dropdown
    valuationResultSelect: function(currentValuationId, selection) {
        check(currentValuationId, String);
        check(selection, String);

        switch(selection) {
            case "EV/Revenue (LTM)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/Revenue",valuationOutputPeriod:"LTM"}});
                break;
            case "EV/Revenue (FY1)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY1"}});
                break;
            case "EV/Revenue (FY2)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/Revenue",valuationOutputPeriod:"FY2"}});
                break;
            case "EV/EBITDA (LTM)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/EBITDA",valuationOutputPeriod:"LTM"}});
                break;
            case "EV/EBITDA (FY1)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY1"}});
                break;
            case "EV/EBITDA (FY2)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"EV/EBITDA",valuationOutputPeriod:"FY2"}});
                break;
            case "P/E (LTM)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"P/E",valuationOutputPeriod:"LTM"}});
                break;
            case "P/E (FY1)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"P/E",valuationOutputPeriod:"FY1"}});
                break;
            case "P/E (FY2)":
                return Valuations.update(currentValuationId, {$set: {valuationOutput:"P/E",valuationOutputPeriod:"FY2"}});
                break;
        }
    },
    //Create a copy of current valuation within same Football
    valuationRepeat: function(currentValuationId, currentFootballId) {
        check(currentValuationId, String);
        check(currentFootballId, String);

        var valuation = Valuations.findOne({_id:currentValuationId},{fields:{_id:0}});

        var valuationsAll = Footballs.findOne({_id:currentFootballId}).footballValuationsAll;
        var valuationsAllCount = valuationsAll.length;
        var valuationNumber = valuationsAllCount + 1;
        var valuationName = "Valuation #" + valuationNumber;

        var valuationExtended = _.extend(valuation, {
            valuationName: valuationName,
            submitted: new Date()
        });

        var newValuationId = Valuations.insert(valuationExtended);

        Footballs.update(currentFootballId,{$addToSet: {footballValuations:newValuationId,footballValuationsAll:newValuationId}});

        Session.set('sessionValuations', newValuationId);

        return {
            _id: newValuationId
        };
    },
    //Categorize Valuation as Favorite so that it appears in Gallery
    valuationFavorite: function(currentValuationId) {
        check(currentValuationId, String);

        var currentUserId = Meteor.userId();

        var valuation = Valuations.findOne(
            {
                _id:currentValuationId
            },
            {
                fields:{
                    _id:0,
                    ownerId: 0,
                    valuationMetric: 0,
                    valuationPeriod: 0,
                    valuationDate: 0,
                    valuationOutput: 0,
                    valuationOutputPeriod: 0,
                    valuationCalc: 0,
                    multiples: 0
                }
            }
        );

        var newValuation = _.extend(valuation, {
            ownerId: currentUserId,
            valuationFavorite: true
        });

        var existingFavorite = Valuations.findOne(newValuation);
        if(!existingFavorite) {
            var newValuationId = Valuations.insert(newValuation);
            return {
                _id: newValuationId
            };
        }
    },
    //Delete valuation from within Valuation Block
    valuationRemove: function(currentFootballId,currentValuationId) {
        check(currentFootballId, String);
        check(currentValuationId, String);

        Footballs.update(currentFootballId, {$pull: {footballValuations:currentValuationId}});
        Valuations.remove(currentValuationId);

        var football = Footballs.findOne({_id:currentFootballId});
        var valuations = football.footballValuations;
        var valuationsCount = valuations.length;
        var current = football.includeCurrent;
        var trading = football.includeTrading;
        if(valuationsCount == 0) {
            if(current == false && trading == false) {
                Footballs.update({_id:currentFootballId},{$set:{footballLive:false}});
            }
        } else {
            var valuationLastId = valuations[0];
            var selections = Valuations.findOne({_id:valuationLastId}).valuationSelections;
            var selectionsCount = selections.length;
            if(selectionsCount == 0) {
                Footballs.update({_id:currentFootballId},{$set:{footballLive:false}});
            }
        }
    },
    //Pushes ratios from each valuationSelection into an array, to then calculate averages/median/high/low in helper
    valuationAggregate: function(valuationId) {
        check(valuationId, String);

        if (Meteor.isServer) {
            //Aggregate and publish average of valuation data for a user-selected series.//
            //Selections are saved in Valuations collection for reference and data for aggregation comes from one of several collections.//
            var valuation = Valuations.findOne({_id: valuationId});
            var marketType = valuation.marketType;
            var valuationType = valuation.valuationType;
            var valuationElement = valuation.valuationElement;
            var valuationDate = valuation.valuationDate;
            var valuationSelections = valuation.valuationSelections;

            switch(marketType) {
                case "company":
                    switch (valuationType) {
                        case "comps":
                            switch (valuationElement) {
                                case "security":
                                    var pipelineComps = [
                                        //Match documents in FeedCompanies collection where the 'ticker' value was selected by the user.//
                                        {
                                            $match: {
                                                _id: {$in: valuationSelections}
                                            }
                                        },
                                        //Unwind closingPrices to create document for each date
                                        {
                                            $unwind: "$closingPrices"
                                        },
                                        //Match documents for selected date
                                        {
                                            $match: {
                                                "closingPrices.date": valuationDate
                                            }
                                        },
                                        //Group all matching documents and calculate averages for each valuation metric across all selections.//
                                        {
                                            $project: {
                                                financial: 1,
                                                closingPrice: "$closingPrices.price",
                                                marketCap: {$multiply: ["$capTable.sharesOs", "$closingPrices.price"]},
                                                enterpriseValue: {$add: [{$multiply: ["$capTable.sharesOs", "$closingPrices.price"]}, "$capTable.netDebt"]}
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                evRevenueLtm: {$push: {$divide: ["$enterpriseValue", "$financial.ltm.revenue"]}},
                                                evRevenueFy1: {$push: {$divide: ["$enterpriseValue", "$financial.fy1.revenue"]}},
                                                evRevenueFy2: {$push: {$divide: ["$enterpriseValue", "$financial.fy2.revenue"]}},
                                                evEbitdaLtm: {$push: {$divide: ["$enterpriseValue", "$financial.ltm.ebitda"]}},
                                                evEbitdaFy1: {$push: {$divide: ["$enterpriseValue", "$financial.fy1.ebitda"]}},
                                                evEbitdaFy2: {$push: {$divide: ["$enterpriseValue", "$financial.fy2.ebitda"]}},
                                                priceEarningsLtm: {$push: {$divide: ["$closingPrice", "$financial.ltm.eps"]}},
                                                priceEarningsFy1: {$push: {$divide: ["$closingPrice", "$financial.fy1.eps"]}},
                                                priceEarningsFy2: {$push: {$divide: ["$closingPrice", "$financial.fy2.eps"]}}
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                evRevenueLtm: 1,
                                                evRevenueFy1: 1,
                                                evRevenueFy2: 1,
                                                evEbitdaLtm: 1,
                                                evEbitdaFy1: 1,
                                                evEbitdaFy2: 1,
                                                priceEarningsLtm: 1,
                                                priceEarningsFy1: 1,
                                                priceEarningsFy2: 1
                                            }
                                        }
                                    ];

                                    var resultsComps = FeedCompanies.aggregate(pipelineComps);
                                    resultsComps.forEach(function (valuationResults) {
                                        Valuations.update({_id: valuationId}, {$set: {multiples: valuationResults}});
                                    });
                                    break;
                                case "index":
                                    var pipelineCompsIndex = [
                                        //Match documents in FeedCompaniesIndices collection where the 'sector' value was selected by the user.//
                                        {
                                            $match: {
                                                _id: {$in: valuationSelections}
                                            }
                                        },
                                        //Unwind closingPrices to create document for each date
                                        {
                                            $unwind: "$values"
                                        },
                                        {
                                            $match: {
                                                "values.date": valuationDate
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                evRevenueLtm: {$push: "$values.evRevenueLtm"},
                                                evRevenueFy1: {$push: "$values.evRevenueFy1"},
                                                evRevenueFy2: {$push: "$values.evRevenueFy2"},
                                                evEbitdaLtm: {$push: "$values.evEbitdaLtm"},
                                                evEbitdaFy1: {$push: "$values.evEbitdaFy1"},
                                                evEbitdaFy2: {$push: "$values.evEbitdaFy2"},
                                                priceEarningsLtm: {$push: "$values.priceEarningsLtm"},
                                                priceEarningsFy1: {$push: "$values.priceEarningsFy1"},
                                                priceEarningsFy2: {$push: "$values.priceEarningsFy2"}
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                evRevenueLtm: 1,
                                                evRevenueFy1: 1,
                                                evRevenueFy2: 1,
                                                evEbitdaLtm: 1,
                                                evEbitdaFy1: 1,
                                                evEbitdaFy2: 1,
                                                priceEarningsLtm: 1,
                                                priceEarningsFy1: 1,
                                                priceEarningsFy2: 1
                                            }
                                        }
                                    ];

                                    var resultsCompsIndex = FeedCompaniesIndices.aggregate(pipelineCompsIndex);
                                    resultsCompsIndex.forEach(function (result) {
                                        Valuations.update({_id: valuationId}, {$set: {multiples: result}});
                                    });
                                    break;
                            }
                            break;
                        case "deals":
                            switch (valuationElement) {
                                case "security":
                                    var pipelineDeals = [
                                        //Match documents in FeedDeals collection where the '[ ]' value was selected by the user.//
                                        {
                                            $match: {
                                                _id: {
                                                    $in: valuationSelections
                                                }
                                            }
                                        },
                                        //Group all matching documents and calculate averages for each valuation metric across all selections.//
                                        {
                                            $group: {
                                                _id: null,
                                                evRevenueLtm: {$push: {$divide: ["$dealTerms.enterpriseValueDeal", "$financial.ltm.revenue"]}},
                                                evEbitdaLtm: {$push: {$divide: ["$dealTerms.enterpriseValueDeal", "$financial.ltm.ebitda"]}}
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                evRevenueLtm: 1,
                                                evEbitdaLtm: 1
                                            }
                                        }
                                    ];
                                    var resultsDeals = FeedDeals.aggregate(pipelineDeals);
                                    resultsDeals.forEach(function (valuationResults) {
                                        Valuations.update({_id: valuationId}, {$set: {multiples: valuationResults}});
                                    });
                                    break;
                                case "index":
                                    var pipelineDealsIndex = [
                                        //Match documents in FeedDealsIndices collection where the 'sector' value was selected by the user.//
                                        {
                                            $match: {
                                                _id: {$in: valuationSelections}
                                            }
                                        },
                                        {
                                            $unwind: "$values"
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                evRevenueLtm: {$push: "$values.evRevenueLtm"},
                                                evEbitdaLtm: {$push: "$values.evEbitdaLtm"}
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 0,
                                                evRevenueLtm: 1,
                                                evEbitdaLtm: 1
                                            }
                                        }
                                    ];

                                    var resultsDealsIndexValuation = FeedDealsIndices.aggregate(pipelineDealsIndex);
                                    resultsDealsIndexValuation.forEach(function (result) {
                                        Valuations.update({_id: valuationId}, {$set: {multiples: result}});
                                    });
                                    break;
                            }
                            break;
                        case "models":
                            var pipelineModels = [
                                //Match documents in Models collection where the '_id' is in valuationSelections.//
                                {
                                    $match: {
                                        _id: {
                                            $in: valuationSelections
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        enterpriseValue: "$values.enterpriseValue",
                                        pricePerShare: "$values.pricePerShare",
                                        evRevenueLtm: "$values.evRevenueLtm",
                                        evRevenueFy1: "$values.evRevenueFy1",
                                        evRevenueFy2: "$values.evRevenueFy2",
                                        evEbitdaLtm: "$values.evEbitdaLtm",
                                        evEbitdaFy1: "$values.evEbitdaFy1",
                                        evEbitdaFy2: "$values.evEbitdaFy2",
                                        priceEarningsLtm: "$values.priceEarningsLtm",
                                        priceEarningsFy1: "$values.priceEarningsFy1",
                                        priceEarningsFy2: "$values.priceEarningsFy2"
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        enterpriseValue: {$push: "$enterpriseValue"},
                                        pricePerShare: {$push: "$pricePerShare"},
                                        evRevenueLtm: {$push: "$evRevenueLtm"},
                                        evRevenueFy1: {$push: "$evRevenueFy1"},
                                        evRevenueFy2: {$push: "$evRevenueFy2"},
                                        evEbitdaLtm: {$push: "$evEbitdaLtm"},
                                        evEbitdaFy1: {$push: "$evEbitdaFy1"},
                                        evEbitdaFy2: {$push: "$evEbitdaFy2"},
                                        priceEarningsLtm: {$push: "$priceEarningsLtm"},
                                        priceEarningsFy1: {$push: "$priceEarningsFy1"},
                                        priceEarningsFy2: {$push: "$priceEarningsFy2"}
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        enterpriseValue: 1,
                                        pricePerShare: 1,
                                        evRevenueLtm: 1,
                                        evRevenueFy1: 1,
                                        evRevenueFy2: 1,
                                        evEbitdaLtm: 1,
                                        evEbitdaFy1: 1,
                                        evEbitdaFy2: 1,
                                        priceEarningsLtm: 1,
                                        priceEarningsFy1: 1,
                                        priceEarningsFy2: 1
                                    }
                                }
                            ];

                            var resultsModels = Models.aggregate(pipelineModels);
                            resultsModels.forEach(function (valuationResults) {
                                Valuations.update({_id: valuationId}, {$set: {multiples: valuationResults}});
                            });
                            break;
                        case "custom":
                            var pipelineCustom = [
                                //Match documents in Customs collection where the '_id' is in valuationSelections.//
                                {
                                    $match: {
                                        _id: {
                                            $in: valuationSelections
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        customValue: "$values.customValue",
                                        customPrice: "$values.customPrice",
                                        customMultiple: "$values.customMultiple"
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        customValue: {$push: "$customValue"},
                                        customPrice: {$push: "$customPrice"},
                                        customMultiple: {$push: "$customMultiple"}
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        customValue: 1,
                                        customPrice: 1,
                                        customMultiple: 1
                                    }
                                }
                            ];

                            var resultsCustom = Customs.aggregate(pipelineCustom);
                            resultsCustom.forEach(function (valuationResults) {
                                Valuations.update({_id: valuationId}, {$set: {multiples: valuationResults}});
                            });
                            break;
                    }
                    break;
                case "marketTypeB":
                    //
            }
        }
    }
});