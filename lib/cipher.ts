//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------

'use strict'

import * as crypto from 'crypto';

export const DefaultAlgorithm = 'aes-256-cfb';

export const SupportedCiphers = {
  'aes-128-cfb': [16, 16],
  'aes-192-cfb': [24, 16],
  'aes-256-cfb': [32, 16],
  'aes-256-cbc': [32, 16],
  'aes-256-ofb': [32, 16],
  'bf-cfb': [16, 8],
  'camellia-128-cfb': [16, 16],
  'camellia-192-cfb': [24, 16],
  'camellia-256-cfb': [32, 16],
  'cast5-cfb': [16, 8],
  'des-cfb': [8, 8],
  'idea-cfb': [16, 8],
  'rc2-cfb': [16, 8],
  'rc4': [16, 0],
  'rc4-md5': [16, 16],
  'seed-cfb': [16, 16]
}

export function createCipher(algorithm: string, password: string): { cipher: crypto.Cipher, iv: Buffer } {
  return createDeOrCipher('cipher', algorithm, password);
}

export function createDecipher(algorithm: string, password: string, iv: Buffer): crypto.Decipher {
  return createDeOrCipher('decipher', algorithm, password).cipher;
}

function createDeOrCipher(type: string, algorithm: string, password, iv?: Buffer): { cipher: crypto.Cipher | crypto.Decipher, iv: Buffer } {
  let cipherAlgorithm = algorithm.toLowerCase();
  let keyIv = SupportedCiphers[cipherAlgorithm];
  
  if (!keyIv) keyIv = SupportedCiphers[DefaultAlgorithm];
  
  let key = new Buffer(password);
  if (key.length > keyIv[1]) key = key.slice(0, keyIv[1]);
  if (key.length < keyIv[1]) key = Buffer.concat([key, crypto.randomBytes(keyIv[1] - key.length)]);
  
  iv = iv || crypto.randomBytes(keyIv[1]);
  let cipher = type === 'cipher' ? crypto.createCipheriv(algorithm, key, iv) : crypto.createDecipheriv(algorithm, key, iv);
  return { cipher, iv };
}