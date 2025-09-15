const crypto = require('crypto');
const { encryptionKeyBase64 } = require('../config');

if (!encryptionKeyBase64) throw new Error('Encryption key missing in env');
const KEY = Buffer.from(encryptionKeyBase64, 'base64'); // must be 32 bytes

function encryptJSON(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const data = Buffer.from(JSON.stringify(obj));
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  };
}

function decryptJSON({ iv, tag, data }) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

module.exports = { encryptJSON, decryptJSON };
