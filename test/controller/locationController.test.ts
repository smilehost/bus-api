function add(a: number, b: number): number {
  return a + b;
}

const add_test_cases = [
  {
    name: "adds 1 + 2",
    input: { a: 1, b: 2 },
    expected: 3,
  },
  {
    name: "adds -5 + 5",
    input: { a: -5, b: 5 },
    expected: 0,
  },
  {
    name: "adds 0 + 0",
    input: { a: 0, b: 0 },
    expected: 0,
  },
  {
    name: "adds 99 + 1",
    input: { a: 99, b: 1 },
    expected: 100,
  },
];

describe("add function", () => {
  add_test_cases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const actual = add(input.a, input.b);
      expect(actual).toBe(expected);
    });
  });
});