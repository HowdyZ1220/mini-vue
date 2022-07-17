import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandlers";
export const enum ReactiveFlags {
  IS_REACTIVE = "is_reactive",
  IS_READONLY = "is_readonly",
}

export const reactive = function (raw) {
  return creatActiveObject(raw, mutableHandler);
};

export const readonly = function (raw) {
  return creatActiveObject(raw, readonlyHandler);
};

export const isReactive = function (value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
};

export const isReadonly = function (value) {
  return !!value[ReactiveFlags.IS_READONLY];
};

export const shallowReadonly = function (raw) {
  return creatActiveObject(raw, shallowReadonlyHandler);
};

export const isProxy = function (value) {
  return isReactive(value) || isReadonly(value);
};

function creatActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
