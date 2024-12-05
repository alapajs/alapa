import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { IStorageDriverError, StorageDriver } from "./abstract";
import { Logger } from "../utils";
import { S3Configuration } from "../config/storage";
import { GlobalConfig } from "../shared/globals";

export class S3Driver implements StorageDriver {
  error: IStorageDriverError | null;
  name = "s3";
  absolutePath: string;
  absoluteURL: string;
  private config: S3Configuration = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    endpoint: process.env.AWS_S3_ENDPOINT,
    bucket: process.env.AWS_S3_BUCKET || "",
    region: process.env.AWS_REGION || "",
  };
  constructor(config?: S3Configuration) {
    this.config = config || GlobalConfig?.storage?.s3 || this.config;
    const url =
      this.config.endpoint ||
      `https://${config?.bucket}.s3.${config?.region}.amazonaws.com`;
    this.absolutePath = url;
    this.absoluteURL = url;
  }
  saveFile = async (
    filePath: string,
    key: string
  ): Promise<boolean | string> => {
    Logger.info(this.config.endpoint);
    // Initialize the S3 client
    const s3Client = new S3Client({
      // endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });

    try {
      // Read the file to be uploaded
      const fileStream = fs.createReadStream(filePath);

      // Create the command to put the object in the S3 bucket
      const uploadParams = {
        Bucket: this.config?.bucket,
        Key: key, // The key is the name of the file in the S3 bucket
        Body: fileStream, // The file's contents
      };

      // Create the PutObjectCommand to upload the file
      const command = new PutObjectCommand(uploadParams);

      // Send the command to S3
      const data = await s3Client.send(command);
      console.log(`File uploaded successfully: ${data.ETag}`);
      return key;
    } catch (err) {
      Logger.error(`Error uploading file: ${err}`);
      return false;
    }
  };
}
