/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("node:child_process");
const fs = require("fs");
const path = require("path");

const modulePath = path.resolve(__dirname);
try {
  if (fs.existsSync(path.resolve(modulePath, "src"))) {
    if (!fs.existsSync(path.resolve(modulePath, ".local"))) {
      execSync("npm run build");
      fs.rmSync("./src", { recursive: true });
      console.log("src directory deleted after build.");
    } else {
      console.log("src directory not deleted: package is linked.");
    }
  }
} catch (error) {
  fs.writeFileSync("prebuild.log", `${error}`);
  console.error("Error during build:", error);
}
