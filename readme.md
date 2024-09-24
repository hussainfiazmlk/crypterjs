# Crypterjs

**Crypterjs** is a simple encryption and decryption service built on top of Node.js' `crypto` module. It provides an easy-to-use interface for securely encrypting and decrypting data with AES-256-GCM and PBKDF2 key derivation.

> **⚠️ Important:** This library is **not intended for password hashing**. Use dedicated hashing algorithms (like bcrypt, argon2, etc.) for password hashing, as they are designed for one-way flows. Crypterjs is for two-way encryption and decryption of data such as tokens, strings, or numbers.

## Features

- AES-256-GCM encryption.
- PBKDF2 key derivation with configurable iterations.
- Randomized IV (Initialization Vector) and salt for each encryption.
- Customizable options for encoding, salt length, and iteration count.

## Installation

Install Crypterjs via npm:

```bash
npm install crypterjs
```
## Usage
You can import Crypterjs in both CommonJS and ESM environments.

#### CommonJS:
```javascript
const Crypterjs = require('crypterjs');
```

#### ES Modules:
```javascript
import Crypterjs from 'crypterjs';
```
### Use Cases

### 1. Encrypting and Decrypting Strings
Here’s an example of how to use Crypterjs for encryption and decryption.
```javascript
const Crypterjs = require('crypterjs'); // Or use import in ESM
const crypter = new Crypterjs('your-secret-key'); // Create a new instance of Crypterjs
const encryptedValue = crypter.encrypt('Hello, world!'); // Encrypt a value
console.log('Encrypted:', encryptedValue);
const decryptedValue = crypter.decrypt(encryptedValue); // Decrypt the value
console.log('Decrypted:', decryptedValue);
```

#### 2. Encrypting and Decrypting Numbers
You can also encrypt and decrypt numbers like user IDs, order numbers, or any other numerical data you want to secure:
```javascript
const Crypterjs = require('crypterjs'); // Or use import in ESM
const crypter = new Crypterjs('your-secret-key'); // Create a new instance of Crypterjs
const encryptedValue = crypter.encrypt(12345); // Encrypt a value
console.log('Encrypted:', encryptedValue);
const decryptedValue = crypter.decrypt(encryptedValue); // Decrypt the value
console.log('Decrypted:', decryptedValue);
```

#### 3. Encrypting and Decrypting JWT
When dealing with JWT tokens, you often need to encrypt them before sending or storing them for an extra layer of security. You can use Crypterjs to encrypt and decrypt JWT tokens using a secret key (which may or may not be the same key you use for signing the JWT):
**Important Note:** Once the JWT token is encrypted using Crypterjs, the resulting encrypted token cannot be decoded or inspected using the [jwt.io](https://jwt.io) website. Therefore, the original payload will not be visible or verifiable without decrypting the token first.

```javascript
const jwt = require('jsonwebtoken');
const Crypterjs = require('crypterjs');
const secretKey = 'your-jwt-secret-key';
const crypter = new Crypterjs('your-jwt-secret-key'); // Secret key used for both JWT signing and Crypterjs
const token = jwt.sign({ userId: 123 }, secretKey, { expiresIn: '1h' }); // Sign the JWT token
const encryptedToken = crypter.encrypt(token); // Encrypt the JWT token before storing or sending
console.log('Encrypted JWT:', encryptedToken);

const decryptedToken = crypter.decrypt(encryptedToken); // Decrypt the JWT token before verifying
console.log('Decrypted JWT:', decryptedToken);

const verified = jwt.verify(decryptedToken, secretKey); // Verify the decrypted JWT
console.log('Verified JWT Payload:', verified);
```

## Options
You can customize Crypterjs behavior by passing an options object when initializing:

```javascript
const options = {
  encoding: 'base64',         // Default: 'hex'
  saltLength: 32,             // Default: 64
  pbkdf2Iterations: 50000     // Default: 100000
};
const crypter = new Crypterjs('your-secret-key', options);
```

## API
## Constructor
#### `constructor(secret: string, options?: CrypterOptions)`
- **secret**: The secret key used for encryption and decryption (required). You should treat this secret similarly to how you handle JWT secret keys or other sensitive keys in your application.
- **options** (optional): An object to customize encryption:
  - **encoding** (string): The encoding used for the output string. Default is 'hex'.
  - **pbkdf2Iterations** (number): Number of iterations for the PBKDF2 key derivation function. Default is 100000.
  - **saltLength** (number): Length of the random salt in bytes. Default is 64.

## Methods
#### `encrypt(value: string | number | null | undefined): string`
Encrypts the provided value.
- **value**: The value to encrypt (string or number).
- **Returns**: The encrypted string.
- **Throws**: An error if value is null or undefined.

#### `decrypt(value: string | null | undefined): string`
Decrypts the provided encrypted string.
- **value**: The encrypted string to decrypt.
- **Returns**: The decrypted value as a string.
- **Throws**: An error if value is null or undefined.
