export interface DiceRoll {
    tries: number;
    numDice: number;
    die: number;
    plus: number;
    div: number;
    kf: boolean;
}

export interface DiceRollResult {
    value: number;
    details: string;
}

const PATTERN = /(?<numDice>\d+)?k(?<die>\d+)(?:\/(?<div>\d+))?(?<plus>[+-]\d+)?(?:\((?<tries>\d+)x\))?(?:\+kf(?<kf>))?/;

let random = Math.random;

const _roll = (dice: DiceRoll, ijasz: boolean): DiceRollResult => {
    let result = [...Array(dice.tries).keys()].map(_ => rollDice(dice, ijasz)).reduce((acc, curr) => ({ value: Math.max(acc.value, curr.value), details: `${acc.details ? acc.details + ' or ' : ''}(${curr.details})` }), { value: 0, details: '' });
    result = {
        value: result.value + dice.plus,
        details: `${result.details}${dice.plus > 0 ? ' + ' + dice.plus : (dice.plus < 0 ? ' - ' + Math.abs(dice.plus) : '')}`
    };
    if (dice.kf) {
        return rollKf(dice, result);
    } else {
        return result;
    }

}

const rollDice = (dice: DiceRoll, ijasz: boolean): DiceRollResult => {
    return [...Array(dice.numDice).keys()].map(_ => rollSingle(dice, ijasz)).reduce((acc, curr) => ({ value: acc.value + curr, details: `${acc.details ? acc.details + '+' : ''}${curr}` }), { value: 0, details: '' });
}

const rollSingle = (dice: DiceRoll, ijasz: boolean): number => {
    let res = 0;
    let curr = 0;
    do {
        curr = 1 + Math.floor(random() * dice.die);
        res += Math.ceil(curr / dice.div);
    } while (ijasz && curr === dice.die)
    return res;
}

const rollKf = (dice: DiceRoll, result: DiceRollResult): DiceRollResult => {
    const max = dice.numDice * Math.floor(dice.die / dice.div) + dice.plus;
    if (result.value === max) {
        let kfMod;
        const kf = roll('k100').value;
        if (kf <= 20) {
            kfMod = -roll('k6').value;
        } else if (kf <= 50) {
            kfMod = -1;
        } else if (kf <= 75) {
            kfMod = 0;
        } else if (kf <= 95) {
            kfMod = 1;
        } else {
            kfMod = 2;
        }
        return {
            value: result.value + kfMod,
            details: `${result.details} (kf: ${kf} / ${kfMod})`
        }
    } else {
        return result;
    }

}

export const roll = (dice: DiceRoll | string, ijasz?: boolean): DiceRollResult => _roll(typeof dice === 'string' ? parseDiceRoll(dice) : dice, !!ijasz);

export const rollSource = (randomFn: () => number): void => { random = randomFn }

export const parseDiceRoll = (roll: number | string = '0'): DiceRoll => {
    if (!Number.isNaN(Number(roll))) {
        return {
            numDice: 0,
            die: 0,
            plus: Number(roll),
            tries: 1,
            div: 1,
            kf: false
        };
    }
    const res = String(roll).replace(/\s/g, '').match(PATTERN);
    return {
        numDice: Number(res?.groups?.numDice ?? 1),
        die: Number(res?.groups?.die ?? 0),
        plus: Number(res?.groups?.plus ?? 0),
        tries: Number(res?.groups?.tries ?? 1),
        div: Number(res?.groups?.div ?? 1),
        kf: res?.groups?.kf !== undefined
    }
}

export const formatDiceRoll = (dice: DiceRoll | number): string => {
    dice = typeof dice === 'number' ? parseDiceRoll(dice) : dice;
    if (dice.die === 0) {
        return dice.plus ? `${dice.plus}` : '-';
    };
    return `${dice.numDice === 1 ? '' : dice.numDice}k${dice.die}${dice.div > 1 ? '/' + dice.div : ''}${dice.plus ? (dice.plus > 0 ? '+' : '-') + Math.abs(dice.plus) : ''}${dice.tries > 1 ? '(' + dice.tries + 'x)' : ''}${dice.kf ? ' + kf' : ''}`;
}

export const formatResult = (result: DiceRollResult): string => {
    return `${result.value} (${result.details})`
}

export const sumRolls = (rolls: Array<DiceRoll>): DiceRoll => {
    const ret: DiceRoll = parseDiceRoll();
    rolls.forEach(r => {
        if (r.tries > 1 || r.kf) {
            throw new Error('can\'t sum rolls with multiple tries or kf');
        }
        if (ret.die !== 0 && r.die !== 0 && r.die !== ret.die) {
            throw new Error('can\'t sum rolls with different dies');
        }
        if (ret.div !== 1 && r.div !== 1 && ret.div !== r.div) {
            throw new Error('can\'t sum rolls with different divisors');
        }
        if (r.die !== 0) {
            ret.die = r.die;
            ret.numDice += r.numDice;
        }
        if (r.plus !== 0) {
            ret.plus += r.plus;
        }
        if (r.div > 1) {
            ret.div = r.div;
        }
    })
    return ret;
};
