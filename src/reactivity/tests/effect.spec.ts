import { reactive } from "../reactive";
import { effect } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const user: any = reactive({
      age: 18,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(19);
    //updata

    user.age++;
    expect(nextAge).toBe(20);
  });

  it("", () => {
    // 执行effect返回一个runner 执行runner 返回fn的返回值
    let num = 10;
    let runner = effect(() => {
      num++;
      return "foo";
    });
    expect(num).toBe(11);
    runner();
    expect(num).toBe(12);
    expect(runner()).toBe("foo");
  });
  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });
});
