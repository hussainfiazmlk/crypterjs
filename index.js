const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const tagLength = 16;
const defaultEncoding = 'hex';
const defaultSaltLength = 64;
const defaultPbkdf2Iterations = 100000;

/**
 * @typedef {Object} CrypterOptions
 * @property {BufferEncoding} [encoding='hex'] - Encoding format for the output string (default: 'hex').
 * @property {number} [pbkdf2Iterations=100000] - Number of PBKDF2 iterations for key derivation (default: 100000).
 * @property {number} [saltLength=64] - Length of the random salt in bytes (default: 64).
 */
class Crypterjs {
  /**
   * Creates an instance of CryptrService.
   * @param {string} secret - The secret key used for encryption/decryption.
   * @param {CrypterOptions} [options={}] - Optional parameters for encryption configuration.
   */
  constructor(secret, options = {}) {
    if (!secret) {
      throw new Error('Secret key must be provided');
    }
    this.secret = secret;
    this.encoding = options.encoding || defaultEncoding;
    this.saltLength = options.saltLength || defaultSaltLength;
    this.pbkdf2Iterations = options.pbkdf2Iterations || defaultPbkdf2Iterations;

    this.tagPosition = this.saltLength + ivLength;
    this.encryptedPosition = this.tagPosition + tagLength;
  }

  /**
   * Derives the encryption key using PBKDF2.
   * @param {Buffer} salt - The salt value for key derivation.
   * @returns {Buffer} The derived encryption key.
   */
  getKey(salt) {
    return crypto.pbkdf2Sync(this.secret, salt, this.pbkdf2Iterations, 32, 'sha512');
  }

  /**
   * Encrypts the given value.
   * @param {string|number|null|undefined} value - The value to encrypt.
   * @returns {string} The encrypted value as a string.
   * @throws Will throw an error if the value is null or undefined.
   */
  encrypt(value) {
    if (value == null) {
      throw new Error('value must not be null or undefined');
    }

    const iv = crypto.randomBytes(ivLength);
    const salt = crypto.randomBytes(this.saltLength);
    const key = this.getKey(salt);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString(this.encoding);
  }

   /**
   * Decrypts the given encrypted value.
   * @param {string|null|undefined} value - The encrypted value to decrypt.
   * @returns {string} The decrypted string.
   * @throws Will throw an error if the value is null or undefined.
   */
  decrypt(value) {
    if (value == null) {
      throw new Error('value must not be null or undefined');
    }

    const stringValue = Buffer.from(String(value), this.encoding);

    const salt = stringValue.subarray(0, this.saltLength);
    const iv = stringValue.subarray(this.saltLength, this.tagPosition);
    const tag = stringValue.subarray(this.tagPosition, this.encryptedPosition);
    const encrypted = stringValue.subarray(this.encryptedPosition);

    const key = this.getKey(salt);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString('utf8');
  }
}

module.exports = Crypterjs;
module.exports.default = Crypterjs;
