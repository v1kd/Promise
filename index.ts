import Promise from "./src/Promise";

const p1 = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('Some string');
  }, 1000);
});

// p1.then(val => val + 1)
//   .then(val => {
//     throw new Error('Hello');
//   })
//   .then(val => val + 1)
//   .then(val => console.log(val))
//   .catch(val => console.log('rejected', val));

p1.then((val) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(val);
  }, 1000);
}))
.then(val => console.log('resolved', val));

