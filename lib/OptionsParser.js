/* eslint-env: node */
"use strict";

const path = require("path"),
  DEFAULT_RESULT_COUNT = 10,
  DEFAULT_CSV_PATH = "result.csv",
  DEFAULT_JSON_PATH = "result-json",
  DEFAULT_SQLITE_PATH = "tweets.sqlite",
  DEFAULT_AUTH_PATH = "auth.json";

function OptionsParser() {
  var that = {};

  function parse(options) {
    var result = {
        csv: false,
        json: false,
        sqlite: false,
        count: DEFAULT_RESULT_COUNT,
      },
      authPath;

    result.command = options._[0];

    if (options.csv) {
      result.csv = true;
      result.csvPath = options.csv === true ? DEFAULT_CSV_PATH : options.csv;
    }

    if (options.json) {
      result.json = true;
      result.jsonPath = options.json === true ? DEFAULT_JSON_PATH : options.json;
    }

    if (options.sqlite) {
      result.sqlite = true;
      result.sqlitePath = options.sqlite === true ? DEFAULT_SQLITE_PATH : options.sqlite;
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
