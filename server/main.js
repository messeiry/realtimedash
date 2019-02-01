import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});








if (Meteor.isServer) {
  Meteor.startup(function() {
    return Meteor.methods({
      removeAllData: function() {
        return Perfmon.remove({});
      }
    });
  });
}



