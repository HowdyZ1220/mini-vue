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
});
