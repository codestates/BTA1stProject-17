import * as crypto from 'crypto-js';

const salt = 'HEDERA_HASHTAG';

const secretKey = process.env.SECRET_KEY!;
export const encrypt = (value: string, key: string) => {
  return crypto.AES.encrypt(value + salt, secretKey + key).toString();
};

export const decrypt = (hashedValue: string, key: string) => {
  const value = crypto.AES.decrypt(hashedValue, secretKey + key).toString(crypto.enc.Utf8);
  if (value.match(salt)) {
    const realValue = value.replace(salt, '');
    return {
      isSuccess: true,
      value: realValue,
    };
  }
  return {
    isSuccess: false,
    value: null,
  };
};
