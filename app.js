// cPanel (Node.js App / Phusion Passenger) startup file.
// Dynamic import works whether cPanel starts this file as CommonJS or ESM.
// Passenger supplies PORT; the bundled Node server listens on it automatically.
import("./dist/server/index.mjs").catch((error) => {
  console.error("Hotstep server failed to start:", error);
  process.exitCode = 1;
});
