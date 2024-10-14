/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("node:child_process");
const fs = require("fs");
if (fs.existsSync("./src")) {
  try {
    execSync("npm run build");
    fs.rmSync("./src", { recursive: true });
  } catch (error) {
    fs.writeFileSync("prebuild.log", `${error}`);
  }
}
