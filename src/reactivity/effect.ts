import { extend } from "./shared";

let activeEffect;
let shouldTrack;

//创建一个类 相当于面向对象思想 不允许fn改动
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  public onStop: Function | undefined;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;

    let result = this._fn();
    shouldTrack = false;
    //执行effect传入函数的内容

    return result;
  }

  stop() {
    if (this.active) {
      clearupEffect(this);
      this.active = false;
      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

//清楚对应key改变后所需调用的单个函数
function clearupEffect(effect) {
  effect.deps.forEach((dep) => dep.delete(effect));
  effect.deps.length = 0;
}
//创建一个保存多个对象的容器
//收集依赖
const targetMap = new Map();
export function track(target, key) {
  //key为可响应式对象，value为map格式的对象 depsMap里面保存着这个响应式对象的key：[要更新的函数]
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  //创建对象中key的dep, dep里面保存着更改key值后需要更新的函数
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!isTracking()) {
    return;
  }
  tarckEffects(dep);
}
//依赖收集
export const tarckEffects = (dep) => {
  if (dep.has(activeEffect)) {
    return;
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

export const isTracking = function () {
  return shouldTrack && activeEffect !== undefined;
};

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}

export const triggerEffects = (dep) => {
  //遍历dep的元素，并逐个调用
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

type effectOption = {
  scheduler?: Function;
  onStop?: Function;
};

export const effect = function (fn, options: effectOption = {}) {
  const scheduler = options?.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  // Object.assign(_effect, options);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  //在runner里面绑定_effect是为了通过下面的stop函数拿到可响应式对象的实例
  runner.effect = _effect;
  return runner;
};

export function stop(runner) {
  runner.effect.stop();
}
