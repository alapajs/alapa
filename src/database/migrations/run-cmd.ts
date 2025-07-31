/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Runs a shell command and exits the process on stdout or stderr.
 * Exits with code 0 on stdout, 1 on stderr, and 2 on execution error.
 */
export async function runCommand(command: string): Promise<void> {
  try {
    const isWindows = process.platform === "win32";
    const isPowerShell =
      isWindows &&
      process.env.ComSpec &&
      process.env.ComSpec.toLowerCase().includes("powershell");

    if (isPowerShell) {
      command = command.replace(/&&/g, ";");
    }

    const { stdout, stderr } = await execAsync(command);

    if (stdout) {
      console.log(`stdout: ${stdout}`);
      process.exit(0); // Exit successfully if stdout is present
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      process.exit(1); // Exit with failure code if stderr is present
    }

    // If neither stdout nor stderr — exit with code 0
    process.exit(0);
  } catch (error: any) {
    console.error(`Execution failed: ${error.message}`);
    process.exit(2); // Exit with a different code on execution failure
  }
}
