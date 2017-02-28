/* eslint-env: node */
"use strict";

const sqlite3 = require("sqlite3");

function SQLiteAdapter() {
  var that = {},
    db;

  function storeUser(tweet, stmt) {
    var values = tweet.userAsSQLiteValues();
    try {
      stmt.run(values);
    } catch (error) {
      console.log(error);
    }
  }

  function storeTweet(tweet, stmt) {
    var values = tweet.asSQLiteValues();
    try {
      stmt.run(values);
    } catch (error) {
      console.log(error);
    }
  }

  // INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)VALUES (1, 'Paul', 32, 'California', 20000.00 );
  function storeTweets(tweets) {
    var tweetStmt = db.prepare("INSERT INTO tweet VALUES (?,?,?,?,?,?,?,?)"),
      userStmt = db.prepare("INSERT INTO user VALUES (?,?,?,?,?,?,?,?)");
    for (let i = 0; i < tweets.length; i++) {
      storeTweet(tweets[i], tweetStmt);
      storeUser(tweets[i], userStmt);
    }
    tweetStmt.finalize();
    userStmt.finalize();
    return that;
  }

  function open(file) {
    db = new sqlite3.Database(file);
    return that;
  }

  function close() {
    if (db) {
      db.close();
    }
    return that;
  }

  that.open = open;
  that.close = close;
  that.storeTweets = storeTweets;
  return that;
}

module.exports = SQLiteAdapter;
