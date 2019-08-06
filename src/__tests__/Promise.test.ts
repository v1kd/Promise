import { default as P } from "../Promise";


describe('Non async', () => {
  test('simple', () => {
    let a: number = 0;

    new P<number>((resolve) => {
      resolve(1);
    }).then((value: number) => {
      a = value;
    });

    expect(a).toEqual(1);
  });

  test('multi then', () => {
    let a: number = 0;

    new P<number>((resolve) => {
      resolve(1);
    }).then((value) => value + 1)
      .then((value) => value + 1)
      .then((value) => value + 1)
      .then((value) => (a = value));

    expect(a).toEqual(4);
  });

  test('catch', () => {
    let a: number = 0;

    new P<number>((_, reject) => {
      reject(3);
    })
    .catch((rejected) => (a = rejected));

    expect(a).toEqual(3);
  });
});
