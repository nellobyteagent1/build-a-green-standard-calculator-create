let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expression');

function updateDisplay() {
  resultEl.textContent = formatNumber(current);
  document.querySelectorAll('.btn-op[data-op]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.op === operator && resetNext);
  });
}

function formatNumber(val) {
  if (val === 'Error') return val;
  const str = String(val);
  if (str.includes('.') && str.endsWith('.')) return str;
  if (str.includes('.') && str.match(/\..*0+$/)) return str;
  const num = parseFloat(str);
  if (isNaN(num)) return '0';
  if (Math.abs(num) > 999999999999) return num.toExponential(4);
  return String(num);
}

function inputDigit(d) {
  if (current === 'Error') clearAll();
  if (resetNext) {
    current = d;
    resetNext = false;
  } else {
    if (current.replace('-', '').replace('.', '').length >= 12) return;
    current = current === '0' ? d : current + d;
  }
  updateDisplay();
}

function inputDecimal() {
  if (current === 'Error') clearAll();
  if (resetNext) {
    current = '0.';
    resetNext = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function inputOp(op) {
  if (current === 'Error') clearAll();
  if (operator && !resetNext) {
    calculate();
  }
  previous = parseFloat(current);
  operator = op;
  resetNext = true;

  const opSymbols = { '/': '\u00F7', '*': '\u00D7', '-': '\u2212', '+': '+' };
  exprEl.textContent = formatNumber(String(previous)) + ' ' + opSymbols[op];
  updateDisplay();
}

function calculate() {
  if (operator === null || previous === null) return;
  const curr = parseFloat(current);
  let result;
  switch (operator) {
    case '+': result = previous + curr; break;
    case '-': result = previous - curr; break;
    case '*': result = previous * curr; break;
    case '/':
      if (curr === 0) { current = 'Error'; operator = null; previous = null; exprEl.textContent = ''; updateDisplay(); return; }
      result = previous / curr;
      break;
  }
  result = Math.round(result * 1e12) / 1e12;

  const opSymbols = { '/': '\u00F7', '*': '\u00D7', '-': '\u2212', '+': '+' };
  exprEl.textContent = formatNumber(String(previous)) + ' ' + opSymbols[operator] + ' ' + formatNumber(String(curr)) + ' =';

  current = String(result);
  operator = null;
  previous = null;
  resetNext = true;
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetNext = false;
  exprEl.textContent = '';
  updateDisplay();
}

function toggleSign() {
  if (current === 'Error' || current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function inputPercent() {
  if (current === 'Error') return;
  current = String(Math.round(parseFloat(current) / 100 * 1e12) / 1e12);
  resetNext = true;
  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') inputOp('+');
  else if (e.key === '-') inputOp('-');
  else if (e.key === '*') inputOp('*');
  else if (e.key === '/') { e.preventDefault(); inputOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') inputPercent();
  else if (e.key === 'Backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
  }
});
