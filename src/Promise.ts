enum Status {
  PENDING = 0,
  FULFILLED = 1,
  REJECTED = -1,
}

class Promise<T> {

  private status: Status = Status.PENDING;

  private value?: T;
  private error?: any;

  private callbacks: Array<() => void> = [];

  constructor(
    fn: (
      resolve: (value: T) => void,
      reject: (error?: any) => void
    ) => void
  ) {
    try {
      fn(
        (value: T) => this.resolve(value),
        (error?: any) => this.reject(error)
      );
    } catch (error) {
      this.reject(error);
    }
  }

  public then<R>(callback: (value: T) => R): Promise<R> {
    const promiseFn = (
      resolve: (value: R) => void,
      reject: (error?: any) => void
    ) => {
      const callbackAfterFinish = () => {
        this.assertResolved();
        if (this.status === Status.FULFILLED) {
          const value = this.value!;
          try {
            const newValue = callback(value);
            if (newValue instanceof Promise) {
              newValue.then((v) => resolve(v));
            } else {
              resolve(newValue);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          const value = this.error;
          reject(value);
        }
      }

      if (this.status !== Status.PENDING) {
        callbackAfterFinish();
      } else {
        this.callbacks.push(callbackAfterFinish);
      }
    }

    return new Promise<R>(promiseFn);
  }

  public catch<R>(callback: (error?: any) => R): Promise<any> {
    const promiseFn = (
      resolve: (value: R) => void,
      reject: (error?: any) => void
    ) => {
      const callbackAfterFinish = () => {
        this.assertResolved();
        if (this.status === Status.REJECTED) {
          const error = this.error;
          try {
            const newValue = callback(error);
            if (newValue instanceof Promise) {
              newValue.then((v) => resolve(v));
            } else {
              resolve(newValue);
            }
          } catch (error) {
            reject(error);
          }
        }
      }

      if (this.status !== Status.PENDING) {
        callbackAfterFinish();
      } else {
        this.callbacks.push(callbackAfterFinish);
      }
    }

    return new Promise<R>(promiseFn);
  }

  private resolve(value: T): void {
    this.value = value;
    this.status = Status.FULFILLED;
    this.finish();
  }

  private reject(error?: any): void {
    this.error = error;
    this.status = Status.REJECTED;
    this.finish();
  }

  private finish(): void {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }

  private assertResolved(): void {
    invariant(
      this.status !== Status.PENDING,
      'Expected promise to be resolved or rejected'
    );
  }

  static reject(error?: any): Promise<any> {
    return new Promise((_, reject) => {
      reject(error);
    });
  }

  static resolve<T>(value: T): Promise<T> {
    return new Promise((resolve) => {
      resolve(value);
    })
  }

  static all<T extends readonly any[]>(
    promises: Promisify<T>
  ): Promise<T> {
    const results: any[] = [];
    let counter = 0;
    let hasRejected = false;
    return new Promise((resolve, reject) => {
      promises.forEach((promise, i) => {
        promise.then(result => {
          results[i] = result;
          ++counter;
          if (counter >= promises.length) {
            resolve(results as unknown as T);
          }
        }).catch(value => {
          if (!hasRejected) {
            hasRejected = true;
            reject(value);
          }
        });
      })
    });
  }

  static race<T extends readonly any[]>(
    promises: Promisify<T>
  ): Promise<ArrayElement<T>> {
    let isDone = false;
    return new Promise((resolve, reject) => {
      promises.forEach((promise, i) => promise
        .then(value => {
          if (isDone) return;
          isDone = true;
          resolve(value);
        })
        .catch((error) => {
          if (isDone) return;
          isDone = true;
          reject(error);
        }))
    });
  }
}

type Promisify<T extends readonly any[]> = {
  [K in keyof T]: Promise<T[K]>
}

type ArrayElement<T extends readonly any[]> = T[number];

function invariant(truth: boolean, msg: string) {
  if (!truth) {
    throw new Error(`Invariant violation: ${msg}`);
  }
}

export default Promise;
