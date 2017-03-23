/* eslint-env: node */
"use strict";

const sqlite3 = require("sqlite3");

function SQLiteAdapter() {
  var that = {},
    db;

  function onError(onError) {

  }

  function storeSourceRelation(tweet) {
    var isRetweet = tweet.isRetweet ? 1 : 0,
      isQoute = tweet.isQoute ? 1 : 0,
      stmt = db.prepare(
        "INSERT OR IGNORE INTO sources_to_tweets VALUES (?,?,?,?)");
    try {
      stmt.run([tweet.id, tweet.sourceTweet.id, isRetweet, isQoute, ], onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function storeTagRelation(tweetId, tagId) {
    var stmt = db.prepare("INSERT OR IGNORE INTO tags_to_tweets VALUES (?,?)");
    try {
      stmt.run([tagId, tweetId, ], onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function storeUrlRelation(tweetId, urlId) {
    var stmt = db.prepare("INSERT OR IGNORE INTO urls_to_tweets VALUES (?,?)");
    try {
      stmt.run([urlId, tweetId, ], onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function storeTag(tag, tweetId, tagId) {
    var stmt = db.prepare("INSERT OR IGNORE INTO tag VALUES (?,?)");
    if (tagId) {
      storeTagRelation(tweetId, tagId);
    } else {
      stmt.run([null, tag, ], function(err) {
        if (!err) {
          storeTagRelation(tweetId, this.lastID);
        }
        stmt.finalize();
      });
    }
  }

  function storeUrl(url, tweetId, urlId) {
    var stmt = db.prepare("INSERT OR IGNORE INTO url VALUES (?,?,?,?)");
    if (urlId) {
      storeUrlRelation(tweetId, urlId);
    } else {
      stmt.run([null, url, ], function(err) {
        if (!err) {
          storeUrlRelation(tweetId, this.lastID);
        }
        stmt.finalize();
      });
    }
  }

  function storeTags(tweet) {
    for (let i = 0; i < tweet.hashtags.length; i++) {
      let tag = "\"" + tweet.hashtags[i].text + "\"";
      getTagId(tag, storeTag.bind(this, tag, tweet.id));
    }
  }

  function storeUrls(tweet, storeHTMLContent) {
    for (let i = 0; i < tweet.urls.length; i++) {
      let url = "\"" + tweet.urls[i].expanded_url + "\"";
      getUrlId(url, storeUrl.bind(this, url, tweet.id));
    }
  }

  function storeUser(tweet) {
    var stmt = db.prepare("INSERT OR IGNORE INTO user VALUES (?,?,?,?,?,?,?,?,?,?)");
    try {
      stmt.run(tweet.userAsSQLiteValues(), onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function storeTweet(tweet, storeHTMLContent) {
    var stmt = db.prepare(
      "INSERT OR IGNORE INTO tweet VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    try {
      stmt.run(tweet.asSQLiteValues(), onError);
      stmt.finalize();
      if (tweet.sourceTweet) {
        storeTweet(tweet.sourceTweet);
        storeSourceRelation(tweet);
      }
      if (tweet.hashtags.length > 0) {
        storeTags(tweet);
      }
      if (tweet.urls.length > 0) {
        storeUrls(tweet, storeHTMLContent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getTweetsByValues(values, callback) {
    db.all("SELECT CAST(id as TEXT) AS id FROM tweet WHERE id IN (" + values +
      ")",
      function(error,
        rows) {
        if (error === null) {
          for (let i = 0; i < rows.length; i++) {
            rows[i] = rows[i].id;
          }
          callback(rows);
        }
      });
  }

  function getTagId(tag, callback) {
    let stmt = db.prepare("SELECT id FROM tag WHERE text LIKE '?' LIMIT 1");
    try {
      stmt.get([null, tag, ], function(err,
        row) {
        if (row) {
          callback(row.id);
        } else {
          callback(undefined);
        }
        stmt.finalize();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function getUrlId(url, callback) {
    let stmt = db.prepare("SELECT id FROM url WHERE url LIKE '?' LIMIT 1");
    try {
      stmt.get([null, url, ], function(err,
        row) {
        if (row) {
          callback(row.id);
        } else {
          callback(undefined);
        }
        stmt.finalize();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function identifyNewTweets(tweets, callback) {
    var values = [];
    for (let i = 0; i < tweets.length; i++) {
      values.push(tweets[i].id);
    }
    values = values.join(", ");
    getTweetsByValues(values, function(idsFromKnownTweets) {
      for (let i = 0; i < tweets.length; i++) {
        if (idsFromKnownTweets.indexOf(tweets[i].id) !== -1) {
          tweets.splice(i, 1);
        }
      }
      callback(tweets);
    });
  }

  // This does not seem to run serialized  which might be a problem
  function storeTweets(tweets, storeHTMLContent) {
    db.serialize(function() {
      for (let i = 0; i < tweets.length; i++) {
        storeTweet(tweets[i], storeHTMLContent);
        storeUser(tweets[i]);
      }
    });
  }

  function updateUserData(user) {
    let stmt = db.prepare("UPDATE user SET party = ?, origin = ? WHERE screenName = ?");
    try {
      stmt.run(["\""+user.party+"\"", "\""+user.origin+"\"", "\""+user.screen_name+"\"",], onError);
      stmt.finalize();
    } catch (error) {
      console.log(error);
    }
  }

  function addUserData(data) {
    for (let i = 0; i < data.length; i++) {
      let user = data[i];
      if (user["screen_name"] !== "null" && user["screen_name"] !== "") {
        updateUserData(user);
      }
    }
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
  that.addUserData = addUserData;
  return that;
}

module.exports = SQLiteAdapter;
