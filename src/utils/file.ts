import * as fs from "fs";
import { promises as fsp, PathLike } from "fs";
import { AnyObject } from "../interface";
import { Stream } from "stream";
import { FileHandle } from "fs/promises";
import { Abortable } from "events";

export function filePutContentsSync(
  file: fs.PathOrFileDescriptor,
  data: string | NodeJS.ArrayBufferView,
  append: boolean = false,
  options?: fs.WriteFileOptions
): void {
  const defaultOption: AnyObject = {};
  if (typeof data === "string") {
    defaultOption.encoding = "utf8";
  }
  defaultOption.flag = append ? "a" : "w";
  if (options && typeof options === "object") {
    options = { ...defaultOption, ...options };
  } else if (!options) {
    options = defaultOption;
  }
  fs.writeFileSync(file, data, options);
}

export async function filePutContents(
  file: PathLike | FileHandle,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  append: boolean = false,
  options?:
    | (fs.ObjectEncodingOptions & {
        mode?: fs.Mode | undefined;
        flag?: fs.OpenMode | undefined;
        /**
         * If all data is successfully written to the file, and `flush`
         * is `true`, `filehandle.sync()` is used to flush the data.
         * @default false
         */
        flush?: boolean | undefined;
      } & Abortable)
    | BufferEncoding
    | null
): Promise<void> {
  const defaultOption: AnyObject = {};
  if (typeof data === "string") {
    defaultOption.encoding = "utf8";
  }
  defaultOption.flag = append ? "a" : "w";
  if (options && typeof options === "object") {
    options = { ...defaultOption, ...options };
  } else if (!options) {
    options = defaultOption;
  }
  await fsp.writeFile(file, data, options);
}
