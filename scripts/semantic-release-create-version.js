const fs = require("fs");
const glob = require("glob");
const { version } = require("../package.json");

module.exports = {
  prepare() {
    glob.sync("*/*.js").forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      fs.writeFileSync(file, content.replace("0.0.0-development", version));
    });
  }
};
