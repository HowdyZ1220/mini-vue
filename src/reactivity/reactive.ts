import { track, trigger } from "./effect";

export const reactive = function (raw: object) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      //依赖收集
      track(target, key);
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      //notice
      trigger(target, key);
      return res;
    },
  });
};
