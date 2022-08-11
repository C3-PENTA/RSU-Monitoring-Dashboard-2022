// 0-255 → '00'-'ff'
export const decimalToHex = (dec: any) => {
  const tempHex = dec.toString(16);
  return (tempHex.length === 1 ? '0' : '') + tempHex;
  /**
   * padStart not compatible with Chrome 54 and older.
   * return dec.toString(16).padStart(2, '0');
   */
};

export const generateUniqueString = () => {
  const arr = new Uint8Array(40 / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, decimalToHex).join('');
};

export const safeAnyToNumber = (inputVal: any, fallbackNum = 0) => {
  const result = Number(inputVal);
  return isNaN(result) ? fallbackNum : result;
};
