/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-var-requires */
// const portReachable = require('is-port-reachable');
// const dockerCompose = require('docker-compose');

const isRedisReady = () => {
  return new Promise(async function (resolve, reject) {
    let redisReady = false;
    const redisUrl = `${process.env.KV_REST_API_URL}`;
    while (!redisReady) {
      try {
        const res = await fetch(redisUrl, {
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });
        if (res.status === 200) {
          redisReady = true;
          if (res.statusText === 'OK') {
            console.info('Redis is ready at: ', process.env.KV_REST_API_URL);
          } else console.error(`Redis healthz: ${res.statusText}`);
          resolve();
        }
      } catch (e) {
        console.error(e);
        reject();
      }
    }
  });
};

const isHasuraConsoleReady = () => {
  return new Promise(async function (resolve, reject) {
    // executor (the producing code, "singer")
    const hasuraUrl = `http://localhost:${process.env.HASURA_CONSOLE_PORT}/console`;
    let hasuraReady = false;
    while (!hasuraReady) {
      try {
        const res = await fetch(hasuraUrl);
        if (res.status === 200) {
          hasuraReady = true;
          if (res.statusText === 'OK') {
            console.info('Hasura is ready at: ', hasuraUrl);
          } else console.error(`Hasura healthz: ${res.statusText}`);
          resolve();
        }
      } catch (e) {
        // wait 2sec for hasura to be ready
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  });
};

const isHasuraReady = () => {
  return new Promise(async function (resolve, reject) {
    // executor (the producing code, "singer")
    const hasuraUrl = `http://localhost:${process.env.HASURA_GRAPHQL_SERVER_PORT}/healthz`;
    let hasuraReady = false;
    while (!hasuraReady) {
      try {
        const res = await fetch(hasuraUrl);
        if (res.status === 200) {
          hasuraReady = true;
          if (res.statusText === 'OK') {
            console.info('Hasura is ready at: ', hasuraUrl);
          } else console.error(`Hasura healthz: ${res.statusText}`);
          resolve();
        }
      } catch (e) {
        // wait 2sec for hasura to be ready
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  });
};

// const isAppReady = () => {
//   return new Promise(async function (resolve, reject) {
//     let appReady = false;
//     const appUrl = `http://localhost:${process.env.NEXT_PORT}/`;
//     while (!appReady) {
//       try {
//         const res = await fetch(appUrl);
//         if (res.status === 200) {
//           appReady = true;
//           console.info('Web app is ready at: ', appUrl);
//         }
//         resolve();
//       } catch (e) {
//         // wait 2sec for hasura to be ready
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       }
//     }
//   });
// };

const isServicesLaunched = async () => {
  console.time('setup docker services and check for web app availability');
  await Promise.allSettled([
    isHasuraReady(),
    isHasuraConsoleReady(),
    isRedisReady(),
  ]);

  // // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  // let isAppReachable = await portReachable(process.env.NEXT_PORT);
  // let isHasuraConsoleReachable = await portReachable(process.env.HASURA_CONSOLE_PORT);
  // if (!isAppReachable || !isHasuraConsoleReachable) {
  //   // if (!isHasuraConsoleReachable) {
  //   //   await dockerCompose.upAll({
  //   //     cwd: './',
  //   //     log: true,
  //   //     composeOptions: [['--env-file', '.env.local']],
  //   //   });
  //   // await for hasura to be ready
  //   const hasuraUrl = `http://localhost:${process.env.HASURA_CONSOLE_PORT}/console`;
  //   let hasuraReady = false;
  //   while (!hasuraReady) {
  //     try {
  //       const res = await fetch(hasuraUrl);
  //       if (res.status === 200) {
  //         hasuraReady = true;
  //         if (res.statusText === 'OK') {
  //           console.info('Hasura is ready at: ', hasuraUrl);
  //         } else console.error(`Hasura healthz: ${res.statusText}`);
  //       }
  //     } catch (e) {
  //       // wait 2sec for hasura to be ready
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //     }
  //   }
  //   // }
  //   // if (!isAppReachable) {

  //   // }
  // }
  // 👍🏼 We're ready
  console.timeEnd('setup docker services and check for web app availability');
  console.log('Services ready');
};
isServicesLaunched();
