import { effect } from "../effect";
import { reactive, isReactive, isProxy } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = {
      foo: 1,
      arr: [1, 2, 4],
      obj: {
        ab: 1,
      },
    };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isReactive(observed.arr)).toBe(true);
    expect(isReactive(observed.obj)).toBe(true);
    expect(isProxy(observed)).toBe(true);
  });
});
