export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object; //check isObject is empty or object is object
};
