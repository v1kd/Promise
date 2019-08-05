class Promise<T> {

  private status: 'PENDING' | 'RESOLVED' | 'REJECTED' = 'PENDING';
  private valueObj?: {value: T};
  private errorObj?: {error: Error};

  private resolvedCallbacks: Array<(value: T) => void> = [];
  private rejectedCallbacks = [];

  constructor(
    fn: (
      resolve: (value: T) => void,
      reject: (error: Error) => void
    ) => void
  ) {
    fn(
      (value: T) => this.resolve(value), 
      (error: Error) => this.reject(error)
    );
  }

  public then<Tnew>(callback: (value: T) => Tnew): Promise<Tnew> {
    let promiseResolve: (value: Tnew) => void = () => {};
    const promise = new Promise<Tnew>((resolve, reject) => {
      promiseResolve = resolve;
    });

    const callbackAfterResolve = (value: T) => {
      const newValue = callback(value);
      promiseResolve(newValue);
    }

    if (this.status === 'RESOLVED') {
      callbackAfterResolve(nullthrows(this.valueObj).value);
    } else {
      this.resolvedCallbacks.push(callbackAfterResolve);
    }
    return promise;
  }

  public catch(error: Error): Promise<Error> {
    return new Promise<Error>(() => {});
  }

  private resolve(value: T): void {
    this.valueObj = {value};
    this.status = 'RESOLVED';
    this.resolvedCallbacks.forEach(callback => callback(value));
    this.resolvedCallbacks = [];
  }

  private reject(error: Error): void {
    this.errorObj = {error};
    this.status = 'REJECTED';
  }
}

function nullthrows<T>(value: T | null | undefined): T {
  if (value == null) {
    throw Error('Expected no null or undefined');
  }
  return value;
}

export default Promise;
