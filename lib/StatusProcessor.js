/* eslint-env: node */
"use strict";

const Status = require("./Status.js"),
  fs = require("fs"),
  mkdirp = require("mkdirp"),
  path = require("path");

function StatusProcessor() {
  var that = {},
    input,
    options;

  function init(options_) {
    options = options_;
    return that;
  }

  function set(input_) {
    input = input_;
    return that;
  }

  function pack() {
    for (let i = 0; i < input.length; i++) {
      input[i] = new Status(input[i]);
    }
    return that;
  }

  function saveAsCSV(filename) {
    var printer = fs.createWriteStream(filename);
    for (let i = 0; i < input.length; i++) {
      let status = input[i];
      if (i === 0) {
        printer.write(status.getCSVHeader() + "\n");
      }
      printer.write(status.asCSV() + "\n");
    }
    printer.end();
  }

  function saveAsJSON(foldername) {
    mkdirp(foldername, function(err) {
      if (err) {
        console.error(err);
      } else {
        for (let i = 0; i < input.length; i++) {
          let status = input[i],
            file = path.join(foldername, status.id + ".json");
          fs.writeFileSync(file, status.asJSON());
        }
      }
    });
  }

  function save() {
    if (options.csv === true) {
      saveAsCSV(options.csvPath);
    }
    if (options.json === true) {
      saveAsJSON(options.jsonPath);
    }
  }

  function store() {
    return that;
  }

  function clean() {
    input = undefined;
  }

  that.init = init;
  that.set = set;
  that.pack = pack;
  that.save = save;
  that.store = store;
  that.clean = clean;
  return that;
}

module.exports = StatusProcessor;
