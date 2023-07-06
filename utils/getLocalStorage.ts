import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid'

const SECRET_KEY = uuidv4()

export const setLocalStorage =(name: string, data: any)=> {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
}

export const getLocalStorage = (name: string) => {
    const encrypted = localStorage.getItem(name);
    const decrypted = CryptoJS.AES.decrypt(encrypted!, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
}