import CryptoJS from 'crypto-js';

const secretKey: string = import.meta.env.VITE_ENCRYPTION_KEY;

export const basicEncrypt = (stringVal: string) =>
{
    const cipherText = CryptoJS.AES.encrypt(stringVal, secretKey).toString();

    return cipherText;
};

export const basicDecrypt = (cipherText: string) =>
{
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
};