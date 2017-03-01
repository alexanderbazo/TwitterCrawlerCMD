/* eslint-env: node */
"use strict";

const Status = require("./Status.js"),
  SQLiteAdapter = require("./SQLiteAdapter.js"),
  fs = require("fs"),
  mkdirp = require("mkdirp"),
  path = require("path");

function StatusProcessor() {
  var that = {},
    input,
    results,
    options;

  /**
   * Initializes the processor
   * @param  {Object} options_ An options object aquirred from OptionsParser
   * @return {Object} Returns the called instance of StatusProcessor} 
   */
  function init(options_) {
    options = options_;
    return that;
  }

  /**
   * Sets the tweets to be processed
   * @param {Array} input_ An array of tweets aquirred from TwitterClient
   * @return {Object} Returns the called instance of StatusProcessor} 
   */
  function set(input_) {
    input = input_;
    return that;
  }

  /**
   * Creates a result set by transforming each raw input tweet into an Status object
   * @return {Object} Returns the called instance of StatusProcessor} 
   */
  function pack() {
    results = [];
    for (let i = 0; i < input.length; i++) {
      results[i] = new Status(input[i]);
    }
    return that;
  }

  function augment() {
    return that;
  }

  /**
   * Saves the current result set to disk if either csv or json options are set to TRUE
   * @return {Object} Returns the called instance of StatusProcessor
   */
  function save() {
    if (options.csv === true) {
      saveAsCSV(options.csvPath);
    }
    if (options.json === true) {
      saveAsJSON(options.jsonPath);
    }
    return that;
  }

  /**
   * Stores the current result set to a database if the sqlite option is set to TRUE
   * @return {Object} Returns the called instance of StatusProcessor
   */
  function store() {
    if (options.sqlite === true) {
      storeInSQLite(options.sqlitePath);
    }
    return that;
  }

  /**
   * Returns the current result set
   * @return {Array} An array with the proccessed tweets
   */
  function getResults() {
    return results;
  }

  function saveAsCSV(filename) {
    var printer = fs.createWriteStream(filename);
    for (let i = 0; i < results.length; i++) {
      let status = results[i];
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
        for (let i = 0; i < results.length; i++) {
          let status = results[i],
            file = path.join(foldername, status.id + ".json");
          fs.writeFileSync(file, status.asJSON());
        }
      }
    });
  }

  function storeInSQLite(filename) {
    var db = new SQLiteAdapter();
    db.open(filename).storeTweets(results).close();
  }

  that.init = init;
  that.set = set;
  that.pack = pack;
  that.augment = augment;
  that.save = save;
  that.store = store;
  that.results = getResults;
  return that;
}

module.exports = StatusProcessor;
