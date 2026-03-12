const { spawn } = require("child_process");

const children = [];

function start(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    const normalized = typeof code === "number" ? code : 0;
    if (normalized !== 0) {
      console.error(`[${name}] exited with code ${normalized}`);
    }

    // If one process exits, terminate the others to keep behavior predictable.
    for (const proc of children) {
      if (proc !== child && !proc.killed) {
        proc.kill();
      }
    }

    process.exit(normalized);
  });

  children.push(child);
}

start("backend", "npm", ["--prefix", "backend", "run", "dev"]);
start("frontend", "npm", ["--prefix", "frontend", "run", "dev"]);

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
