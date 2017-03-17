/* eslint-env: node */
"use strict";

const TwitterClient = require("./TwitterClient.js"),
  StatusProcessor = require("./StatusProcessor"),
  Commands = {
    TIMELINE: "timeline",
  };

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

  function run(options) {
    setAuth(options.auth);
    processor = new StatusProcessor();
    switch (options.command) {
      case Commands.TIMELINE:
        getTimeline(options);
        break;
      default:
        break;
    }
  }

  that.run = run;
  return that;
}

module.exports = new TwitterInterface();
