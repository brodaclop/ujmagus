import { DiceRoll, DiceRollResult, parseDiceRoll, sumRolls } from "./roll";

export interface CalculationStep {
    id: string;
    nev: string;
    value: number | DiceRoll;
}

export const findCalculationStepById = (steps: Array<CalculationStep>, id: string): [CalculationStep | null, number] => {
    const idx = steps.findIndex(s => s.id === id);
    return [idx !== -1 ? steps[idx] : null, idx];
}

export const removeCalculationStep = (steps: Array<CalculationStep> | undefined, id: string): CalculationStep | null => {
    if (!steps) {
        return null;
    }
    const step = findCalculationStepById(steps, id);
    const deleted = steps.splice(step[1], 1);
    return deleted.length !== 0 ? deleted[0] : null;
}

export const removeAllCalculationSteps = (steps: Array<CalculationStep> | undefined): Array<CalculationStep> | null => {
    if (!steps) {
        return null;
    }
    return steps.splice(0, steps.length);
}

export const replaceCalculationStep = (steps: Array<CalculationStep>, id: string, value: CalculationStep['value']) => {
    const step = findCalculationStepById(steps, id);
    if (step[0]) {
        step[0].value = value;
    }
}

export const aggregateCalculation = (steps: Array<CalculationStep>): DiceRoll => {
    return sumRolls(steps.map(step => typeof step.value === 'number' ? parseDiceRoll(step.value) : step.value));
}