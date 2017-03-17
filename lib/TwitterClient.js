/* eslint-env: node */
"use strict";

const Twitter = require("twitter"),
  Promise = require("promise"),
  MAX_RESULTS_PER_TIMELINE_REQUEST = 200;

/* eslint-disable camelcase */
function TwitterClient(auth) {
  const DEFAULT_PARAMS = {
    count: MAX_RESULTS_PER_TIMELINE_REQUEST,
    trim_user: false,
    exclude_replies: false,
    include_entities: true,
  };
  var that = {},
    api;

  function getPagedTweets(route, callback, count, results, maxId) {
    var currentResults = results || [],
      params = DEFAULT_PARAMS;
    // TODO: Use params.count to optimize last call and try not to use a count value > 200 (maximal results per call)
    params.count = count < MAX_RESULTS_PER_TIMELINE_REQUEST ? count : MAX_RESULTS_PER_TIMELINE_REQUEST;
    if (maxId) {
      params.max_id = maxId;
    }
    api.get(route, params).then(function(tweets) {
      currentResults = currentResults.concat(tweets);
      // TODO: Check if something does not add up here
      if (currentResults.length < count && tweets.length !== 0) {
        let lastId = tweets[tweets.length - 1].id;
        getPagedTweets(route, callback, count, currentResults, lastId);
      } else {
        callback(currentResults);
      }
    }).catch(function(e) {
      console.log(e);
    });
  }

  function getHomeTimeline(count) {
    return new Promise(function(resolve, reject) {
      getPagedTweets("statuses/home_timeline", function(tweets) {
        if (tweets) {
          resolve(tweets.slice(0, count));
        } else {
          reject();
        }
      }, count);
    });
  }

  api = new Twitter(auth);
  that.getHomeTimeline = getHomeTimeline;
  return that;
}

module.exports = TwitterClient;
