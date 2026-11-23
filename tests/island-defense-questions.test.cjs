const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../island-defense/index.html'), 'utf8');
const source = html.match(/<script>(const \$=id[\s\S]*?)const islands=/)?.[1];
assert.ok(source, 'The island defense question generator must load from the game entry');

function generator(unit, difficulty) {
  let seed = 0x543210ed;
  const math = Object.create(Math);
  math.random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const document = { getElementById: () => ({ value: unit }) };
  const context = vm.createContext({ Math: math, document });
  vm.runInContext(source, context);
  return vm.runInContext(`diff=${difficulty}; () => { score++; return question(); }`, context);
}

function calculate(unit, question) {
  const plain = question.txt.replaceAll('−', '-');
  const nums = (plain.match(/-?\d+/g) || []).map(Number);
  const [a, b, c, d] = nums;
  switch (unit) {
    case 0:
      return /×/.test(plain) ? b + d : /÷/.test(plain) ? b - d : b * c;
    case 1:
      if (/ \+ /.test(plain)) return a / b + c / d;
      if (/ - /.test(plain)) return a / b - c / d;
      if (/ × /.test(plain)) return a / b * (c / d);
      return (a / b) / (c / d);
    case 2: {
      const [, first, firstSign, second, third, secondSign, fourth] =
        /^\((\d+)x ([+-]) (\d+)\) \+ \((\d+)x ([+-]) (\d+)\)$/.exec(plain);
      const coefficient = Number(first) + Number(third);
      const constant = Number(firstSign + second) + Number(secondSign + fourth);
      return `${coefficient}x${constant ? ` ${constant < 0 ? '-' : '+'} ${Math.abs(constant)}` : ''}`;
    }
    case 3: {
      const [, coefficient, sign, constant, total] =
        /^(\d+)x ([+-]) (\d+) = (-?\d+)$/.exec(plain);
      return (Number(total) - Number(sign + constant)) / Number(coefficient);
    }
    case 4: {
      const common = Array.from({ length: Math.min(a, b) }, (_, i) => i + 1)
        .filter((divisor) => a % divisor === 0 && b % divisor === 0)
        .at(-1);
      return plain.includes('最大公因數') ? common : a * b / common;
    }
    case 5:
      if (/\) \+ /.test(plain)) return a + b;
      if (/\) - /.test(plain)) return a - b;
      return a * b;
    case 6: {
      const correct = question.opts.map(Number).filter((option) =>
        plain.includes('因數')
          ? a % option === 0
          : Array.from({ length: Math.floor(Math.sqrt(option)) - 1 }, (_, i) => i + 2)
            .every((divisor) => option % divisor !== 0)
      );
      assert.deepEqual(Array.from(correct), [Number(question.ans)]);
      return correct[0];
    }
    default:
      throw new Error(`Unknown unit ${unit}`);
  }
}

function checkAnswer(unit, question) {
  assert.equal(question.opts.length, 4);
  assert.equal(new Set(question.opts).size, 4);
  const expected = calculate(unit, question);
  const matching = question.opts.filter((option) => {
    const normalized = option.replaceAll('−', '-');
    if (unit === 2) return normalized === expected;
    const [numerator, denominator = 1] = normalized.split('/').map(Number);
    return Math.abs(numerator / denominator - expected) < 1e-10;
  });
  assert.deepEqual(Array.from(matching), [question.ans]);
}

const units = ['指數律', '分數四則', '一元一次式', '一元一次方程式', '最大公因數與最小公倍數', '正負數四則', '因數與質數'];
for (const [unit, name] of units.entries()) {
  test(`${name} · three difficulties, 300 questions`, () => {
    for (const difficulty of [0, 1, 2]) {
      const next = generator(unit, difficulty);
      let previous;
      for (let i = 0; i < 100; i++) {
        const question = next();
        checkAnswer(unit, question);
        const key = unit === 6 ? question.txt + [...question.opts].sort().join(',') : question.txt;
        assert.notEqual(key, previous, 'Adjacent questions must not repeat');
        previous = key;
      }
    }
  });
}

test('mixed mode supplies valid questions from all seven units', () => {
  const next = generator(7, 2);
  const testedUnits = new Set();
  const patterns = [/<sup>/, /class="frac"/, /^\(\d+x/, /x.*=/, /公因數|公倍數/, /^\(/, /^哪一個/];
  for (let i = 0; i < 200; i++) {
    const question = next();
    const unit = patterns.findIndex((pattern) => pattern.test(question.txt));
    checkAnswer(unit, question);
    testedUnits.add(unit);
  }
  assert.equal(testedUnits.size, units.length);
});

test('all game scripts parse before the cover can accept input', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0);
  for (const [i, [, script]] of scripts.entries()) {
    new vm.Script(script, { filename: `island-defense/index.html script ${i + 1}` });
  }
});
