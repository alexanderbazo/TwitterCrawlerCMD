/* eslint-env: node */
"use strict";

const Status = require("./Status.js"),
  DEFAULT_PRINT_FORMAT = "csv";

function StatusProcessor() {
  var that = {},
    input;

  function set(tweets) {
    input = tweets;
    return that;
  }

  function pack() {
    for (let i = 0; i < input.length; i++) {
      input[i] = new Status(input[i]);
    }
    return that;
  }

  function print(format) {
    for (let i = 0; i < input.length; i++) {
      let status = input[i];
      if (i === 0) {
        console.log(status.getCSVHeader());
      }
      console.log(status.to(format || DEFAULT_PRINT_FORMAT));
    }
    return that;
  }

  that.set = set;
  that.pack = pack;
  that.print = print;
  return that;
}

module.exports = StatusProcessor;
