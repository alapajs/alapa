/* eslint-disable @typescript-eslint/no-unused-vars */
import mediaInfoFactory, { Media } from "mediainfo.js";
import fs from "fs";

export type MediaInfoResult = Media;

export class MediaInfo {
  private static data: Uint8Array;
  private static async readChunk(chunkSize: number, offset: number) {
    return MediaInfo.data;
  }
  static async analyzeData(
    data: Uint8Array,
    size?: number
  ): Promise<Media | null> {
    size = size || data.length;
    const mediaInfo = await mediaInfoFactory();
    MediaInfo.data = data;
    return (await mediaInfo.analyzeData(size, this.readChunk)).media ?? null;
  }

  static async analyzeBuffer(
    buffer: Buffer,
    size?: number
  ): Promise<Media | null> {
    const data = new Uint8Array(buffer);
    return this.analyzeData(data, size);
  }

  static async analyzeFile(
    fileName: string,
    size?: number
  ): Promise<Media | null> {
    const buffer = fs.readFileSync(fileName);
    return this.analyzeBuffer(buffer, size);
  }
}
