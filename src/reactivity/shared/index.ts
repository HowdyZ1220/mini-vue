export const extend = Object.assign;
export const isObject = function (obj) {
  return obj !== null && typeof obj === "object";
};
export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};
