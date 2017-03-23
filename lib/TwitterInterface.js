/* eslint-env: node */
"use strict";

const TwitterClient = require("./TwitterClient.js"),
  StatusProcessor = require("./StatusProcessor.js"),
  Commands = require("./Commands.js");

function TwitterInterface() {
  var that = {},
    client,
    processor;

  function setAuth(auth) {
    client = new TwitterClient(auth);
  }

  function getTimeline(options) {
    client.getHomeTimeline(options.count, function(results) {
      processor.init(options);
      processor.set(results);
      processor.run().then(function() {
        // TODO: Print stats here (and add logger module)
      });
    });
  }

  function getUserTimeline(options) {
    client.getUserTimeline(options.count, options.user, function(results) {
      processor.init(options);
      processor.set(results);
      processor.run().then(function() {
        // TODO: Print stats here (and add logger module)
      });
    });
  }

  function augmentUserData(options) {
    var data = require(options.data);
    processor.init(options);
    processor.augmentUserData(data);
  }

  function run(options) {
    setAuth(options.auth);
    processor = new StatusProcessor();
    switch (options.command) {
      case Commands.TIMELINE:
        getTimeline(options);
        break;
      case Commands.USER_TIMELINE:
        getUserTimeline(options);
        break;
      case Commands.AUGMENT_USER_DATA:
        augmentUserData(options);
        break;
      default:
        break;
    }
  }

  that.run = run;
  return that;
}

module.exports = new TwitterInterface();
