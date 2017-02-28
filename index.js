/* eslint-env */
"use strict";

var TwitterInterface = require("./lib/TwitterInterface"),
	OptionsParser = require("./lib/OptionsParser.js");

(function run(argv) {
  var options;
  argv.dirname = __dirname;
  options = OptionsParser.parse(argv);
  TwitterInterface.run(options);
}(require("optimist").argv));
