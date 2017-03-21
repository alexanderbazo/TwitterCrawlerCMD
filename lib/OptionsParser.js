/* eslint-env: node */
"use strict";

const path = require("path"),
  Commands = require("./Commands.js"),
  DEFAULT_RESULT_COUNT = 10,
  DEFAULT_SQLITE_PATH = "tweets.sqlite",
  DEFAULT_SENTISTRENGTH_PATH = "sentistrength",
  DEFAULT_AUTH_PATH = "auth.json";

function OptionsParser() {
  var that = {};

  function parse(options) {
    var result = {
        sqlite: false,
        html: false,
        log: false,
        count: DEFAULT_RESULT_COUNT,
      },
      authPath;

    result.command = options._[0];

    if(result.command === Commands.USER_TIMELINE) {
      result.user = options._[1];
    }

    if (options.sqlite) {
      result.sqlite = true;
      result.sqlitePath = options.sqlite === true ? DEFAULT_SQLITE_PATH :
        options.sqlite;
    }

    if (options.html) {
      result.html = true;
    }

    if (options.log) {
      result.log = true;
    }

    if (options.sentistrength) {
      result.sentistrength = true;
      result.sentistrengthPath = options.sentistrength === true ?
        DEFAULT_SENTISTRENGTH_PATH :
        options.sentistrength;
    }

    if (options.count) {
      result.count = options.count === true ? DEFAULT_RESULT_COUNT : options.count;
    }

    if (options.auth) {
      authPath = path.join(options.dirname, options.auth);
    } else {
      authPath = path.join(options.dirname, DEFAULT_AUTH_PATH);
    }
    result.auth = require(authPath);

    return result;
  }

  that.parse = parse;
  return that;
}

module.exports = new OptionsParser();
