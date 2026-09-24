/* ============================================================
   Task 0 — JavaScript Refresher
   Each task lives in its own function and prints to the page.
   ============================================================ */

// ---------- output helpers ----------

// compact one-line rendering: no quoted keys, arrays stay on a single line
const inline = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) return `[${value.map(inline).join(", ")}]`;
  return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${inline(v)}`).join(", ")} }`;
};

// a list of objects is easier to read one object per line
const show = (value) => {
  if (typeof value === "string") return value;

  const flat = inline(value);
  if (flat.length <= 80) return flat;

  if (Array.isArray(value)) {
    return `[\n  ${value.map(inline).join(",\n  ")}\n]`;
  }
  return `{\n  ${Object.entries(value).map(([k, v]) => `${k}: ${inline(v)}`).join(",\n  ")}\n}`;
};

const print = (id, key, value) => {
  const box = document.getElementById(id);
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<span class="k">${key}</span><span class="v">${show(value)}</span>`;
  box.appendChild(row);
  console.log(key, value);
};


/* ============================================================
   1 — Variables and Data Types
   ============================================================ */
(function task1() {
  const name = "Erasyl";               // string  — primitive
  let age = 20;                         // number  — primitive
  let isActive = true;                  // boolean — primitive
  const courses = ["React", "Algorithms", "Databases"];   // array  — reference
  const address = { city: "Almaty", street: "Abay 1" };   // object — reference

  const middleName = null;              // explicitly "empty"
  let nickname;                         // undefined — no value assigned

  print("out1", "name", `${name} → typeof: ${typeof name}`);
  print("out1", "age", `${age} → typeof: ${typeof age}`);
  print("out1", "isActive", `${isActive} → typeof: ${typeof isActive}`);
  print("out1", "courses", `${inline(courses)} → typeof: ${typeof courses} (Array.isArray: ${Array.isArray(courses)})`);
  print("out1", "address", `${inline(address)} → typeof: ${typeof address}`);
  print("out1", "middleName (null)", `${middleName} → typeof: ${typeof middleName}  // known JS bug`);
  print("out1", "nickname (undefined)", `${nickname} → typeof: ${typeof nickname}`);
  print("out1", "primitive values", "name, age, isActive, middleName, nickname");
  print("out1", "reference values", "courses, address");
  print("out1", "template literal", `${name} is ${age} years old, lives in ${address.city}, taking ${courses.length} courses.`);
})();


/* ============================================================
   2 — Arrays
   ============================================================ */
(function task2() {
  const numbers = [3, 7, 2, 10, 5];

  const doubled = numbers.map((n) => n * 2);
  const bigger = numbers.filter((n) => n > 5);
  const firstBigger = numbers.find((n) => n > 5);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  const hasTen = numbers.includes(10);

  print("out2", "original array", numbers);
  print("out2", "map — every number × 2", doubled);
  print("out2", "filter — greater than 5", bigger);
  print("out2", "find — first one > 5", firstBigger);
  print("out2", "reduce — sum", sum);
  print("out2", "includes — does 10 exist", hasTen);
  print("out2", "original is unchanged", numbers);
})();


/* ============================================================
   3 — Arrays of Objects
   ============================================================ */
(function task3() {
  const students = [
    { id: 1, name: "Anna", grade: 85 },
    { id: 2, name: "John", grade: 62 },
    { id: 3, name: "Sara", grade: 91 },
    { id: 4, name: "Mike", grade: 55 },
  ];

  const passed = students.filter((s) => s.grade >= 70);
  const names = students.map((s) => s.name);
  const byId = students.find((s) => s.id === 3);
  const best = students.reduce((top, s) => (s.grade > top.grade ? s : top));
  const average = students.reduce((acc, s) => acc + s.grade, 0) / students.length;
  // a new array of new objects — the originals stay untouched
  const withStatus = students.map((s) => ({ ...s, passed: s.grade >= 70 }));

  print("out3", "grade >= 70", passed);
  print("out3", "names", names);
  print("out3", "student with id = 3", byId);
  print("out3", "highest grade", best);
  print("out3", "average grade", average.toFixed(2));
  print("out3", "with passed field", withStatus);
  print("out3", "original has no passed", students);
})();


/* ============================================================
   4 — Objects
   ============================================================ */
(function task4() {
  const user = {
    id: 1,
    name: "Anna",
    age: 21,
    address: { city: "Almaty", street: "Abay 1" },
  };

  print("out4", "user.name", user.name);
  print("out4", "user.address.city", user.address.city);

  user.age = 22;                        // changed
  user.email = "anna@mail.com";         // added
  delete user.address.street;           // removed

  print("out4", "after the changes", user);

  const { name, age } = user;                        // plain destructuring
  const { address: { city } } = user;                // nested
  const { name: userName } = user;                   // with renaming

  print("out4", "destructured name, age", `${name}, ${age}`);
  print("out4", "nested — city", city);
  print("out4", "renamed name → userName", userName);
})();


/* ============================================================
   5 — Values and References
   ============================================================ */
(function task5() {
  const original = { name: "Alice", score: 10 };
  const copy = original;                // copies the REFERENCE, not the object
  copy.score = 99;

  print("out5", "original after copy.score = 99", original);
  print("out5", "why", "copy and original are the same box in memory");

  const original2 = { name: "Alice", score: 10 };
  const spreadCopy = { ...original2 };  // a brand new object
  spreadCopy.score = 99;

  print("out5", "spread copy changed", spreadCopy);
  print("out5", "original untouched", original2);

  // nested objects
  const user = { name: "Alice", address: { city: "Almaty" } };
  const shallow = { ...user };
  shallow.address.city = "Astana";

  print("out5", "shallow copy", shallow);
  print("out5", "and the original?", user);
  print("out5", "conclusion", "spread copies only the top level — address stayed shared");

  // copying the nested object properly
  const user2 = { name: "Alice", address: { city: "Almaty" } };
  const deep = { ...user2, address: { ...user2.address } };
  deep.address.city = "Astana";

  print("out5", "proper copy changed", deep);
  print("out5", "original untouched", user2);
  print("out5", "alternative", "structuredClone(user) — a full deep copy");
})();


/* ============================================================
   6 — Functions
   ============================================================ */
function isEven(number) {               // normal function syntax
  return number % 2 === 0;
}
const isEvenArrow = (number) => number % 2 === 0;   // the same as an arrow function

const getFullName = (firstName, lastName) => `${firstName} ${lastName}`;
const calculatePrice = (price, quantity) => price * quantity;
const calculateDiscount = (price, percent) => price - (price * percent) / 100;
const getMax = (a, b) => (a > b ? a : b);

(function task6() {
  print("out6", "isEven(4) — normal", isEven(4));
  print("out6", "isEvenArrow(7) — arrow", isEvenArrow(7));
  print("out6", "getFullName('Anna','Ivanova')", getFullName("Anna", "Ivanova"));
  print("out6", "calculatePrice(1500, 3)", calculatePrice(1500, 3));
  print("out6", "calculateDiscount(2000, 15)", calculateDiscount(2000, 15));
  print("out6", "getMax(10, 42)", getMax(10, 42));
})();


/* ============================================================
   7 — Functions as Values
   ============================================================ */
(function task7() {
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;

  // operation is a function passed in as a value
  const calculate = (a, b, operation) => operation(a, b);

  print("out7", "calculate(5, 3, add)", calculate(5, 3, add));
  print("out7", "calculate(5, 3, multiply)", calculate(5, 3, multiply));
  print("out7", "typeof add", typeof add);
  print("out7", "add (no parentheses)", "the function itself — a value");
  print("out7", "add(5, 3) (with parentheses)", add(5, 3));
})();


/* ============================================================
   8 — Scope
   ============================================================ */
const message = "global";

(function task8() {
  print("out8", "global level", message);

  function showScopes() {
    const message = "function";         // shadows the global one
    print("out8", "inside the function", message);

    if (true) {
      const message = "block";          // shadows the function one
      print("out8", "inside the if block", message);
    }

    print("out8", "after the block again", message);
  }
  showScopes();

  // var / let / const inside a block
  if (true) {
    var varValue = "I am var";
    let letValue = "I am let";
    const constValue = "I am const";
  }

  print("out8", "var outside the block", varValue);       // works
  try {
    print("out8", "let outside the block", letValue);
  } catch (e) {
    print("out8", "let outside the block", `error: ${e.name} — block scoped`);
  }
  try {
    print("out8", "const outside the block", constValue);
  } catch (e) {
    print("out8", "const outside the block", `error: ${e.name} — block scoped`);
  }
})();


/* ============================================================
   9 — Closure
   ============================================================ */
(function task9() {
  function createCounter() {
    let count = 0;                      // lives inside the closure
    return function () {
      count += 1;
      return count;
    };
  }

  const counter = createCounter();
  print("out9", "counter()", counter());
  print("out9", "counter()", counter());
  print("out9", "counter()", counter());

  const counter2 = createCounter();     // a new independent environment
  print("out9", "second counter2()", counter2());
  print("out9", "first counter() keeps going", counter());

  const createAdder = (value) => (number) => value + number;

  const addFive = createAdder(5);
  const addTen = createAdder(10);
  print("out9", "addFive(10)", addFive(10));
  print("out9", "addFive(20)", addFive(20));
  print("out9", "addTen(20)", addTen(20));
})();


/* ============================================================
   10 — Destructuring, Spread and Rest
   ============================================================ */
(function task10() {
  const numbers = [10, 20, 30, 40];
  const [first, second] = numbers;
  print("out10", "first two values", `${first}, ${second}`);

  const user = { id: 1, name: "Anna", age: 21 };
  const { name, age } = user;
  print("out10", "name, age from the object", `${name}, ${age}`);

  const numbersPlus = [...numbers, 50];
  const olderUser = { ...user, age: 22 };
  const userWithEmail = { ...user, email: "anna@mail.com" };
  const combined = [...numbers, ...[60, 70]];

  print("out10", "array + 50 (spread)", numbersPlus);
  print("out10", "new user with age 22", olderUser);
  print("out10", "new user with an email", userWithEmail);
  print("out10", "two arrays combined", combined);
  print("out10", "originals intact", `${inline(numbers)} | ${inline(user)}`);

  const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);   // rest
  print("out10", "sum(1, 2)", sum(1, 2));
  print("out10", "sum(1, 2, 3, 4)", sum(1, 2, 3, 4));
  print("out10", "sum() — no arguments", sum());
})();


/* ============================================================
   11 — Optional Chaining and Default Values
   ============================================================ */
(function task11() {
  const users = [
    { id: 1, name: "Anna", address: { city: "Almaty" } },
    { id: 2, name: "John" },                        // no address at all
    { id: 3, name: "Sara", address: {} },           // address exists, city does not
  ];

  users.forEach((u) => {
    const city = u.address?.city ?? "City not specified";
    print("out11", `${u.name} → address?.city ?? ...`, city);
  });

  try {
    // this breaks when address may be missing
    const broken = users[1].address.city;
    print("out11", "without ?.", broken);
  } catch (e) {
    print("out11", "users[1].address.city without ?.", `error: ${e.name} (${e.message})`);
  }

  print("out11", "— || vs ?? —", "");
  const values = [0, "", false, null, undefined];
  const labels = ["0", '""', "false", "null", "undefined"];
  values.forEach((v, i) => {
    print("out11", `${labels[i]}`, `|| → "${v || "fallback"}"   ??  → "${v ?? "fallback"}"`);
  });
  print("out11", "conclusion", "|| catches every falsy value, ?? only null and undefined");
})();


/* ============================================================
   FINAL TASK
   ============================================================ */
(function finalTask() {
  const students = [
    { id: 1, name: "Anna", age: 20, grades: [90, 85, 95] },
    { id: 2, name: "John", age: 21, grades: [60, 65, 58] },
    { id: 3, name: "Sara", age: 19, grades: [88, 92, 100] },
    { id: 4, name: "Mike", age: 22, grades: [50, 55, 61] },
    { id: 5, name: "Dana", age: 20, grades: [75, 70, 80] },
  ];

  const before = JSON.stringify(students);

  const getAverage = (grades) =>
    grades.length === 0 ? 0 : grades.reduce((acc, g) => acc + g, 0) / grades.length;

  const getStudentAverage = (student) => getAverage(student.grades);

  const getPassedStudents = (list) => list.filter((s) => getStudentAverage(s) >= 70);

  const getStudentNames = (list) => list.map((s) => s.name);

  const findStudent = (list, id) => list.find((s) => s.id === id);

  const getTopStudent = (list) =>
    list.reduce((top, s) => (getStudentAverage(s) > getStudentAverage(top) ? s : top));

  const summary = students.map(({ id, name, grades }) => {
    const average = Number(getAverage(grades).toFixed(2));
    return { id, name, average, passed: average >= 70 };
  });

  print("outFinal", "getAverage([90, 85, 95])", getAverage([90, 85, 95]).toFixed(2));
  print("outFinal", "getStudentAverage(Sara)", getStudentAverage(students[2]).toFixed(2));
  print("outFinal", "getPassedStudents — names", getStudentNames(getPassedStudents(students)));
  print("outFinal", "getStudentNames(students)", getStudentNames(students));
  print("outFinal", "findStudent(students, 3)", findStudent(students, 3));
  print("outFinal", "getTopStudent(students)", getTopStudent(students).name);
  print("outFinal", "summary array", summary);
  print("outFinal", "data was not mutated", before === JSON.stringify(students) ? "yes ✅" : "no ❌");
})();
