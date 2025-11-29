import CryptoJS from 'crypto-js';   

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

export const UniversalEncryptedStorage = {
  getItem: (name: string) => {
    const encryptedData = localStorage.getItem(name);
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
      } catch {
        return null;
      }
    } 
    return null;
  },
  setItem: (name: string, value: unknown) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET_KEY
    ).toString();
    localStorage.setItem(name, encryptedData);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};