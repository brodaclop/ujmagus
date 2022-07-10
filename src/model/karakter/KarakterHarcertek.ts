import { aggregateCalculation, CalculationStep, removeCalculationStep } from "../Calculation";
import { KozelharcFegyver, SebzesTipus } from "../Fegyver";
import { getHarcmodor } from "../harcmodor/Harcmodor";
import { roll } from "../roll";
import { InventoryKozelharcFegyver, Karakter, KarakterKepzettseg, Kez } from "./Karakter";

export interface KezHarcertek {
    ke: Array<CalculationStep>,
    te: Array<CalculationStep>,
    tamPerKor: Array<CalculationStep>,
    sebzes: Array<CalculationStep>,
    tulutesHatar: Array<CalculationStep>,
    sebzestipus: Array<SebzesTipus>;
};

export interface KozosHarcertek {
    ve: Array<CalculationStep>;
    mgt: Array<CalculationStep>;
    sfe: Record<SebzesTipus, Array<CalculationStep>>;
}

export interface CalculatedHarcertek {
    bal: KezHarcertek | null;
    jobb: KezHarcertek | null;
    kozos: KozosHarcertek;
    extra: Array<{
        id: string;
        nev: string;
        description: string;
    }>
}

//TODO: recalculate mgt properly

export const KEPZETTSEG_MODOSITOK: Array<Record<'ke' | 'te' | 've' | 'tulutesHatar', number>> = [
    {
        ke: -10,
        te: -25,
        ve: -20,
        tulutesHatar: 0
    },
    {
        ke: -5,
        te: -5,
        ve: -10,
        tulutesHatar: 0
    },
    {
        ke: 0,
        te: 0,
        ve: 0,
        tulutesHatar: 0
    },
    {
        ke: 2,
        te: 5,
        ve: 5,
        tulutesHatar: 0
    },
    {
        ke: 5,
        te: 10,
        ve: 10,
        tulutesHatar: 0
    },
    {
        ke: 5,
        te: 10,
        ve: 10,
        tulutesHatar: -10
    },
];
export const folottiResz = (kepesseg?: number, hatar: number = 10) => {
    return Math.max(0, ((kepesseg === undefined || Number.isNaN(kepesseg)) ? 0 : kepesseg) - hatar);
}
export class KarakterHarcertek {
    constructor(readonly karakter: Karakter) { }

    fegyverKepzettseg = (fegyver: KozelharcFegyver): KarakterKepzettseg | null => {
        const fegyverKepzettseg = this.karakter.kepzettseg(`fegyver:${fegyver.alapFegyver ?? fegyver.nev}`);
        const fegyverKatKepzettseg = fegyver.kategoria ? this.karakter.kepzettseg(`fegyverkat:${fegyver.kategoria}`) : undefined;
        if (!fegyverKatKepzettseg && !fegyverKepzettseg) {
            return null;
        } else if (fegyverKatKepzettseg && !fegyverKepzettseg) {
            return fegyverKatKepzettseg;
        } else if (!fegyverKatKepzettseg && fegyverKepzettseg) {
            return fegyverKepzettseg;
        } else if (fegyverKatKepzettseg && fegyverKepzettseg) {
            if (fegyverKepzettseg.fok >= fegyverKatKepzettseg.fok) {
                return fegyverKepzettseg;
            } else {
                return fegyverKatKepzettseg;
            }
        }
        // this never happens
        return null;
    }

    private erobonusz = (fegyver: KozelharcFegyver): number => {
        const eroFegyver = fegyver.kepesseg === 'ero' || fegyver.kategoria?.kepesseg === 'ero';
        return folottiResz(this.karakter.kepessegek.ero, eroFegyver ? 14 : 16);
    }

    public harcertek = (): CalculatedHarcertek => {
        const ret = this.initialise();
        this.applyAlap(ret);
        this.applyPancel(ret); // ez jon elsonek az MGT miatt
        this.applyFegyver(ret); // ez jon masodiknak a pajzs MGT miatt
        this.applyKepzettseg(ret); // ez jon harmadiknak a vertviselet/pajzsos harcmodor kepzettseg miatt, ami csokkenti az MGT-t
        this.applyKepessegek(ret); // ez jon utolsonak, mert itt mar hasznaljuk az MGT-t
        if (this.karakter.harcmodorId) {
            getHarcmodor(this.karakter.harcmodorId)?.harcertekCalculation(this, ret);
        }
        return ret;
    }

    public initialise = (): CalculatedHarcertek => {
        return {
            ...KarakterHarcertek.kezek(kez => {
                return this.karakter.kezek[kez] ? {
                    ke: [],
                    te: [],
                    sebzes: [],
                    sebzestipus: [],
                    tamPerKor: [],
                    tulutesHatar: []
                } : null
            }),
            kozos: {
                mgt: [],
                ve: [],
                sfe: {
                    szuro: [],
                    vago: [],
                    zuzo: []
                }
            },
            extra: []
        }
    }

    public static kezek = <T>(fn: (kez: Kez) => T): Record<Kez, T> => ({
        jobb: fn('jobb'),
        bal: fn('bal')
    });
    public applyAlap = (harcertek: CalculatedHarcertek) => {
        const alap: Omit<CalculationStep, 'value'> = { id: 'alap', nev: 'Alap' };
        harcertek.kozos.ve.push({
            ...alap,
            value: this.karakter.harcertekek.ve
        });
        KarakterHarcertek.kezek(kez => {
            harcertek[kez]?.ke.push({
                ...alap,
                value: this.karakter.harcertekek.ke
            });
            harcertek[kez]?.te.push({
                ...alap,
                value: this.karakter.harcertekek.te
            });
            harcertek[kez]?.tulutesHatar.push({
                ...alap,
                value: 50
            });
            harcertek[kez]?.sebzes.push({
                ...alap,
                value: this.karakter.harcertekek.sebzes
            });
        });
    };

    public applyKepessegek = (harcertek: CalculatedHarcertek) => {
        const mgt = roll(aggregateCalculation(harcertek.kozos.mgt)).value;  // itt nem lesz kockadobas, szoval jok vagyunk
        const kepessegek = this.karakter.mgtKepessegek(mgt);
        const gy_ugy = folottiResz(kepessegek.gyorsasag) + folottiResz(kepessegek.ugyesseg);
        const e_gy_ugy = folottiResz(kepessegek.ero) + folottiResz(kepessegek.gyorsasag) + folottiResz(kepessegek.ugyesseg);
        harcertek.kozos.ve.push({
            id: 'kepesseg',
            nev: 'Képesség (GY + ÜGY)',
            value: gy_ugy
        });
        KarakterHarcertek.kezek(kez => {
            harcertek[kez]?.ke.push({
                id: 'kepesseg',
                nev: 'Képesség (GY + ÜGY)',
                value: gy_ugy
            });
            harcertek[kez]?.te.push({
                id: 'kepesseg',
                nev: 'Képesség (E + GY + ÜGY)',
                value: e_gy_ugy
            });
        });
    }

    public applyFegyver = (harcertek: CalculatedHarcertek) => {
        KarakterHarcertek.kezek(kez => {
            const fegyver = this.karakter.kezek[kez]?.fegyver;
            if (fegyver) {
                if (fegyver.mgt) {
                    harcertek.kozos.mgt.push({
                        id: `fegyver:${kez}`,
                        nev: `${fegyver.nev} (${kez} kéz)`,
                        value: fegyver.mgt
                    });
                }
                harcertek.kozos.ve.push({
                    id: `fegyver:${kez}`,
                    nev: `${fegyver.nev} (${kez} kéz)`,
                    value: fegyver.ve
                });
                harcertek[kez]?.te.push({
                    id: 'fegyver',
                    nev: fegyver.nev,
                    value: fegyver.te
                });
                harcertek[kez]?.ke.push({
                    id: 'fegyver',
                    nev: fegyver.nev,
                    value: fegyver.ke
                });
                harcertek[kez]?.sebzes.push({
                    id: 'fegyver',
                    nev: fegyver.nev,
                    value: fegyver.sebzes
                });
                harcertek[kez]?.sebzes.push({
                    id: 'erobonusz',
                    nev: 'Erőbónusz',
                    value: this.erobonusz(fegyver)
                });
                harcertek[kez]?.tamPerKor.push({
                    id: 'fegyver',
                    nev: fegyver.nev,
                    value: fegyver.tamperkor
                });
                harcertek[kez]?.sebzestipus.push(...Array.isArray(fegyver.sebzestipus) ? fegyver.sebzestipus : [fegyver.sebzestipus]);
            }
        });
    }

    public removeKepzettseg = (harcertek: CalculatedHarcertek) => {
        KarakterHarcertek.kezek(kez => {
            removeCalculationStep(harcertek.kozos.ve, `kepzettseg:${kez}`);
            removeCalculationStep(harcertek[kez]?.te, `kepzettseg`);
            removeCalculationStep(harcertek[kez]?.ke, `kepzettseg`);
            removeCalculationStep(harcertek[kez]?.tulutesHatar, `kepzettseg`);
        });

    }

    public applyKepzettseg = (harcertek: CalculatedHarcertek, fokBonusz: number = 0) => {
        const pancel = this.karakter.pancel?.pancel;

        if (pancel) {
            const vertviselet = this.karakter.kepzettseg('vertviselet');
            if (vertviselet) {
                const mgtCsokkentes = Math.min(pancel.mgt, vertviselet?.fok ?? 0);
                harcertek.kozos.mgt.push({
                    id: 'kepzettseg',
                    nev: `${vertviselet.kepzettseg.nev}/${vertviselet.fok}. fok`,
                    value: -mgtCsokkentes
                });
            }
        }

        KarakterHarcertek.kezek(kez => {
            const fegyver = this.karakter.kezek[kez]?.fegyver;
            if (fegyver && !fegyver.pajzstype) {
                const kepzettseg = this.fegyverKepzettseg(fegyver);
                const fok = Math.min(5, Math.max(0, (kepzettseg?.fok ?? 0) + fokBonusz));
                console.log('fok', fok);
                const modosito = KEPZETTSEG_MODOSITOK[fok];
                const nev = fok === 0 ? 'Képzetlen' : `${kepzettseg?.kepzettseg.nev ?? ''}/${fok}. fok`;

                harcertek.kozos.ve.push({
                    id: `kepzettseg:${kez}`,
                    nev,
                    value: modosito.ve
                });
                harcertek[kez]?.te.push({
                    id: `kepzettseg`,
                    nev,
                    value: modosito.te
                });
                harcertek[kez]?.ke.push({
                    id: `kepzettseg`,
                    nev,
                    value: modosito.ke
                });
                harcertek[kez]?.tulutesHatar.push({
                    id: `kepzettseg`,
                    nev,
                    value: modosito.tulutesHatar
                });
            } else if (fegyver?.pajzstype && fegyver?.mgt) {
                const harcmodor = this.karakter.kepzettseg('harcmodor:pajzs');
                if ((harcmodor?.fok ?? 0) >= 4) {
                    harcertek.kozos.mgt.push({
                        id: `kepzettseg`,
                        nev: harcmodor?.kepzettseg.nev ?? '',
                        value: -fegyver.mgt
                    });
                }
            }
        });
    }

    public applyPancel = (harcertek: CalculatedHarcertek) => {
        if (this.karakter.pancel) {
            const pancel = this.karakter.pancel.pancel;
            const alap: Omit<CalculationStep, 'value'> = { id: 'pancel', nev: pancel.nev };
            harcertek.kozos.mgt.push({
                ...alap,
                value: pancel.mgt
            });
            harcertek.kozos.sfe.szuro.push({
                ...alap,
                value: pancel.sfe.szuro
            });
            harcertek.kozos.sfe.vago.push({
                ...alap,
                value: pancel.sfe.vago
            });
            harcertek.kozos.sfe.zuzo.push({
                ...alap,
                value: pancel.sfe.zuzo
            });
        }
    }


}