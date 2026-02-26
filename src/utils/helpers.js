
import CryptoJS from 'crypto-js';
import { SECRET_KEY_FRONTEND_STORAGE } from './constants';

const deriveKey = (secret) => {
    const sha1Hash = CryptoJS.SHA1(secret);
    return sha1Hash.toString(CryptoJS.enc.Hex).substring(0, 32);
};

export const encryptDataForBackend = (data) => {
    try {
        const secretKey = deriveKey(SECRET_KEY_FRONTEND_STORAGE);
        const keyHex = CryptoJS.enc.Hex.parse(secretKey);

        const encryptedObject = {};
        Object.entries(data).forEach(([key, value]) => {
            const encrypted = CryptoJS.AES.encrypt(String(value), keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
            encryptedObject[key] = encrypted;
        });

        return encryptedObject;
    } catch (error) {
        console.error("Error encrypting data:", error);
        return null;
    }
};

export const decryptData = (encryptedObject) => {
    try {
        const secretKey = deriveKey(SECRET_KEY_FRONTEND_STORAGE);
        const keyHex = CryptoJS.enc.Hex.parse(secretKey);

        const decryptedObject = {};

        Object.entries(encryptedObject).forEach(([key, encryptedValue]) => {
            const decrypted = CryptoJS.AES.decrypt(encryptedValue, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });

            decryptedObject[key] = decrypted.toString(CryptoJS.enc.Utf8);
        });

        return decryptedObject;
    } catch (error) {
        console.error("Error decrypting data:", error);
        return null;
    }
};

export const saveToLocalStorage = (key, value) => {
    const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY_FRONTEND_STORAGE).toString();
    localStorage.setItem(key, encryptedValue);
};

export const getFromLocalStorage = (key) => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) {
        return null;
    }
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY_FRONTEND_STORAGE);
        const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedValue) return JSON.parse(decryptedValue);
        else return null;
    } catch (error) {
        return null;
    }
};

export function formatTime(timestamp) {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj)) return "";
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    // const milliseconds = String(dateObj.getMilliseconds()).padStart(3, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    return formattedTime;
}

export function formatDate(timestamp) {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj)) return "";
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

export function formateDateTime(timestamp) {
    let dateToFormat = new Date(timestamp);
    if (!timestamp || isNaN(dateToFormat.getTime())) {
        dateToFormat = new Date();
    }

    return dateToFormat.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}