const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const gameplay = scripts.find(script => script.includes('function question()'));

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  assert(from >= 0 && to > from, 'Could not locate the inline quiz generator');
  return source.slice(from, to);
}

function loadQuiz() {
  const unit = { value: '0' };
  const context = vm.createContext({ document: { getElementById: () => unit } });
  vm.runInContext(
    `let seed = 0x712a11;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 0x100000000;
    };
    let diff, score, seen = new Set();
    ${between(gameplay, 'const $=', ',heroes=')};
    ${between(gameplay, 'const frac=', 'function tone(')}
    `,
    context
  );
  return (unitIndex, difficulty, progress, reset) => {
    unit.value = String(unitIndex);
    Object.assign(context, { difficulty, progress, reset });
    const question = vm.runInContext(
      'diff = difficulty; score = progress; if (reset) seen.clear(); question()',
      context
    );
    return { ...question, opts: [...question.opts] };
  };
}

function divides(n, d) {
  return d !== 0 && n % d === 0;
}

function prime(n) {
  if (n < 2) return false;
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (divides(n, divisor)) return false;
  }
  return true;
}

function simplify(expression) {
  return (expression.match(/\d+x(?:[+-]\d+)?/g) || [])
    .map(term => term.split('x').map(Number))
    .reduce(([coefficient, constant], [a, b]) => [coefficient + a, constant + b], [0, 0]);
}

function isCorrect(prompt, option) {
  const expression = prompt.replaceAll('−', '-');
  const terms = (expression.match(/-?\d+/g) || []).map(Number);
  const answer = Number(option);
  if (expression.includes('<sup>')) {
    const [, left, right, power] = terms;
    if (expression.includes('×')) return answer === left + power;
    if (expression.includes('÷')) return answer === left - power;
    return answer === left * right;
  }
  if (expression.includes('class="frac"')) {
    const [a, b, c, d] = terms;
    const [numerator, denominator = 1] = option.split('/').map(Number);
    if (expression.includes('×')) return numerator * b * d === denominator * a * c;
    if (expression.includes('÷')) return numerator * b * c === denominator * a * d;
    if (expression.includes(' - ')) return numerator * b * d === denominator * (a * d - b * c);
    return numerator * b * d === denominator * (a * d + b * c);
  }
  if (expression.includes('x')) {
    const compact = expression.replaceAll(' ', '');
    if (compact.includes('=')) {
      const [, a, b, c] = compact.match(/^(\d+)x([+-]\d+)=(-?\d+)$/).map(Number);
      return a * answer + b === c;
    }
    return simplify(compact).join() === simplify(option.replaceAll('−', '-').replaceAll(' ', '')).join();
  }
  if (expression.includes('最大公因數') || expression.includes('最小公倍數')) {
    const [a, b] = terms;
    let divisor = Math.min(a, b);
    while (!divides(a, divisor) || !divides(b, divisor)) divisor--;
    return answer === (expression.includes('最大公因數') ? divisor : a * b / divisor);
  }
  if (expression.includes('的因數')) return divides(terms[0], answer);
  if (expression.includes('是質數')) return prime(answer);
  const [, left, op, right] = expression.match(/\((-?\d+)\) ([+×-]) \((-?\d+)\)/);
  if (op === '×') return answer === Number(left) * Number(right);
  if (op === '-') return answer === Number(left) - Number(right);
  return answer === Number(left) + Number(right);
}

test('all inline scripts compile and the formula stays together in a text container', () => {
  assert(scripts.length > 0);
  for (const script of scripts) new vm.Script(script);
  assert.match(html, /<div class="question"><span id="question"><\/span><\/div>/);
});

test('seven math units and mixed review produce one uniquely correct answer', () => {
  const quiz = loadQuiz();
  for (let unit = 0; unit < 8; unit++) {
    for (let difficulty = 0; difficulty < 3; difficulty++) {
      for (let round = 0; round < 10; round++) {
        const seen = new Set();
        for (let score = 0; score < 10; score++) {
          const question = quiz(unit, difficulty, score, score === 0);
          const description = JSON.stringify({ unit, difficulty, round, score, ...question });
          assert.equal(question.opts.length, 4, description);
          assert.equal(new Set(question.opts).size, 4, description);
          assert.deepEqual(
            question.opts.filter(option => isCorrect(question.txt, option)),
            [question.ans],
            description
          );
          const key = question.txt.includes('因數？') || question.txt.includes('質數？')
            ? JSON.stringify([question.txt, [...question.opts].sort()])
            : question.txt;
          assert(!seen.has(key), description);
          seen.add(key);
        }
      }
    }
  }
});
