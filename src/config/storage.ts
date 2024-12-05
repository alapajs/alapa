import { StorageDriver } from "../driver/abstract";

export interface S3Configuration {
  /**
   * The AWS S3 access key ID for authenticating API requests.
   * This key should be kept secure.
   */
  accessKeyId: string;

  /**
   * The AWS S3 secret access key for authenticating API requests.
   * This key should be kept secure and private.
   */
  secretAccessKey: string;

  /**
   * The AWS S3 region where the bucket is located.
   * Example: `"us-east-1"`, `"eu-west-1"`, etc.
   */
  region: string;

  /**
   * The name of the AWS S3 bucket where files will be stored.
   */
  bucket: string;

  /**
   * (Optional) The custom S3 endpoint URL, used for non-AWS S3 services
   * or private cloud implementations. If not provided, AWS's default endpoint is used.
   */
  endpoint?: string;
}

export interface LocalStorageConfiguration {
  /**
   * The local file system path where files will be stored.
   * Example: `/var/www/uploads` or `./uploads`.
   */
  path?: string;

  /**
   * (Optional) The custom local storage endpoint URL, used for non-local storage
   * or private cloud implementations. If not provided, http://localhost:3000 will be used.
   */
  url?: string;
}

/**
 * Represents the configuration options for storage in the application.
 * This interface supports different storage backends like local filesystem
 * and cloud-based S3 storage.
 */
export interface StorageConfiguration {
  /**
   * The type of storage driver to use.
   */
  driver?: StorageDriver;

  /**
   * Configuration settings specific to local storage.
   * This section is used when `driver` is set to `"local"`.
   */

  s3?: S3Configuration;
  local?: LocalStorageConfiguration;

  /**
   * Configuration settings specific to S3 storage.
   * This section is used when `driver` is set to `"s3"`.
   */

  /**
   * The maximum file size allowed for uploads, in bytes.
   * If not provided, there may be no size restriction.
   */
  maxFileSize?: number;

  /**
   * The directory path where temporary files can be stored during
   * file uploads or processing.
   */
  tempDirectory?: string;
}
