import crypto from 'crypto';

const IV = '@@@@&&&&####$$$$';

export class PaytmChecksum {
  static encrypt(input: string, key: string): string {
    const cipher = crypto.createCipheriv('AES-128-CBC', key, IV);
    let encrypted = cipher.update(input, 'binary', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  static decrypt(encrypted: string, key: string): string {
    const decipher = crypto.createDecipheriv('AES-128-CBC', key, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'binary');
    try {
      decrypted += decipher.final('binary');
    } catch (e) {
      console.error('PaytmChecksum decrypt error:', e);
    }
    return decrypted;
  }

  static generateRandomString(length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes((length * 3.0) / 4.0, (err, buf) => {
        if (!err) {
          resolve(buf.toString('base64'));
        } else {
          reject(err);
        }
      });
    });
  }

  static getStringByParams(params: Record<string, any>): string {
    const data: Record<string, string> = {};
    Object.keys(params).sort().forEach((key) => {
      const val = params[key];
      data[key] = val !== null && val !== undefined ? String(val) : '';
    });
    return Object.values(data).join('|');
  }

  static calculateHash(params: string, salt: string): string {
    const finalString = params + '|' + salt;
    return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
  }

  static calculateChecksum(params: string, key: string, salt: string): string {
    const hashString = PaytmChecksum.calculateHash(params, salt);
    return PaytmChecksum.encrypt(hashString, key);
  }

  static async generateSignatureByString(params: string, key: string): Promise<string> {
    const salt = await PaytmChecksum.generateRandomString(4);
    return PaytmChecksum.calculateChecksum(params, key, salt);
  }

  static async generateSignature(params: Record<string, any> | string, key: string): Promise<string> {
    if (typeof params !== 'object' && typeof params !== 'string') {
      throw new Error('string or object expected, ' + typeof params + ' given.');
    }
    const paramStr = typeof params === 'string' ? params : JSON.stringify(params);
    return PaytmChecksum.generateSignatureByString(paramStr, key);
  }

  static verifySignatureByString(params: string, key: string, checksum: string): boolean {
    try {
      const paytmHash = PaytmChecksum.decrypt(checksum, key);
      const salt = paytmHash.substr(paytmHash.length - 4);
      return paytmHash === PaytmChecksum.calculateHash(params, salt);
    } catch (e) {
      return false;
    }
  }

  static verifySignature(params: Record<string, any> | string, key: string, checksum: string): boolean {
    if (typeof params !== 'object' && typeof params !== 'string') {
      throw new Error('string or object expected, ' + typeof params + ' given.');
    }
    const cleanParams: Record<string, any> = { ...(params as any) };
    delete cleanParams.CHECKSUMHASH;
    delete cleanParams.checksum;

    const paramStr = typeof params === 'string' ? params : PaytmChecksum.getStringByParams(cleanParams);
    return PaytmChecksum.verifySignatureByString(paramStr, key, checksum);
  }
}
