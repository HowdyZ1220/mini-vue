import { track, trigger } from "./effect";

const get = creatGetter();
const set = creatSetter();
const readonlyGet = creatGetter(true);
function creatGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    //依赖收集
    if (!isReadonly) {
      track(target, key);
    }

    return res;
  };
}
function creatSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

export const mutableHandler = {
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key}调用失败，这是一个只读对象`, target);
    return true;
  },
};
