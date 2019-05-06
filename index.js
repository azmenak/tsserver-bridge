#!/usr/bin/env node

const fs = require("fs");
const { ncp } = require("ncp");
const path = require("path");
const yargs = require("yargs");
const rimraf = require("rimraf");

if (!fs.existsSync(path.join("node_modules", "typescript"))) {
  console.error("typescript not installed in node_modules");
  process.exit(1);
}

const argv = yargs
  .option("memory", {
    alias: "m",
    describe: "Memory limit for tsserver in kb"
  })
  .option("destination", {
    alias: "d",
    describe: "Destination directory (default .vscode)"
  })
  .demandOption(["memory"])
  .help().argv;

const memory = argv.memory;

if (!Number.isFinite(memory)) {
  console.error("Memory value must be a number");
  process.exit(1);
}

if (memory <= 0) {
  console.error("Memory value must a positive number");
  process.exit(1);
}

const destination = argv.destination || ".vscode";

const BRIDGE_TEMPLATE = `
const { spawn } = require("child_process");
const path = require("path");

const nextArgv = process.argv.slice(2);

nextArgv.unshift(path.resolve(__dirname, "./_tsserver.js"));
nextArgv.push("--max_old_space_size=4096");

spawn("node", nextArgv, {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit"
});
`;

function copyTypescript() {
  return new Promise((resolve, reject) => {
    const source = path.join("node_modules", "typescript", "lib");
    const dest = path.join(destination, "typescript");

    if (fs.existsSync(dest)) {
      rimraf.sync(dest);
    }

    ncp(source, dest, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function renameTsserver() {
  const oldPath = path.join(destination, "typescript", "tsserver.js");
  const newPath = path.join(destination, "typescript", "_tsserver.js");

  fs.renameSync(oldPath, newPath);
}

function writeBridgeFile() {
  const filePath = path.join(destination, "typescript", "tsserver.js");
  fs.writeFileSync(filePath, BRIDGE_TEMPLATE);
}

async function run() {
  await copyTypescript();
  renameTsserver();
  writeBridgeFile();

  console.info("Created typescript bridge");
}

run();
