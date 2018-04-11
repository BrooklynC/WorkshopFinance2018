Notifications = new Mongo.Collection('notifications');

NotificationsSchema = new SimpleSchema({
  creatorId: {
    type: String,
    label: "Creator ID",
    optional: true
  },
  creator: {
    type: String,
    label: "Creator",
    optional: true
  },
  receiverId: {
    type: String,
    label: "Receiver ID",
    optional: true
  },
  receiver: {
    type: String,
    label: "Receiver",
    optional: true
  },
  action: {
    type: String,
    label: "Notification - Action",
    allowedValues: ["send","share"]
  },
  itemId: {
    type: String,
    label: "Item ID",
    optional: true
  },
  item: {
    type: String,
    label: "Item Sent",
    allowedValues: ["football","valuation","target"],
    optional: true
  },
  created: {
    type: Date,
    label: "Date Added",
    optional: true
  },
  read: {
    type: Boolean,
    label: "Read",
    defaultValue: false,
    optional: true
  }
});

Notifications.attachSchema(NotificationsSchema);
