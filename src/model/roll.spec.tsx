import { roll, rollSource } from './roll';


describe('roll.tsx', () => {
    const arrayRnd = (input: Array<number>): () => number => {
        let next = 0;
        return () => input[next++];
    }
    describe('roll()', () => {
        it('does single rolls', () => {
            rollSource(arrayRnd([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6]));
            const res = roll('6k6');
            expect(res).toEqual({
                value: 21,
                details: '(1+2+3+4+5+6)'
            });
        });
        it('does divided rolls', () => {
            rollSource(arrayRnd([5 / 6]));
            const res = roll('1k6/2');
            expect(res).toEqual({
                value: 3,
                details: '(3)'
            });
        });
        it('does double rolls', () => {
            rollSource(arrayRnd([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6]));
            const res = roll('3k6(2x)');
            expect(res).toEqual({
                value: 15,
                details: '(1+2+3) or (4+5+6)'
            });
        });
        it('does plus rolls', () => {
            rollSource(arrayRnd([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6]));
            const res = roll('2k6+6');
            expect(res).toEqual({
                value: 9,
                details: '(1+2) + 6'
            });
        });
        it('does archery', () => {
            rollSource(arrayRnd([0, 5 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6]));
            const res = roll('3k6+2', true);
            expect(res).toEqual({
                value: 16,
                details: '(1+9+4) + 2'
            });
        });
    })
});