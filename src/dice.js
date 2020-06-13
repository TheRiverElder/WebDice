
// const DICE_ITEM_EXPR = /((\d+)(\*|x))?(\d+)(d(\d+)?|db)((\*|x)(\d+))?/i;
const REG_NUMBER = /(\d+)?\.?\d+/iy;

// 某些固定字符串
function parseSeqs(s, ...seqs) {
    for (let seq of seqs) {
        if (s.str.startsWith(seq, s.index)) {
            s.index += seq.length;
            return seq;
        }
    }
    return null;
}
// 某个固定字符串
function parseSeq(s, seq) {
    if (s.str.startsWith(seq, s.index)) {
        s.index += seq.length;
        return true;
    }
    return false;
}
// 可以产生数值的表达式
function parseValue(s) {
    return parseClosure(s) ||
        parsePrefixed(s) ||
        parseSingle(s) ||
        parseNumber(s);
}
// 闭包，由括号包起来的部分'('与')'
function parseClosure(s) {
    const start = s.index;
    let val = null;
    if (parseSeq(s, '(') &&
        (val = parseDice(s)) &&
        parseSeq(s, ')')
    ) {
        return val;
    }
    s.index = start;
    return null;
}
// 数字，可以是整数或实数
function parseNumber(s) {
    if (parseSeq(s, '半')) {
        return () => 0.5;
    }
    REG_NUMBER.lastIndex = s.index;
    const res = REG_NUMBER.exec(s.str);
    if (res) {
        s.index += res[0].length;
        const r = Number(res[0]);
        return () => r;
    }
    return null;
}
// 单个骰子表达式，如'1d100'、'd100'
function parseSingle(s) {
    const start = s.index;
    let faces = null;
    let times = parseNumber(s) || parseClosure(s);
    if (parseSeq(s, 'd') && (faces = parseValue(s))) {
        return () => rollSingle(times(), faces());
    }
    s.index = start;
    return null;
}
// 带有正负号的表达式，'+'、'-'
function parsePrefixed(s) {
    const start = s.index;
    let positive = true;
    if (parseSeq(s, '+')) {
        positive = true;
    } else if (parseSeq(s, '-')) {
        positive = false;
    } else {
        return null;
    }
    let val = parseValue(s);
    if (val) {
        return positive ? val : () => -val();
    }
    s.index = start;
    return false;
}
// 加减法的项
function parseTerm(s) {
    let start = s.index;
    const factors = [];
    let first = parseValue(s);
    if (first) {
        factors.push(first);
        let right = null;
        start = s.index;
        while (parseSeqs(s, '*', 'x')) {
            if ((right = parseValue(s))) {
                factors.push(right);
                start = s.index;
            } else {
                s.index = start;
                break;
            }
        }
    }
    if (factors.length > 0) {
        return factors.length === 1 ? factors[0] : () => factors.reduce((p, e) => p * e(), 1);
    }
    s.index = start;
    return null;
}
// 最终骰子
function parseDice(s) {
    let start = s.index;
    const terms = [];
    let first = parseTerm(s);
    if (first) {
        terms.push(first);
        let right = null;
        let sign = null;
        while ((sign = parseSeqs(s, '+', '-'))) {
            if ((right = parseTerm(s))) {
                terms.push(sign === '-' ? () => -right() : right);
                start = s.index;
            } else {
                s.index = start;
                break;
            }
        }
    }
    if (terms.length > 0) {
        return terms.length === 1 ? terms[0] : () => terms.reduce((p, e) => p + e(), 0);
    }
    s.index = start;
    return null;
}

function rollSingle(times, faces) {
    let sum = 0;
    for (let i = 0; i < times; i++) {
        sum += randInt(faces);
    }
    return sum;
}

function randInt(max, offset = 1) {
    return Math.floor(Math.random() * max) + offset;
}

export function tryParseDice(raw) {
    if (!raw) {
        return null;
    }
    const original = raw.replace(/\s+/g, '').toLowerCase();
    const state = {str: original, index: 0};
    const dice = parseDice(state);
    return state.index === state.str.length ? dice : null;
}