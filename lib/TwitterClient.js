/* eslint-env: node */
"use strict";

const Twitter = require("twitter"),
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

  function getPagedTweets(route, callback, params, count, results, maxId) {
    var currentResults = results || [],
      requestParams = params || DEFAULT_PARAMS;
    // TODO: Use params.count to optimize last call and try not to use a count value > 200 (maximal results per call)
    requestParams.count = count < MAX_RESULTS_PER_TIMELINE_REQUEST ? count :
      MAX_RESULTS_PER_TIMELINE_REQUEST;
    if (maxId) {
      requestParams.max_id = maxId;
    }
    api.get(route, requestParams).then(function(tweets) {
      currentResults = currentResults.concat(tweets);
      // TODO: Check if something does not add up here
      if (currentResults.length < count && tweets.length !== 0) {
        let lastId = tweets[tweets.length - 1].id;
        getPagedTweets(route, callback, params, count, currentResults, lastId);
      } else {
        callback(currentResults);
      }
    }).catch(function(e) {
      console.log(e);
    });
  }

  function getHomeTimeline(count, callback) {
    getPagedTweets("statuses/home_timeline", function(tweets) {
      if (tweets) {
        callback(tweets.slice(0, count));
      } else {
        callback(undefined);
      }
    }, count);
  }

  function getUserTimeline(count, user, callback) {
    var params = DEFAULT_PARAMS;
    params.screen_name = user;
    getPagedTweets("statuses/user_timeline", function(tweets) {
      if (tweets) {
        callback(tweets.slice(0, count));
      } else {
        callback(undefined);
      }
    }, params, count);
  }

  api = new Twitter(auth);
  that.getHomeTimeline = getHomeTimeline;
  that.getUserTimeline = getUserTimeline;
  return that;
}

module.exports = TwitterClient;
