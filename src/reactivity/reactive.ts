import { mutableHandler, readonlyHandler } from "./baseHandlers";

export const reactive = function (raw) {
  return creatActiveObject(raw, mutableHandler);
};

export const readonly = function (raw) {
  return creatActiveObject(raw, readonlyHandler);
};

function creatActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
