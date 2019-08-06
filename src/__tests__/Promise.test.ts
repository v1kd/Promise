import Promise, { default as P } from "../Promise";

describe('Non async', () => {
  it('Should await for single then', () => {
    let a: number = 0;

    new P<number>((resolve) => {
      resolve(1);
    }).then(value => (a = value));

    expect(a).toEqual(1);
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
