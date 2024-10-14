export interface EncryptionCongratulation {
  // Encryption settings
  appEncryptionKey?: string; // Key for application-level encryption
  appEncryptionAlgorithm?: "aes-256-cbc"; // Encryption algorithm
  appEncryptionIV?: string; // Initialization vector for encryptio
}
