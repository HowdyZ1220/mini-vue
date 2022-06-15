import { track, trigger } from "./effect";

export const reactive = function (raw) {
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
// import { track, trigger } from "./effect";

// export function reactive(raw) {
//   return new Proxy(raw, {
//     get(target, key) {
//       const res = Reflect.get(target, key);

//       track(target, key);
//       return res;
//     },

//     set(target, key, value) {
//       const res = Reflect.set(target, key, value);

//       trigger(target, key);
//       return res;
//     },
//   });
// }
