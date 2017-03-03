/* eslint-env: node */
"use strict";

const sqlite3 = require("sqlite3");

function SQLiteAdapter() {
  var that = {},
    db;

  function onError(onError) {
  
  }

  function storeUser(tweet) {
    var stmt = db.prepare("INSERT INTO user VALUES (?,?,?,?,?,?,?,?)");
    try {
      stmt.run(tweet.userAsSQLiteValues(), onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function storeTweet(tweet) {
    var stmt = db.prepare(
      "INSERT INTO tweet VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    try {
      stmt.run(tweet.asSQLiteValues(), onError);
      stmt.finalize();
      if(tweet.hasSourceTweet) {
        storeTweet(tweet.sourceTweet);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function storeTweets(tweets) {
    db.serialize(function() {
      for (let i = 0; i < tweets.length; i++) {
        // TODO: Store source tweets
        // TODO: Store Hashtags and Urls
        storeTweet(tweets[i]);
        storeUser(tweets[i]);
      }
    });
  }

  function identifyNewTweets(tweets, callback) {
    callback();
  }

  function open(file) {
    db = new sqlite3.Database(file);
  }

  function close() {
    if (db) {
      db.close();
    }
  }

  that.open = open;
  that.close = close;
  that.identifyNewTweets = identifyNewTweets;
  that.storeTweets = storeTweets;
  return that;
}

module.exports = SQLiteAdapter;
