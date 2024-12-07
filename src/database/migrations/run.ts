import { spawn } from "node:child_process";
import { Logger } from "../../utils";

export function runMigrations() {
  // Start the process
  const cmd = spawn("npx", [
    "typeorm-ts-node-commonjs",
    "migration:run",
    "-d",
    "migration-runner/data-source.ts",
  ]);

  // Handle stdout data
  cmd.stdout.on("data", (data) => {
    Logger.log(`stdout: ${data}`);
  });

  // Handle stderr data (error case)
  cmd.stderr.on("data", (data) => {
    Logger.error(`stderr: ${data}`);
  });

  // Handle the close event when the process terminates
  cmd.on("close", (code) => {
    if (code === 0) {
      Logger.log(`Migration run successfully with exit code ${code}`);
    } else {
      Logger.error(`Error running migration. Process exited with code ${code}`);
    }
  });

  // Handle any process errors (e.g., failed to start the process)
  cmd.on("error", (err) => {
    Logger.error(`Failed to start the migration process: ${err.message}`);
    // You can choose to throw, return, or gracefully handle the error
  });

  // Optional: Handle a timeout (e.g., if the process runs too long)
  const timeout = setTimeout(() => {
    Logger.error("Migration process timed out");
    cmd.kill(); // Kill the child process if it exceeds the timeout
  }, 30000); // Timeout after 30 seconds (adjust as needed)

  // Clear the timeout when the process completes successfully or if it's closed for any reason
  cmd.on("close", () => {
    clearTimeout(timeout);
  });

  // Optional: Handle process interruption (Ctrl+C or other termination signals)
  process.on("SIGINT", () => {
    Logger.log("Process interrupted. Killing the migration process...");
    cmd.kill(); // Kill the child process on interruption
    process.exit(1); // Exit the current process with failure status
  });
}
