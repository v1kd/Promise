import Promise, { default as P } from "../Promise";

describe('Non async', () => {
  it('Should await for single then', () => {
    let a: number = 0;

    new P<number>((resolve) => {
      resolve(1);
    }).then(value => (a = value));

    expect(a).toEqual(1);
  });

  it('Should resolve undefined', () => {
    let a = null;

    new P<undefined>(resolve => resolve(undefined))
      .then(value => (a = value));
    
    expect(a).toEqual(undefined);
  });

  it('Should await for multiple thens', () => {
    let a: number = 0;

    new P<number>((resolve) => {
      resolve(1);
    }).then(value => value + 1)
      .then(value => value + 1)
      .then(value => value + 1)
      .then(value => (a = value));

    expect(a).toEqual(4);
  });

  it('Should catch when rejected', () => {
    let a: number = 0;

    new P<number>((_, reject) => {
      reject(3);
    })
      .catch(rejected => (a = rejected));

    expect(a).toEqual(3);
  });

  it('Should catch when thrown', () => {
    let error: Error;
    const message = 'Error thrown';

    new P(() => {
      throw new Error(message);
    }).catch(e => (error = e));

    expect(error!.message).toEqual(message);
  });

  it('Should skip then and catch when rejected', () => {
    let a: number = 0;
    const thenMock = jest.fn()
      .mockReturnValue(1);

    new P<number>((_, reject) => {
      reject(3);
    }).then(thenMock)
      .catch(value => (a = value));

    expect(a).toEqual(3);
    expect(thenMock).not.toBeCalled();
  });
});

describe('Non async Promise.all', () => {
  it('Should await for all promises', () => {
    let values;
    P.all([
      P.resolve(1),
      P.resolve("resolve"),
      P.resolve(null),
      P.resolve(false),
    ]).then(v => (values = v));

    expect(values).toEqual([1, "resolve", null, false]);
  });

  it('Should reject when one of them rejects', () => {
    let value;

    P.all([
      P.resolve(1),
      P.resolve(2),
      P.reject(3), // first rejected value
      P.resolve(4),
      P.reject(5),
      P.resolve(6),
    ]).catch(v => (value = v));

    expect(value).toEqual(3);
  });
});
