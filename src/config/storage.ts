export interface StorageConfiguration {
  driver?: "local" | "s3"; // Storage driver (e.g., local filesystem, S3)
  local?: {
    path: string; // Path for local storage
  };
  s3?: {
    accessKeyId: string; // AWS S3 access key ID
    secretAccessKey: string; // AWS S3 secret access key
    region: string; // AWS S3 region
    bucket: string; // AWS S3 bucket name
    endpoint?: string; // Custom S3 endpoint
  };
  maxFileSize?: number; // Maximum file size for uploads
  tempDirectory?: string;
}
