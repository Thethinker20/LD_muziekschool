const path = require("path");
const merge = require("lodash/merge");

const config = {
    all: {
      env: process.env.NODE_ENV || "development",
      root: path.join(__dirname, ".."),
      port: process.env.PORT || 4000,
      ip: process.env.IP || "localhost",
      apiRoot: process.env.API_ROOT || "",
      // >>> Here is where the environment
      // variables are set to config object.
      // This object is exported.
      //
      mongo: {
        options: {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true
        }
      }
    },
    test: {},
    development: {
      mongo: {
        uri: process.env.MONGODB_URI,
        options: {
          debug: true
        }
      }
    },
    production: {
      ip: process.env.IP || undefined,
      port: process.env.PORT || 8080,
      mongo: {
        uri: process.env.MONGODB_URI
      }
    }
  };
  
  module.exports = merge(config.all, config[config.all.env]);