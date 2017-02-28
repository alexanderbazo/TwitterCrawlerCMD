/* eslint-env: node */
"use strict";

const TwitterClient = require("./TwitterClient.js"),
  StatusProcessor = require("./StatusProcessor");

function TwitterInterface() {
  var that = {},
    client,
    processor;

  function setAuth(auth) {
    client = new TwitterClient(auth);
  }

  function getTimeline(options) {
    client.getHomeTimeline(options.count).then(function(results) {
      processor.set(results).pack().print();
    });
  }

  function run(command, options) {
    processor = new StatusProcessor();
    switch (command) {
      case "timeline":
        getTimeline(options);
        break;
      default:
        break;
    }
  }

  that.setAuth = setAuth;
  that.run = run;
  return that;
}

module.exports = TwitterInterface;
