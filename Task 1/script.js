const tasksBody = document.getElementById("tasks");
const summary = document.getElementById("summary");
const output = document.getElementById("output");

const print = (text) => { output.textContent += text + "\n"; };

// ─────────────────────────── Closure ───────────────────────────
function createTask(name, failRate = 0.3) {
  let count = 0;
  let status = "idle";
  let time = 0;

  function simulateLoading() {
    const duration = Math.floor(Math.random() * 1500) + 500; // 500–2000 ms
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < failRate) reject(new Error(`${name} failed`));
        else resolve(duration);
      }, duration);
    });
  }

  return {
    name,
    async run() {
      count++;
      status = "loading";
      render();
      const start = performance.now();
      try {
        await simulateLoading();
        status = "completed";
      } catch (err) {
        status = "failed";
        throw err;
      } finally {
        time = Math.round(performance.now() - start);
        render();
      }
    },
    getCount: () => count,
    getStatus: () => status,
    getTime: () => time,
    reset() {
      count = 0;
      status = "idle";
      time = 0;
      render();
    },
  };
}

const task1 = createTask("Load Users");
const task2 = createTask("Load Posts");
const task3 = createTask("Load Comments");
const tasks = [task1, task2, task3];

function render() {
  tasksBody.innerHTML = tasks
    .map((t) => `
      <tr>
        <td>${t.name}</td>
        <td class="${t.getStatus()}">${t.getStatus()}</td>
        <td>${t.getCount()}</td>
        <td>${t.getTime()}</td>
      </tr>`)
    .join("");
}

const resultLine = (t) =>
  `${t.name} ${t.getStatus() === "completed" ? "Completed" : "Failed"} (${t.getTime()} ms)`;

// ─────────────────────────── Run All Tasks ───────────────────────────
async function runAll() {
  output.textContent = "";

  summary.textContent = "Running concurrently...";
  let start = performance.now();
  await Promise.allSettled(tasks.map((t) => t.run()));
  const concurrentTime = Math.round(performance.now() - start);

  print("Concurrent (Promise.allSettled):");
  tasks.forEach((t) => print("  " + resultLine(t)));
  print(`  Total: ${concurrentTime} ms`);
  summary.textContent = "All tasks finished";

  print("\nSequential (await one by one):");
  start = performance.now();
  try { await task1.run(); } catch {}
  try { await task2.run(); } catch {}
  try { await task3.run(); } catch {}
  const sequentialTime = Math.round(performance.now() - start);

  tasks.forEach((t) => print("  " + resultLine(t)));
  print(`  Total: ${sequentialTime} ms`);

  print(
    "\nWhy different? Sequential starts the next task only after the previous one\n" +
    "finished, so times add up (t1 + t2 + t3). Concurrent starts all timers at once,\n" +
    "so the total is about the slowest task: max(t1, t2, t3)."
  );
  summary.textContent =
    `All tasks finished — Concurrent: ${concurrentTime} ms, Sequential: ${sequentialTime} ms`;
}

// ─────────────────────────── Event Loop Demo ───────────────────────────
function eventLoopDemo() {
  output.textContent = "";
  summary.textContent = "Event Loop Demo";
  const log = (msg) => { console.log(msg); print(msg); };

  log("sync: script start");

  setTimeout(() => log("task: timeout 1"), 0);

  Promise.resolve()
    .then(() => log("microtask: promise 1"))
    .then(() => log("microtask: promise 2 (chained)"));

  async function asyncDemo() {
    log("async: function start");
    await null;
    log("microtask: after await");
  }
  asyncDemo();

  setTimeout(() => {
    log("task: timeout 2");
    Promise.resolve().then(() => log("microtask: promise inside timeout 2"));
  }, 0);

  log("sync: script end");
}

document.getElementById("runAll").addEventListener("click", runAll);
document.getElementById("eventLoop").addEventListener("click", eventLoopDemo);

render();
