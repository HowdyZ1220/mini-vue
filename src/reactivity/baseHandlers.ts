import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { isObject } from "./shared";

const get = creatGetter();
const set = creatSetter();
const shallowReadonlyGet = creatGetter(true, true);
const readonlyGet = creatGetter(true);
function creatGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (isShallowReadonly) {
      return res;
    }
    //判断res是否为对象
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      //依赖收集
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
export const shallowReadonlyHandler = {
  get: shallowReadonlyGet,
  set(target, key, value) {
    console.warn(`key:${key}调用失败，这是一个只读对象`, target);
    return true;
  },
};
