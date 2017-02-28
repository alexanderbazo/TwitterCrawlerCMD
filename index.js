/* eslint-env */
"use strict";

const DEFAULT_CONFIG = {
  debug: false,
  format: "csv",
  count: 100,
  authPath: "./auth.json",
};

var TwitterInterface = require("./lib/TwitterInterface");

(function run(argv) {
  var cli = new TwitterInterface(),
    command = argv._[0],
    authPath = argv.auth || DEFAULT_CONFIG.authPath,
    auth = require(authPath);

  cli.setAuth(auth);
  cli.run(command, {
    debug: argv.debug || DEFAULT_CONFIG.debug,
    format: argv.format || DEFAULT_CONFIG.format,
    count: argv.count || DEFAULT_CONFIG.count,
  });
}(require("optimist").argv));
