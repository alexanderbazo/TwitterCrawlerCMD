/* eslint-env: node */
"use strict";

const Status = require("./Status.js"),
  SQLiteAdapter = require("./SQLiteAdapter.js"),
  fs = require("fs"),
  Promise = require("promise"),
  mkdirp = require("mkdirp"),
  path = require("path"),
  exec = require("child_process").execSync;

function StatusProcessor() {
  var that = {},
    input,
    results,
    options,
    stats;

  function clear() {
    input = undefined;
    options = undefined;
    results = undefined;
    stats = {
      started: undefined,
      finished: undefined,
      processedTweets: undefined,
      processingTime: undefined,
      newTweets: undefined,
      usedSQL: false,
      usedCSV: false,
      usedJSON: false,
    };
  }

  /**
   * Initializes the processor
   * @param  {Object} options_ An options object aquirred from OptionsParser
   * @return {Object} Returns the called instance of StatusProcessor.
   */
  function init(options_) {
    clear();
    options = options_;
    return that;
  }

  /**
   * Sets the tweets to be processed
   * @param {Array} input_ An array of tweets aquirred from TwitterClient
   * @return {Object} Returns the called instance of StatusProcessor.
   */
  function set(input_) {
    input = input_;
    stats.processedTweets = input.length;
    return that;
  }

  function run() {
    return new Promise(function(resolve, reject) {
      if (input === undefined || options === undefined) {
        reject("Call init() and set() before running processor");
      } else {
        stats.started = (new Date).getTime();
        pack().then(removeDuplicates).then(augment).then(save).then(
          store).then(function(){
            stats.finished = (new Date).getTime();
            stats.processingTime = stats.finished - stats.started;
            resolve();
          });
      }
    });
  }

  /**
   * Creates a result set by transforming each raw input tweet into an Status object
   * @return {Promise} Returns a Promise that will be resolved when the result set was created. 
   */
  function pack() {
    return new Promise(function(resolve) {
      results = [];
      for (let i = 0; i < input.length; i++) {
        results[i] = new Status(input[i]);
      }
      resolve();
    });
  }

  /**
   * Compares the current result set to the sqlite database and removes any duplicate tweets from the set if the sqlite option is set
   * @return {Promise} Returns a promise that will be resolved when the comparison is finished. If the sqlite option is not set, the promise resolves immediately.
   */
  function removeDuplicates() {
    return new Promise(function(resolve) {
      if (options.sqlite === true) {
        let db = new SQLiteAdapter();
        db.open(options.sqlitePath);
        db.identifyNewTweets(results, function(tweets) {
          results = tweets;
          stats.newTweets = results.length;
          db.close();
          resolve();
        });
      }
    });
  }

  /**
   * Augments each tweet in the current result set with a sentiment score if the sentistrength option is set
   * @return {Promise} Returns a promise that will be resolved when each tweet was augmented. If the sentistrength option is not set, the promise resolves immediately. 
   */
  function augment() {
    return new Promise(function(resolve) {
      if (options.sentistrength === true) {
        addSentimentValuesToResults(options.sentistrengthPath);
      }
      resolve();
    });
  }

  /**
   * Saves the current result set to disk if either csv or json options are set to TRUE
   * @return {Promise} Returns a Promise that will be resolved when the result set was saved to disk.  If neither the csv nor the json option is set, the promise resolves immediately.
   */
  function save() {
    return new Promise(function(resolve) {
      if (options.csv === true) {
        saveAsCSV(options.csvPath);
        stats.usedCSV = true;
      }
      if (options.json === true) {
        saveAsJSON(options.jsonPath);
        stats.usedJSON = true;
      }
      resolve();
    });
  }

  /**
   * Stores the current result set to a database if the sqlite option is set to TRUE
   * @return {Promise} Returns a Promise that will be resolve when the result set was stored in the database.  If the sqlite option is not set, the promise resolves immediately.
   */
  function store() {
    return new Promise(function(resolve) {
      if (options.sqlite === true) {
        storeInSQLite(options.sqlitePath);
        stats.usedSQL = true;
      }
      resolve();
    });
  }

  /**
   * Returns the current result set
   * @return {Array} Returns an array with the proccessed tweets.
   */
  function getResults() {
    return results;
  }

  function getStats() {
    return stats;
  }

  function addSentimentValuesToResults(sentistrengthPath) {
    for (let i = 0; i < results.length; i++) {
      let status = results[i],
        jarPath = path.join(sentistrengthPath, "sentistrength.jar"),
        dataPath = path.join(sentistrengthPath, "data/"),
        command = "java -jar " + jarPath + " sentidata " + dataPath +
        " text \"" +
        status.text + "\"",
        result;
      try {
        result = exec(command).toString().trim().split(" ");
        if (!isNaN(result[0]) && !isNaN(result[1])) {
          status.setSentimentScores(result[0], result[1]);
        }
      } catch (error) {
        //console.log(error);
      }
    }
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

  function storeInSQLite(filename, callback) {
    var db = new SQLiteAdapter();
    db.open(filename);
    db.storeTweets(results);
    // TODO: Close Database after all (async) tasks have finished
    //db.close();
  }

  that.init = init;
  that.set = set;
  that.run = run;
  that.pack = pack;
  that.removeDuplicates = removeDuplicates;
  that.augment = augment;
  that.save = save;
  that.store = store;
  that.results = getResults;
  that.getStats = getStats;
  return that;
}

module.exports = StatusProcessor;
