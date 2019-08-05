import Promise from "./src/Promise";

const p1 = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p1.then(val => val + 1)
  .then(val => val + 1)
  .then(val => val + 1)
  .then(val => console.log(val));
