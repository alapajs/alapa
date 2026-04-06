export interface EncryptionCongratulation {
  /** Key for application-level encryption */
  appEncryptionKey?: string;
  /** Encryption algorithm */
  appEncryptionAlgorithm?: "aes-256-cbc";
  /** Initialization vector for encryption */
  appEncryptionIV?: string;
}
