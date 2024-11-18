import os from "os";

export const getTempDirectory = (): string => {
  return os.tmpdir();
};
