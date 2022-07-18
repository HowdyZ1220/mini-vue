import { isTracking, tarckEffects, track, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { hasChanged, isObject } from "./shared";

class RefImpl {
  private _value;
  public dep;
  public raw;
  public _v__isRef = true;
  constructor(value) {
    this.raw = value;
    this._value = isObject(value) ? reactive(value) : value;
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);

    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this._value)) {
      this.raw = newValue;

      this._value = isObject(newValue) ? reactive(newValue) : newValue;
      triggerEffects(this.dep);
    }
  }
}

export const ref = function (value) {
  return new RefImpl(value);
};

export const trackRefValue = (ref) => {
  if (isTracking()) {
    tarckEffects(ref.dep);
  }
};

export function isRef(ref) {
  return !!ref._v__isRef;
}

export function unRef(value) {
  return isRef(value) ? value.value : value;
}
