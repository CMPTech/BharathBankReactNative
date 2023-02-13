import * as CryptoJS from 'crypto-js'
import { JSEncrypt } from './jsencrypt'

const decryptAES = (uuid, value) => {
  var key = CryptoJS.enc.Utf8.parse(uuid)
  var iv = CryptoJS.enc.Utf8.parse(uuid)
  var decrypted = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

const encryptRSA = async (publicKey, value) => {
  const RSA = new JSEncrypt()
  RSA.setPublicKey(publicKey)
  return RSA.encrypt(value).toString()
}

const encryptField = (uuid, value, decryptedPublicKey) => {
  const combinedText = `${uuid}:${value}:${Date.now()}`
  return encryptRSA(decryptedPublicKey, combinedText)
}

export const getEncryptedValues = async (publicKey, newPIN, cardNumber, uuid) => {
  const decryptedPublicKey = decryptAES(uuid, publicKey)
  const encryptedPIN = await encryptField(uuid, newPIN, decryptedPublicKey)
  const encryptedCardNumber = await encryptField(uuid, cardNumber, decryptedPublicKey)
  return {
    newPIN: encryptedPIN,
    cardNumber: encryptedCardNumber,
  }
}