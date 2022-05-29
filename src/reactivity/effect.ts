//创建一个类 相当于面向对象思想 不允许fn改动
class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }

  run() {
    //执行effect传入函数的内容
    activeEffect = this;
    this._fn();
  }
}

//创建一个保存多个对象的容器
//收集依赖
const targetMap = new Map();
export function track(target, key) {
  //key为可响应式对象，value为map格式的对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  //创建对象中key的dep
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  //遍历dep的元素，并逐个调用
  for (const effect of dep) {
    effect.run();
  }
}

let activeEffect;
export const effect = function (fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
};
