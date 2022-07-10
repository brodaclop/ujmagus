import { _ } from "ag-grid-community";
import { CalculationStep, removeAllCalculationSteps } from "../Calculation";
import { InventoryKozelharcFegyver, Karakter, Kez } from "../karakter/Karakter";
import { CalculatedHarcertek, KarakterHarcertek } from "../karakter/KarakterHarcertek";
import { getKepzettseg } from '../Kepzettseg';

export interface Harcmodor {
    id: string;
    nev: string;
    harcertekCalculation: (karakterHarcertek: KarakterHarcertek, harcertek: CalculatedHarcertek) => void;
    selectable: (karakter: Karakter) => boolean;
}

const findCalculationStepById = (steps: Array<CalculationStep>, id: string): [CalculationStep | null, number] => {
    const idx = steps.findIndex(s => s.id === id);
    return [idx !== -1 ? steps[idx] : null, idx];
}

const removeCalculationStep = (steps: Array<CalculationStep>, id: string): CalculationStep | null => {
    const step = findCalculationStepById(steps, id);
    const deleted = steps.splice(step[1], 1);
    return deleted.length !== 0 ? deleted[0] : null;
}


export const PajzsHarcmodor: Harcmodor = {
    id: 'harcmodor:pajzs',
    nev: getKepzettseg('harcmodor:pajzs')?.nev ?? '',
    selectable: karakter => {
        const { bal, jobb } = karakter.kezek;
        const ketKez = !!bal && !!jobb;
        const hasPajzs = bal?.fegyver.pajzstype === 'nagy' || jobb?.fegyver.pajzstype === 'nagy';
        //TODO: esetleg csekkolhatnank a fegyvert is
        return ketKez && hasPajzs;
    },
    harcertekCalculation: (karakterHarcertek, harcertek) => {
        const { bal, jobb } = karakterHarcertek.karakter.kezek;
        const kepzettseg = karakterHarcertek.karakter.kepzettseg('harcmodor:pajzs');
        const pajzsKez: Kez = bal?.fegyver.pajzstype === 'nagy' ? 'bal' : 'jobb';
        const fegyverKez: Kez = pajzsKez === 'bal' ? 'jobb' : 'bal';
        const fegyver = karakterHarcertek.karakter.kezek[fegyverKez] as InventoryKozelharcFegyver;
        const pajzs = karakterHarcertek.karakter.kezek[pajzsKez];
        switch (kepzettseg?.fok) {
            case 1: {
                karakterHarcertek.removeKepzettseg(harcertek);
                karakterHarcertek.applyKepzettseg(harcertek, -1);
                removeCalculationStep(harcertek.kozos.ve, `fegyver:${fegyverKez}`);
                removeAllCalculationSteps(harcertek[pajzsKez]?.tamPerKor);
                break;
            }
            case 2: {
                removeCalculationStep(harcertek.kozos.ve, `fegyver:${fegyverKez}`);
                removeAllCalculationSteps(harcertek[pajzsKez]?.tamPerKor);
                break;
            }
            case 3: {
                break;
            }
            case 4: {
                //itt a pajzs MGT-je is lenullazodik, de ezt nem tudjuk itt kezelni
                // removeCalculationStep(harcertek.kozos.mgt, `fegyver:${pajzsKez}`);
                removeAllCalculationSteps(harcertek[pajzsKez]?.tamPerKor);
                harcertek[pajzsKez]?.tamPerKor.push({
                    id: `fegyver:${pajzsKez}`,
                    nev: pajzs?.fegyver.nev ?? '',
                    value: 1
                });
                break;
            }
            case 5: {
                //itt a pajzs MGT-je is lenullazodik, de ezt nem tudjuk itt kezelni
                // removeCalculationStep(harcertek.kozos.mgt, `fegyver:${pajzsKez}`);
                harcertek.extra.push({
                    id: kepzettseg.kepzettseg.id,
                    nev: kepzettseg.kepzettseg.nev,
                    description: kepzettseg.kepzettseg.szintleiras[4]
                });
                removeAllCalculationSteps(harcertek[pajzsKez]?.tamPerKor);
                harcertek[pajzsKez]?.tamPerKor.push({
                    id: `fegyver:${pajzsKez}`,
                    nev: pajzs?.fegyver.nev ?? '',
                    value: 1
                });
                break;
            }
            default: {
                karakterHarcertek.removeKepzettseg(harcertek);
                karakterHarcertek.applyKepzettseg(harcertek, -2);
                removeCalculationStep(harcertek.kozos.ve, `fegyver:${fegyverKez}`);
                removeAllCalculationSteps(harcertek[pajzsKez]?.tamPerKor);
                break;
            }
        }
    }
}

export const KetkezesFegyverHarcmodor: Harcmodor = {
    id: 'harcmodor:ketkezes',
    nev: getKepzettseg('harcmodor:ketkezes')?.nev ?? '',
    selectable: karakter => {
        const vanKetkezes = KarakterHarcertek.kezek(kez => karakter.kezek[kez]?.fegyver?.kez === 2);
        return vanKetkezes.bal || vanKetkezes.jobb;
    },
    harcertekCalculation: (karakterHarcertek, harcertek) => {
        const { bal, jobb } = karakterHarcertek.karakter.kezek;
        const kepzettseg = karakterHarcertek.karakter.kepzettseg('harcmodor:ketkezes');
        if (kepzettseg) {
            const fok = kepzettseg.fok ?? 0;
            for (let i = 0; i < fok; i++) {
                harcertek.extra.push({
                    id: 'harcmodor:ketkezes',
                    nev: kepzettseg.kepzettseg.nev,
                    description: kepzettseg.kepzettseg.szintleiras[i]
                });
            }
        }
    }
}

export const HARCMODOROK: Array<Harcmodor> = [PajzsHarcmodor, KetkezesFegyverHarcmodor];

export const getHarcmodor = (id: string | null): Harcmodor | null => HARCMODOROK.find(hm => hm.id === id) ?? null;
