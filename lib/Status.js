/* eslint-env: node */
"use strict";

// TODO: Think about sourceTweet
function Status(source, isSourceTweet) {
  this.user = {};
  this.id = source.id_str;
  this.createdAt = (new Date(source.created_at)).getTime();
  this.text = source.text;
  this.isRetweet = source.retweeted_status ? true : false;
  this.isQuote = source.quoted_status ? true : false;
  this.favouriteCount = source.favorite_count;
  this.retweetCount = source.retweet_count;
  if (this.isRetweet) {
    this.sourceTweet = source.retweeted_status ? new Status(source.retweeted_status, true) :
      null;
  }
  if (this.isQoute) {
    this.sourceTweet = source.quoted_status ? new Status(source.quoted_status, true) :
      null;
  }
  this.lang = source.lang;
  this.coordinantes = source.coordinantes;
  this.inReplyToStatus = source.in_reply_to_status_id_str;
  this.inReplyToUser = source.in_reply_to_user_id_str;
  this.urls = source.entities.urls;
  this.hashtags = source.entities.hashtags;
  this.user.id = source.user.id_str;
  this.user.screenname = source.user.screen_name;
  this.user.createdAt = (new Date(source.user.created_at)).getTime();
  this.user.isVerified = source.user.verified;
  this.user.location = source.user.location;
  this.user.profileImageUrl = source.user.profile_image_url;
  this.user.hasDefaultProfileTheme = source.user.default_profile;
  this.user.hasDefaultProfileImage = source.user.default_profile_image;
  this.sentimentScores = {
    positive: 1,
    negative: -1,
  };
  this.isSourceTweet = isSourceTweet || false;
}

Status.prototype.DEFAULT_CSV_DELIMITER = ",";

Status.prototype.setSentimentScores = function(positive, negative) {
  this.sentimentScores.positive = positive;
  this.sentimentScores.negative = negative;
};

Status.prototype.getUrlsAsCSVList = function() {
  var urls = [];
  if (this.urls) {
    for (let i = 0; i < this.urls.length; i++) {
      urls.push(this.urls[i].expanded_url);
    }
  }
  return urls.join(",");
};

Status.prototype.getHashtagsAsCSVList = function() {
  var hashtags = [];
  if (this.hashtags) {
    for (let i = 0; i < this.hashtags.length; i++) {
      hashtags.push(this.hashtags[i].text);
    }
  }
  return hashtags.join(",");
};

Status.prototype.asJSON = function() {
  return JSON.stringify(this);
};

Status.prototype.asCSV = function(delimiter) {
  var elements = [];
  elements.push("\"" + String(this.id) + "\"");
  elements.push("\"" + String(this.createdAt) + "\"");
  elements.push("\"" + String(this.text.replace(/(\r\n|\n|\r)/gm, "")) + "\"");
  elements.push("\"" + String(this.isRetweet) + "\"");
  elements.push("\"" + String(this.isQuote) + "\"");
  elements.push("\"" + String(this.lang) + "\"");
  elements.push("\"" + String(this.inReplyToStatus) + "\"");
  elements.push("\"" + String(this.inReplyToUser) + "\"");
  elements.push("\"" + String(this.getUrlsAsCSVList()) + "\"");
  elements.push("\"" + String(this.getHashtagsAsCSVList()) + "\"");
  elements.push("\"" + String(this.favouriteCount) + "\"");
  elements.push("\"" + String(this.retweetCount) + "\"");
  elements.push("\"" + String(this.sentimentScores.positive) + "\"");
  elements.push("\"" + String(this.sentimentScores.negative) + "\"");
  elements.push("\"" + String(this.user.id) + "\"");
  elements.push("\"" + String(this.user.screenname) + "\"");
  elements.push("\"" + String(this.user.createdAt) + "\"");
  elements.push("\"" + String(this.user.isVerified) + "\"");
  elements.push("\"" + String(this.user.location) + "\"");
  elements.push("\"" + String(this.user.profileImageUrl) + "\"");
  elements.push("\"" + String(this.user.hasDefaultProfileTheme) + "\"");
  elements.push("\"" + String(this.user.hasDefaultProfileImage) + "\"");
  return elements.join(delimiter || this.DEFAULT_CSV_DELIMITER);
};

Status.prototype.asSQLiteValues = function() {
  var elements = [];
  elements.push(String(this.id));
  elements.push(String(this.createdAt));
  elements.push(String((new Date()).getTime()));
  elements.push("\"" + String(this.text.replace(/(\r\n|\n|\r)/gm, "")) + "\"");
  elements.push(String(this.isRetweet ? 1 : 0));
  elements.push(String(this.isQuote ? 1 : 0));
  elements.push(String(this.retweetCount));
  elements.push(String(this.favouriteCount));
  elements.push(String("\"" + this.lang) + "\"");
  elements.push(String(this.user.id));
  elements.push(String(this.inReplyToUser));
  elements.push(String(this.inReplyToStatus));
  elements.push(String(this.isSourceTweet ? 1 : 0));
  elements.push(String(this.sentimentScores.positive));
  elements.push(String(this.sentimentScores.negative));
  return elements;
};

Status.prototype.userAsSQLiteValues = function() {
  var elements = [];
  elements.push(String(this.user.id));
  elements.push("\"" + String(this.user.screenname) + "\"");
  elements.push("\"" + String(this.user.location) + "\"");
  elements.push("\"" + String(this.user.profileImageUrl) + "\"");
  elements.push(String(this.user.createdAt));
  elements.push(String(this.user.isVerified ? 1 : 0));
  elements.push(String(this.user.hasDefaultProfileTheme ? 1 : 0));
  elements.push(String(this.user.hasDefaultProfileImage ? 1 : 0));
  return elements;
};

Status.prototype.getCSVHeader = function(delimiter) {
  var header = ["ID", "CREATED_AT", "TEXT", "IS_RETWEET", "IS_QUOTE", "LANG",
    "IN_REPLY_TO_STATUS", "IN_REPLY_TO_USER", "USED_URLS", "USED_HASHTAGS", "FAVOURITE_COUNT", "RETWEET_COUNT",
    "POSITIVE_SENTIMENT_SCORE", "NEGATIVE_SENTIMENT_SCORE",
    "USER_ID", "USER_SCREENNAME", "USER_CREATED_AT", "USER_IS_VERIFIED",
    "USER_LOCATION", "USER_PROFILE_IMAGE_URL", "USER_HAS_DEFAULT_PROFIL",
    "USER_HAS_DEFAULT_PROFIL_IMAGE",
  ];
  return header.join(delimiter || this.DEFAULT_CSV_DELIMITER);
};

module.exports = Status;
