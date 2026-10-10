const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");
const keys = document.querySelector(".keys");

let current = "0";      // number being typed
let previous = null;    // first number
let operator = null;    // + - * /
let justEvaluated = false;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  let result;
  switch (op) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) return "Can't divide by 0";
      result = a / b;
      break;
    default: return b;
  }
  return String(parseFloat(result.toPrecision(12)));
}

function updateDisplay() {
  currentEl.textContent = current;
  historyEl.textContent =
    previous !== null && operator ? `${previous} ${symbols[operator]}` : "";

  document.querySelectorAll(".op").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.value === operator && current === "0" && !justEvaluated && previous !== null
    );
  });
}

function resetIfError() {
  if (current === "Can't divide by 0") clearAll();
}

function inputNumber(n) {
  resetIfError();
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (current === "0") current = n;
  else if (current.replace(/[-.]/g, "").length < 15) current += n;
  updateDisplay();
}

function inputDecimal() {
  resetIfError();
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (!current.includes(".")) current += ".";
  updateDisplay();
}

function chooseOperator(op) {
  resetIfError();
  if (operator && previous !== null && !justEvaluated && current !== "0") {
    previous = calculate(previous, current, operator);
  } else if (previous === null || justEvaluated || !operator) {
    previous = current;
  }
  operator = op;
  current = "0";
  justEvaluated = false;
  updateDisplay();
}

function equals() {
  if (operator === null || previous === null) return;
  const result = calculate(previous, current, operator);
  historyEl.textContent = `${previous} ${symbols[operator]} ${current} =`;
  current = result;
  previous = null;
  operator = null;
  justEvaluated = true;
  currentEl.textContent = current;
  document.querySelectorAll(".op").forEach((b) => b.classList.remove("active"));
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  resetIfError();
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
  updateDisplay();
}

function percent() {
  resetIfError();
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

// Button clicks
keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const { action, value } = btn.dataset;

  if (action === "number") inputNumber(value);
  else if (action === "decimal") inputDecimal();
  else if (action === "operator") chooseOperator(value);
  else if (action === "equals") equals();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
  else if (action === "percent") percent();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
  else if (e.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(e.key)) {
    e.preventDefault();
    chooseOperator(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    equals();
  } else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
});

updateDisplay();
