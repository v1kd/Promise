class Promise<T> {

  private status: 'PENDING' | 'RESOLVED' | 'REJECTED' = 'PENDING';

  private valueObj?: {value: T};
  private errorObj?: {error?: any};

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

  public then<Tnew>(callback: (value: T) => Tnew): Promise<Tnew> {
    let promiseResolve: (value: Tnew) => void;
    let promiseReject: (error?: any) => void;
    const promise = new Promise<Tnew>((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    const callbackAfterFinish = () => {
      this.assertResolved();
      if (this.status === 'RESOLVED') {
        const value = this.valueObj!.value;
        try {
          const newValue = callback(value);
          if (newValue instanceof Promise) {
            newValue.then((v) => promiseResolve(v));
          } else {
            promiseResolve(newValue);
          }
        } catch (error) {
          promiseReject(error);
        }
      } else {
        const value = this.errorObj!.error;
        promiseReject(value);
      }
    }

    if (this.status !== 'PENDING') {
      callbackAfterFinish();
    } else {
      this.callbacks.push(callbackAfterFinish);
    }
    return promise;
  }

  public catch<Tnew>(callback: (error?: any) => Tnew): Promise<any> {
    let promiseResolve: (value: Tnew) => void;
    let promiseReject: (error?: any) => void;
    const promise = new Promise<Tnew>((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject; 
    });

    const callbackAfterFinish = () => {
      this.assertResolved();
      if (this.status === 'REJECTED') {
        const error = this.errorObj!.error;
        try {
          const newValue = callback(error);
          if (newValue instanceof Promise) {
            newValue.then((v) => promiseResolve(v));
          } else {
            promiseResolve(newValue);
          }
        } catch(error) {
          promiseReject(error);
        }
      }
    }

    if (this.status !== 'PENDING') {
      callbackAfterFinish();
    } else {
      this.callbacks.push(callbackAfterFinish);
    }
    return promise;
  }

  private resolve(value: T): void {
    this.valueObj = {value};
    this.status = 'RESOLVED';
    this.finish();
  }

  private reject(error?: any): void {
    this.errorObj = {error};
    this.status = 'REJECTED';
    this.finish();
  }

  private finish(): void {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }

  private assertResolved(): void {
    invariant(
      this.status !== 'PENDING',
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
}

function invariant(truth: boolean, msg: string) {
  if (!truth) {
    throw new Error(`Invariant violation: ${msg}`);
  }
}

export default Promise;
