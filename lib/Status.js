/* eslint-env: node */
"use strict";

function Status(source) {
  this.id = source.id;
  this.createdAt = (new Date(source.created_at)).getTime();
  this.text = source.text;
  this.isRetweet = source.retweeted_status ? true : false;
  this.lang = source.lang;
  this.coordinantes = source.coordinantes;
  this.inReplyToStatus = source.in_reply_to_status_id;
  this.inReplyToUser = source.in_reply_to_user_id;
  this.urls = source.entities.urls;
  this.hashtags = source.entities.hashtags;
  this.userId = source.user.id;
  this.userScreenname = source.user.screen_name;
  this.userCreatedAt = (new Date(source.user.create_at)).getTime();
  this.userIsVerified = source.user.verified;
  this.userLocation = source.user.location;
  this.userProfileImageUrl = source.user.profile_image_url;
  this.userHasDefaultProfileTheme = source.user.default_profile;
  this.userHasDefaultProfileImage = source.user.default_profile_image;
}

Status.prototype.DEFAULT_CSV_DELIMITER = ",";

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

Status.prototype.toJSON = function() {
  return JSON.stringify(this);
};

Status.prototype.toCSV = function(delimiter) {
  var elements = [];
  elements.push("\"" + String(this.id) + "\"");
  elements.push("\"" + String(this.createdAt) + "\"");
  elements.push("\"" + String(this.text.replace(/(\r\n|\n|\r)/gm, "")) + "\"");
  elements.push("\"" + String(this.isRetweet) + "\"");
  elements.push("\"" + String(this.lang) + "\"");
  elements.push("\"" + String(this.inReplyToStatus) + "\"");
  elements.push("\"" + String(this.inReplyToUser) + "\"");
  elements.push("\"" + String(this.getUrlsAsCSVList()) + "\"");
  elements.push("\"" + String(this.getHashtagsAsCSVList()) + "\"");
  elements.push("\"" + String(this.userId) + "\"");
  elements.push("\"" + String(this.userScreenname) + "\"");
  elements.push("\"" + String(this.userCreatedAt) + "\"");
  elements.push("\"" + String(this.userIsVerified) + "\"");
  elements.push("\"" + String(this.userLocation) + "\"");
  elements.push("\"" + String(this.userProfileImageUrl) + "\"");
  elements.push("\"" + String(this.userHasDefaultProfileTheme) + "\"");
  elements.push("\"" + String(this.userHasDefaultProfileImage) + "\"");
  return elements.join(delimiter || this.DEFAULT_CSV_DELIMITER);
};

Status.prototype.getCSVHeader = function(delimiter) {
  var header = ["ID", "CREATED_AT", "TEXT", "IS_RETWEET", "LANG",
    "IN_REPLY_TO_STATUS", "IN_REPLY_TO_USER", "USED_URLS", "USED_HASHTAGS",
    "USER_ID", "USER_SCREENNAME", "USER_CREATED_AT", "USER_IS_VERIFIED",
    "USER_LOCATION", "USER_PROFILE_IMAGE_URL", "USER_HAS_DEFAULT_PROFIL",
    "USER_HAS_DEFAULT_PROFIL_IMAGE",
  ];
  return header.join(delimiter || this.DEFAULT_CSV_DELIMITER);
};

Status.prototype.to = function(format) {
  switch (format) {
    case "csv":
      return this.toCSV();
    case "json":
      return this.toJSON();
    default:
      return null;
  }
};

module.exports = Status;